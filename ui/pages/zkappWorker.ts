import { Mina, isReady, PublicKey, PrivateKey, Field, fetchAccount } from 'snarkyjs';

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { NonogramZkApp } from 'nonogram-zkapp/src/index';
import type { NonogramSubmission, SolutionNonogram } from 'nonogram-zkapp/src/common/ioTypes';
import type { StreakList } from '../src/components/game/Streaks';

const state = {
  NonogramZkApp: null as null | typeof NonogramZkApp,
  zkapp: null as null | NonogramZkApp,
  transaction: null as null | Transaction,
};

async function toZkStreaks(streaks: {
  rows: StreakList[];
  cols: StreakList[];
}): Promise<SolutionNonogram> {
  const { SolutionNonogram } = await import('nonogram-zkapp/build/src/common/ioTypes');
  const { Color } = await import('nonogram-zkapp/build/src/common/types');
  return SolutionNonogram.fromJS({
    rows: streaks.rows.map(row =>
      row.map(entry => ({ length: Field(entry.length), color: new Color(entry.color) }))
    ),
    columns: streaks.cols.map(column =>
      column.map(entry => ({ length: Field(entry.length), color: new Color(entry.color) }))
    ),
  });
}

async function toZkColors(colors: number[][]): Promise<NonogramSubmission> {
  const { Color } = await import('nonogram-zkapp/build/src/common/types');
  const { NonogramSubmission } = await import('nonogram-zkapp/build/src/common/ioTypes');
  return NonogramSubmission.from(colors.map(rows => rows.map(col => new Color(col))));
}

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
    const { NonogramZkApp } = await import('nonogram-zkapp/build/src/index');
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
  calcBoardHash: async (streaks: { rows: StreakList[]; cols: StreakList[] }): Promise<string> => {
    const solutionStreaks = await toZkStreaks(streaks);
    const boardHash = solutionStreaks.hash();
    return JSON.stringify(boardHash.toJSON());
  },
  getBoardHash: async (args: {}) => {
    const currentHash = await state.zkapp!.nonogramHash.get();
    return JSON.stringify(currentHash.toJSON());
  },
  submitSolutionTransaction: async (args: {
    solution: number[][];
    streaks: { rows: StreakList[]; cols: StreakList[] };
  }) => {
    const solutionStreaks = await toZkStreaks(args.streaks);
    const solution = await toZkColors(args.solution);
    const transaction = await Mina.transaction(() => {
      state.zkapp!.submitSolution(solution, solutionStreaks);
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
