import { NonogramSubmission, NonogramZkApp } from './NonogramZkApp';
import {
  isReady,
  shutdown,
  PrivateKey,
  PublicKey,
  Mina,
  AccountUpdate,
} from 'snarkyjs';
import { genSecretSolution } from './solution';
import { Color } from './types';
import { solutionColumns, solutionRows } from './circuitUtils';

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
    secretSolution = genSecretSolution();
    // zkApp = new NonogramZkApp(zkAppAddress);
  });

  afterAll(() => {
    setTimeout(shutdown, 0);
  });

  it('accepts a correct solution', async () => {
    const zkApp = new NonogramZkApp(zkAppAddress);
    await deploy(zkApp, zkAppPrivateKey, account);

    const submission = NonogramSubmission.from(secretSolution);
    console.log(
      JSON.stringify({
        rows: solutionRows(secretSolution),
        columns: solutionColumns(secretSolution),
      })
    );
    const tx = await Mina.transaction(account, () => {
      zkApp.submitSolution(submission);
    });
    await tx.prove();
    await tx.send();
  });

  it('rejects an incorrect solution', async () => {
    const zkApp = new NonogramZkApp(zkAppAddress);
    await deploy(zkApp, zkAppPrivateKey, account);

    const solutionClone = secretSolution.map((row) => row.map((col) => col));
    solutionClone[0][0] = Color.hexToFields('000000');

    await expect(async () => {
      let tx = await Mina.transaction(account, () => {
        let zkApp = new NonogramZkApp(zkAppAddress);
        zkApp.submitSolution(NonogramSubmission.from(solutionClone));
      });
      await tx.prove();
      await tx.send();
    }).rejects.toThrow(/nonogram does not match the one committed on-chain/);
  });
});

async function deploy(
  zkApp: NonogramZkApp,
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
