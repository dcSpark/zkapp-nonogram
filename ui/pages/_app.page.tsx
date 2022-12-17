import '../styles/globals.css';
import '../styles/Home.module.css';

import { useEffect, useState } from 'react';
import './reactCOIServiceWorker';

import ZkappWorkerClient from './zkappWorkerClient';
import type { NonogramSubmission } from '../../contracts/src/NonogramZkApp';
import { PublicKey, PrivateKey, Field } from 'snarkyjs';
import { SpinnerCircular } from 'spinners-react';
import Home from './index.page';

let transactionFee = 0.1;

export default function App() {
  let [state, setState] = useState({
    zkappWorkerClient: null as null | ZkappWorkerClient,
    hasWallet: null as null | boolean,
    hasBeenSetup: false,
    accountExists: false,
    currentHash: null as null | Field, // hash in the nonogram contract
    publicKey: null as null | PublicKey,
    zkappPublicKey: null as null | PublicKey,
    creatingTransaction: false,
    createdTxHash: String,
  });

  // -------------------------------------------------------
  // Do Setup

  useEffect(() => {
    (async () => {
      if (!state.hasBeenSetup) {
        const zkappWorkerClient = new ZkappWorkerClient();

        console.log('Loading SnarkyJS...');
        await zkappWorkerClient.loadSnarkyJS();
        console.log('done');

        await zkappWorkerClient.setActiveInstanceToBerkeley();

        const mina = (window as any).mina;

        if (mina == null) {
          setState({ ...state, hasWallet: false });
          return;
        }

        const publicKeyBase58: string = (await mina.requestAccounts())[0];
        const publicKey = PublicKey.fromBase58(publicKeyBase58);

        console.log('using key', publicKey.toBase58());

        console.log('checking if account exists...');
        const res = await zkappWorkerClient.fetchAccount({ publicKey: publicKey! });
        const accountExists = res.error == null;

        await zkappWorkerClient.loadContract();

        console.log('compiling zkApp');
        await zkappWorkerClient.compileContract();
        console.log('zkApp compiled');

        // TODO
        const zkappPublicKey = PublicKey.fromBase58(
          'B62qohbssEnVvbQPKyRaexKrrqzEUCmKNY4bSjvAvPH1xwtuDdCMpdw'
        );

        await zkappWorkerClient.initZkappInstance(zkappPublicKey);

        console.log('getting zkApp state...');
        await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });
        const currentHash = await zkappWorkerClient.getHash();
        console.log('current state:', currentHash.toString());

        setState({
          ...state,
          zkappWorkerClient,
          hasWallet: true,
          hasBeenSetup: true,
          publicKey,
          zkappPublicKey,
          accountExists,
          currentHash,
        });
      }
    })();
  }, []);

  // -------------------------------------------------------
  // Wait for account to exist, if it didn't

  useEffect(() => {
    (async () => {
      if (state.hasBeenSetup && !state.accountExists) {
        for (;;) {
          console.log('checking if account exists...');
          const res = await state.zkappWorkerClient!.fetchAccount({ publicKey: state.publicKey! });
          const accountExists = res.error == null;
          if (accountExists) {
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
        setState({ ...state, accountExists: true });
      }
    })();
  }, [state.hasBeenSetup]);

  // -------------------------------------------------------
  // Send a transaction

  const onSendTransaction = async (args: { solution: NonogramSubmission }) => {
    setState({ ...state, creatingTransaction: true });
    console.log('sending a transaction...');

    await state.zkappWorkerClient!.fetchAccount({ publicKey: state.publicKey! });

    await state.zkappWorkerClient!.submitSolutionTransaction(args);

    console.log('creating proof...');
    await state.zkappWorkerClient!.proveSolutionTransaction();

    console.log('getting Transaction JSON...');
    const transactionJSON = await state.zkappWorkerClient!.getTransactionJSON();

    console.log('requesting send transaction...');
    const { hash } = await (window as any).mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        fee: transactionFee,
        memo: '',
      },
    });

    console.log('See transaction at https://berkeley.minaexplorer.com/transaction/' + hash);

    setState({ ...state, creatingTransaction: false, createdTxHash: hash });
  };

  // -------------------------------------------------------
  // Refresh the current state

  const onRefreshCurrentHash = async () => {
    console.log('getting zkApp state...');
    await state.zkappWorkerClient!.fetchAccount({ publicKey: state.zkappPublicKey! });
    const currentHash = await state.zkappWorkerClient!.getHash();
    console.log('current state:', currentHash.toString());

    setState({ ...state, currentHash });
  };

  // -------------------------------------------------------
  // Create UI elements

  let hasWallet;
  if (state.hasWallet != null && !state.hasWallet) {
    const auroLink = 'https://www.aurowallet.com/';
    const auroLinkElem = (
      <a href={auroLink} target="_blank" rel="noreferrer">
        {' '}
        [Link]{' '}
      </a>
    );
    hasWallet = <div> Could not find a wallet. Install Auro wallet here: {auroLinkElem}</div>;
  }

  let setupText = state.hasBeenSetup ? 'SnarkyJS Ready' : 'Setting up SnarkyJS...';
  let setup = (
    <div style={{ color: 'white', width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' }}>
      {' '}
      <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' }}>
        <SpinnerCircular size={48} enabled={true} />
      </div>
      {setupText} {hasWallet}
    </div>
  );

  let accountDoesNotExist;
  if (state.hasBeenSetup && !state.accountExists) {
    const faucetLink = 'https://faucet.minaprotocol.com/?address=' + state.publicKey!.toBase58();
    accountDoesNotExist = (
      <div>
        Account does not exist. Please visit the faucet to fund this account
        <a href={faucetLink} target="_blank" rel="noreferrer">
          {' '}
          [Link]{' '}
        </a>
      </div>
    );
  }

  // <button onClick={() => onSendTransaction} disabled={state.creatingTransaction}>
  let mainContent = <Home />;
  // if (state.hasBeenSetup && state.accountExists) {
  //   mainContent = (
  //     <div>
  //       <button onClick={onSendTransaction} disabled={state.creatingTransaction}>
  //         {' '}
  //         Send Transaction{' '}
  //       </button>
  //       <div style={{color: "white"}}> Current hash in zkApp: {state.currentHash!.toString()} </div>
  //       <button onClick={onRefreshCurrentHash}> Get Latest State </button>
  //     </div>
  //   );
  // }

  return (
    <div style={{ width: '100%' }}>
      {setup}
      {accountDoesNotExist}
      {mainContent}
    </div>
  );
}
