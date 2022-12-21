import { fetchAccount, PublicKey, PrivateKey, Field } from 'snarkyjs';

import type { ZkappWorkerRequest, ZkappWorkerReponse, WorkerFunctions } from './zkappWorker';
import type { NonogramSubmission } from 'nonogram-zkapp/src/NonogramZkApp';
import type { StreakList } from '../src/components/game/Streaks';

export default class ZkappWorkerClient {
  // ---------------------------------------------------------------------------------------

  loadSnarkyJS() {
    return this._call('loadSnarkyJS', {});
  }

  setActiveInstanceToBerkeley() {
    return this._call('setActiveInstanceToBerkeley', {});
  }

  loadContract() {
    return this._call('loadContract', {});
  }

  compileContract() {
    return this._call('compileContract', {});
  }

  fetchAccount({ publicKey }: { publicKey: PublicKey }): ReturnType<typeof fetchAccount> {
    const result = this._call('fetchAccount', { publicKey58: publicKey.toBase58() });
    return result as ReturnType<typeof fetchAccount>;
  }

  initZkappInstance(publicKey: PublicKey) {
    return this._call('initZkappInstance', { publicKey58: publicKey.toBase58() });
  }

  async calcBoardHash(streaks: { rows: StreakList[]; cols: StreakList[] }): Promise<Field> {
    const result = await this._call('calcBoardHash', { rows: streaks.rows, cols: streaks.cols });
    return Field.fromJSON(JSON.parse(result as string));
  }

  async getBoardHash(): Promise<Field> {
    const result = await this._call('getBoardHash', {});
    return Field.fromJSON(JSON.parse(result as string));
  }

  submitSolutionTransaction(args: { solution: number[][], streaks: { rows: StreakList[]; cols: StreakList[] } }) { 
    return this._call('submitSolutionTransaction', args);
  }

  proveSolutionTransaction() {
    return this._call('proveSolutionTransaction', {});
  }

  async getTransactionJSON() {
    const result = await this._call('getTransactionJSON', {});
    return result;
  }

  // ---------------------------------------------------------------------------------------

  worker: Worker;

  promises: { [id: number]: { resolve: (res: any) => void; reject: (err: any) => void } };

  nextId: number;

  constructor() {
    this.worker = new Worker(new URL('./zkappWorker.ts', import.meta.url));
    this.promises = {};
    this.nextId = 0;

    this.worker.onmessage = (event: MessageEvent<ZkappWorkerReponse>) => {
      this.promises[event.data.id].resolve(event.data.data);
      delete this.promises[event.data.id];
    };
  }

  _call(fn: WorkerFunctions, args: any) {
    return new Promise((resolve, reject) => {
      this.promises[this.nextId] = { resolve, reject };

      const message: ZkappWorkerRequest = {
        id: this.nextId,
        fn,
        args,
      };

      this.worker.postMessage(message);

      this.nextId++;
    });
  }
}
