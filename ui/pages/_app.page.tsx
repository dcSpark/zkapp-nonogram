import '../styles/globals.css';
import '../styles/Home.module.css';

import { useEffect, useState } from 'react';
import './reactCOIServiceWorker';

import ZkappWorkerClient from './zkappWorkerClient';
import { PublicKey, Field } from 'snarkyjs';
import Home from './index.page';
import React from 'react';

export type SnarkyState = {
  zkappWorkerClient: null | ZkappWorkerClient;
  hasBeenSetup: boolean;
  contractBoardHash: null | Field;
  zkappPublicKey: null | PublicKey;
};

interface SnarkyContextObject {
  zkappWorkerClient: SnarkyState['zkappWorkerClient'];
  hasBeenSetup: SnarkyState['hasBeenSetup'];
  contractBoardHash: SnarkyState['contractBoardHash'];
}
const SnarkyContext = React.createContext<SnarkyContextObject>(null!);

export default function App() {
  let [state, setState] = useState<SnarkyState>({
    zkappWorkerClient: null,
    hasBeenSetup: false,
    contractBoardHash: null,
    zkappPublicKey: null,
  });

  const context: SnarkyContextObject = {
    zkappWorkerClient: state.zkappWorkerClient,
    hasBeenSetup: state.hasBeenSetup,
    contractBoardHash: state.contractBoardHash,
  };

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

        await zkappWorkerClient.loadContract();

        console.log('compiling zkApp');
        await zkappWorkerClient.compileContract();
        console.log('zkApp compiled');

        const zkappPublicKey = PublicKey.fromBase58(
          'B62qrKXoY2VJjE594fPTqu2SdmDwwYi4pB6P4jAQmBe8bXar2WeNaZY'
        );

        await zkappWorkerClient.initZkappInstance(zkappPublicKey);

        console.log('getting zkApp state...');
        await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });
        const contractBoardHash = await zkappWorkerClient.getBoardHash();
        console.log('current state:', contractBoardHash.toString());

        setState({
          ...state,
          zkappWorkerClient,
          hasBeenSetup: true,
          zkappPublicKey,
          contractBoardHash,
        });
      }
    })();
  }, []);

  // <button onClick={() => onSendTransaction} disabled={state.creatingTransaction}>
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

  return <SnarkyContext.Provider value={context}>{<Home />}</SnarkyContext.Provider>;
}

export function useSnarky(): SnarkyContextObject {
  return React.useContext(SnarkyContext);
}
