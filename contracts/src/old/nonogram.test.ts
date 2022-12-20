import { OldNonogramZkApp } from './OldNonogramZkApp.js';
import {
  isReady,
  shutdown,
  PrivateKey,
  PublicKey,
  Mina,
  AccountUpdate,
} from 'snarkyjs';
import { Color } from '../common/types.js';
import { solutionColumns, solutionRows } from './circuitUtils.js';
import { NonogramSubmission } from '../common/ioTypes.js';
import { getSolution } from 'nonogram-generator/src/imageParser.js';

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
    const parsedSolution = await getSolution(
      '../generator/puzzles/production.png'
    );
    secretSolution = parsedSolution.map((row) =>
      row.map((col) => new Color(col))
    );
    // zkApp = new OldNonogramZkApp(zkAppAddress);
  });

  afterAll(() => {
    setTimeout(shutdown, 0);
  });

  it('accepts a correct solution', async () => {
    const zkApp = new OldNonogramZkApp(zkAppAddress);
    await deploy(zkApp, zkAppPrivateKey, account);

    const color = Color.noColor();
    const submission = NonogramSubmission.from(secretSolution);
    console.log(
      JSON.stringify({
        rows: solutionRows(secretSolution, color),
        columns: solutionColumns(secretSolution, color),
      })
    );
    const tx = await Mina.transaction(account, () => {
      zkApp.submitSolution(submission);
    });
    await tx.prove();
    await tx.send();
  });

  it('rejects an incorrect solution', async () => {
    const zkApp = new OldNonogramZkApp(zkAppAddress);
    await deploy(zkApp, zkAppPrivateKey, account);

    const solutionClone = secretSolution.map((row) => row.map((col) => col));
    solutionClone[0][0] = Color.hexToFields('000000');

    await expect(async () => {
      let tx = await Mina.transaction(account, () => {
        let zkApp = new OldNonogramZkApp(zkAppAddress);
        zkApp.submitSolution(NonogramSubmission.from(solutionClone));
      });
      await tx.prove();
      await tx.send();
    }).rejects.toThrow(/nonogram does not match the one committed on-chain/);
  });
});

async function deploy(
  zkApp: OldNonogramZkApp,
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
