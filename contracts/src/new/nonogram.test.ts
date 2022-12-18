import { NewNonogramZkApp } from './NewNonogramZkApp';
import {
  isReady,
  shutdown,
  PrivateKey,
  PublicKey,
  Mina,
  AccountUpdate,
  Field,
} from 'snarkyjs';
import { genSecretSolution } from '../common/solution';
import { Color } from '../common/types';
import { solutionColumns, solutionRows } from '../common/jsUtils';
import { NonogramSubmission, SolutionNonogram } from '../common/ioTypes';

describe('nonogram', () => {
  let zkAppPrivateKey: PrivateKey,
    zkAppAddress: PublicKey,
    account: PrivateKey,
    secretSolution: Color[][];

  beforeEach(async () => {
    await isReady;
    let Local = Mina.LocalBlockchain({ proofsEnabled: false });
    Mina.setActiveInstance(Local);
    account = Local.testAccounts[0].privateKey;
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    // console.log(zkAppPrivateKey.toBase58());
    // console.log(zkAppAddress.toBase58());
    secretSolution = await genSecretSolution();
    // zkApp = new NewNonogramZkApp(zkAppAddress);
  });

  afterAll(() => {
    setTimeout(shutdown, 0);
  });

  it('accepts a correct solution', async () => {
    const zkApp = new NewNonogramZkApp(zkAppAddress);
    await deploy(zkApp, zkAppPrivateKey, account);

    const submission = NonogramSubmission.from(secretSolution);
    const streaks = {
      rows: solutionRows(secretSolution),
      columns: solutionColumns(secretSolution),
    };
    const tx = await Mina.transaction(account, () => {
      zkApp.submitSolution(submission, SolutionNonogram.fromJS(streaks));
    });
    await tx.prove();
    await tx.send();
  });

  // it('rejects an incorrect solution', async () => {
  //   const zkApp = new NewNonogramZkApp(zkAppAddress);
  //   await deploy(zkApp, zkAppPrivateKey, account);

  //   const solutionClone = secretSolution.map((row) => row.map((col) => col));
  //   solutionClone[0][0] = Color.hexToFields('000000');

  //   const streaks = {
  //     rows: solutionRows(secretSolution),
  //     columns: solutionColumns(secretSolution),
  //   };

  //   await expect(async () => {
  //     let tx = await Mina.transaction(account, () => {
  //       let zkApp = new NewNonogramZkApp(zkAppAddress);
  //       zkApp.submitSolution(
  //         NonogramSubmission.from(solutionClone),
  //         SolutionNonogram.fromJS(streaks)
  //       );
  //     });
  //     await tx.prove();
  //     await tx.send();
  //   }).rejects.toThrow(/nonogram does not match the one committed on-chain/);
  // });

  // it('rejects an incorrect streaks', async () => {
  //   const zkApp = new NewNonogramZkApp(zkAppAddress);
  //   await deploy(zkApp, zkAppPrivateKey, account);

  //   const streaks = {
  //     rows: solutionRows(secretSolution),
  //     columns: solutionColumns(secretSolution),
  //   };
  //   streaks.rows[0][0] = { color: new Color(0), length: Field(1) };

  //   await expect(async () => {
  //     let tx = await Mina.transaction(account, () => {
  //       let zkApp = new NewNonogramZkApp(zkAppAddress);
  //       zkApp.submitSolution(
  //         NonogramSubmission.from(secretSolution),
  //         SolutionNonogram.fromJS(streaks)
  //       );
  //     });
  //     await tx.prove();
  //     await tx.send();
  //   }).rejects.toThrow(
  //     /streaks do not match the on-chain committed streaks for this nonogram/
  //   );
  // });
});

async function deploy(
  zkApp: NewNonogramZkApp,
  zkAppPrivateKey: PrivateKey,
  account: PrivateKey
) {
  let tx = await Mina.transaction(account, () => {
    AccountUpdate.fundNewAccount(account);
    zkApp.deploy();
  });
  await tx.prove();
  // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
  await tx.sign([zkAppPrivateKey]).send();
}
