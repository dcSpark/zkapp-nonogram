import { Mina, isReady, PublicKey, PrivateKey, Field, fetchAccount } from 'snarkyjs';

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { NonogramZkApp, NonogramSubmission } from '../../contracts/src/NonogramZkApp';

const state = {
  NonogramZkApp: null as null | typeof NonogramZkApp,
  zkapp: null as null | NonogramZkApp,
  transaction: null as null | Transaction,
};

// ---------------------------------------------------------------------------------------

const functions = {
  loadSnarkyJS: async (args: {}) => {
    await isReady;
  },
  setActiveInstanceToBerkeley: async (args: {}) => {
    const Berkeley = Mina.BerkeleyQANet('https://proxy.berkeley.minaexplorer.com/graphql');
    Mina.setActiveInstance(Berkeley);
  },
  loadContract: async (args: {}) => {
    const { NonogramZkApp } = await import('../../contracts/build/src/NonogramZkApp.js');
    state.NonogramZkApp = NonogramZkApp;
  },
  compileContract: async (args: {}) => {
    await state.NonogramZkApp!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.NonogramZkApp!(publicKey);
  },
  getHash: async (args: {}) => {
    const currentHash = await state.zkapp!.nonogramHash.get();
    return JSON.stringify(currentHash.toJSON());
  },
  submitSolutionTransaction: async (args: { solution: NonogramSubmission }) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.submitSolution(args.solution);
    });
    state.transaction = transaction;
  },
  proveSolutionTransaction: async (args: {}) => {
    await state.transaction!.prove();
  },
  getTransactionJSON: async (args: {}) => {
    return state.transaction!.toJSON();
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkappWorkerReponse = {
  id: number;
  data: any;
};
if (process.browser) {
  addEventListener('message', async (event: MessageEvent<ZkappWorkerRequest>) => {
    const returnData = await functions[event.data.fn](event.data.args);

    const message: ZkappWorkerReponse = {
      id: event.data.id,
      data: returnData,
    };
    postMessage(message);
  });
}
