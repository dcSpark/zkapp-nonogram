import { NonogramSubmission, NonogramZkApp } from './nonogram';
import {
  isReady,
  shutdown,
  PrivateKey,
  PublicKey,
  Mina,
  AccountUpdate,
} from 'snarkyjs';
import { genSecretSolution } from './solution.js';
import { Color } from './types.js';
import { solutionColumns, solutionRows } from './circuitUtils.js';

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

    // const events = await zkApp.fetchEvents();
    // const verifiedEventValue = events[0].event.toFields(null)[0];
    // expect(verifiedEventValue).toEqual("9745901556730586602254241540205477356877189563359647213102193662741991851935");
  });

  it('rejects an incorrect solution', async () => {
    const zkApp = new NonogramZkApp(zkAppAddress);
    await deploy(zkApp, zkAppPrivateKey, account);

    const solutionClone = JSON.parse(JSON.stringify(secretSolution));
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
