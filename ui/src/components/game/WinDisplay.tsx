import { useEffect, useState } from 'react';
import { PublicKey, Field } from 'snarkyjs';
import { SpinnerCircular } from 'spinners-react';

import { useHistory } from './History';
import { useSnarky } from '../../../pages/_app.page';
import { boardToContractForm, useGameBoard } from './Board';

const transactionFee = 0.1;

export function WinDisplay() {
  const history = useHistory();
  const board = useGameBoard();
  const snarky = useSnarky();

  const [creatingTransaction, setCreatingTransaction] = useState<boolean>(false);
  const [createdTxHash, setCreatedTxHash] = useState<string | undefined>(undefined);
  const [accountExists, setAccountExists] = useState<boolean>(true);
  const [hasWallet, setHasWallet] = useState<null | boolean>(null);
  const [expectedBoardHash, setExpectedBoardHash] = useState<undefined | Field>(undefined);
  const [publicKeyBase58, setPublicKeyBase58] = useState<null | string>(null);

  const { winState } = history.getLatestSnapshot();
  const boardDescription = board.getBoardDescription();
  useEffect(() => {
    // don't want to trigger right away, or `mina` may not be injected yet
    if (winState) {
      const mina = (window as any).mina;
      if (mina != null) {
        setHasWallet(true);
        mina.requestAccounts().then((accounts: string[]) => setPublicKeyBase58(accounts[0]));
      }
    }
  }, [winState]);
  // -------------------------------------------------------
  // Send a transaction

  const onSendTransaction = async () => {
    const mina = (window as any).mina;
    if (
      snarky == null ||
      mina == null ||
      snarky.zkappWorkerClient == null ||
      boardDescription == null ||
      publicKeyBase58 == null
    )
      return;
    const publicKey = PublicKey.fromBase58(publicKeyBase58);

    console.log('using key', publicKey.toBase58());

    console.log('checking if account exists...');
    const res = await snarky.zkappWorkerClient.fetchAccount({ publicKey: publicKey });

    if (res.error != null) {
      setAccountExists(false);
      return;
    }

    setCreatingTransaction(true);
    console.log('sending a transaction...');

    try {
      await snarky.zkappWorkerClient!.fetchAccount({ publicKey: publicKey });

      const streaks = board.getExpectedStreaks();
      await snarky.zkappWorkerClient!.submitSolutionTransaction({
        solution: boardToContractForm(
          board.getDimensions(),
          board.getBoard(),
          boardDescription,
          board.getNumColors()
        ),
        streaks: streaks.toContractForm(boardDescription, board.getNumColors()),
      });

      console.log('creating proof...');
      await snarky.zkappWorkerClient!.proveSolutionTransaction();

      console.log('getting Transaction JSON...');
      const transactionJSON = await snarky.zkappWorkerClient!.getTransactionJSON();

      console.log('requesting send transaction...');
      const { hash } = await (window as any).mina.sendTransaction({
        transaction: transactionJSON,
        feePayer: {
          fee: transactionFee,
          memo: '',
        },
      });

      console.log('See transaction at https://berkeley.minaexplorer.com/transaction/' + hash);
      setCreatedTxHash(hash);
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingTransaction(false);
    }
  };

  useEffect(() => {
    const { contractBoardHash } = snarky;
    if (!snarky.hasBeenSetup || contractBoardHash == null || boardDescription == null) return;
    const streaks = board.getExpectedStreaks();
    (async () => {
      const boardHash = await snarky.zkappWorkerClient!.calcBoardHash(
        streaks.toContractForm(boardDescription, board.getNumColors())
      );
      setExpectedBoardHash(boardHash);
    })();
  }, [snarky.hasBeenSetup, snarky.contractBoardHash]);

  // -------------------------------------------------------
  // Create UI elements

  let hasWalletElem;
  if (hasWallet === false) {
    const auroLink = 'https://www.aurowallet.com/';
    const auroLinkElem = (
      <a href={auroLink} target="_blank" rel="noreferrer">
        {' '}
        [Link]{' '}
      </a>
    );
    hasWalletElem = <div> Could not find a wallet. Install Auro wallet here: {auroLinkElem}</div>;
  }

  let setup;
  if (!snarky.hasBeenSetup) {
    setup = (
      <div
        style={{
          color: 'white',
          marginTop: '32px',
          width: 'fit-content',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {' '}
        <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' }}>
          <SpinnerCircular size={48} enabled={true} />
        </div>
        Setting up SnarkyJS... {hasWalletElem}
      </div>
    );
  }

  let accountDoesNotExist;
  if (snarky.hasBeenSetup && !accountExists && publicKeyBase58 != null) {
    const faucetLink = 'https://faucet.minaprotocol.com/?address=' + publicKeyBase58;
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

  let boardDoesNotMatch;
  if (
    snarky != null &&
    snarky.contractBoardHash != null &&
    expectedBoardHash != null &&
    expectedBoardHash.equals(snarky.contractBoardHash).toBoolean() === false
  ) {
    boardDoesNotMatch = (
      <div>
        <p>Board seen below does not match the one on-chain in the smart contract.</p>
        <p>
          {`Currently viewing board ${expectedBoardHash}, but on-chain hash is for board ${snarky.contractBoardHash}`}
        </p>
      </div>
    );
  }

  let seeTransactionElem;
  if (createdTxHash != null) {
    return (
      <div>
        See transaction{' '}
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://berkeley.minaexplorer.com/transaction/${createdTxHash}`}
        >
          here
        </a>
      </div>
    );
  }

  let submitButtonElem;
  if (
    snarky.hasBeenSetup &&
    hasWalletElem == null &&
    boardDoesNotMatch == null &&
    accountDoesNotExist == null
  ) {
    submitButtonElem = (
      <div style={{ display: 'flex', alignItems: 'end' }}>
        <SpinnerCircular size={24} enabled={creatingTransaction} />
        <button onClick={onSendTransaction} disabled={creatingTransaction}>
          {' '}
          Send Transaction{' '}
        </button>
      </div>
    );
  }

  return (
    <div>
      {winState && (
        <div>
          {setup}
          <SimpleWinDisplay />
          {submitButtonElem}
        </div>
      )}
      {boardDoesNotMatch}
      {accountDoesNotExist}
      {seeTransactionElem}
    </div>
  );
}

export function SimpleWinDisplay() {
  return <p>You won!</p>;
}
