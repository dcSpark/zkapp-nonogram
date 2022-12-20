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
import { Color } from '../common/types';
import {
  circuitGameInfo,
  NonogramSubmission,
  SolutionNonogram,
} from '../common/ioTypes';
import { getSolution } from 'nonogram-generator/src/imageParser';

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
    // zkApp = new NewNonogramZkApp(zkAppAddress);
  });

  afterAll(() => {
    setTimeout(shutdown, 0);
  });

  it('accepts a correct solution', async () => {
    const zkApp = new NewNonogramZkApp(zkAppAddress);
    await deploy(zkApp, zkAppPrivateKey, account);

    const submission = NonogramSubmission.from(secretSolution);
    const tx = await Mina.transaction(account, () => {
      zkApp.submitSolution(
        submission,
        SolutionNonogram.fromJS(circuitGameInfo)
      );
    });
    await tx.prove();
    await tx.send();
  });

  it('rejects an incorrect solution', async () => {
    const zkApp = new NewNonogramZkApp(zkAppAddress);
    await deploy(zkApp, zkAppPrivateKey, account);

    const solutionClone = secretSolution.map((row) => row.map((col) => col));
    solutionClone[0][0] = Color.hexToFields('000000');

    await expect(async () => {
      let tx = await Mina.transaction(account, () => {
        let zkApp = new NewNonogramZkApp(zkAppAddress);
        zkApp.submitSolution(
          NonogramSubmission.from(solutionClone),
          SolutionNonogram.fromJS(circuitGameInfo)
        );
      });
      await tx.prove();
      await tx.send();
    }).rejects.toThrow(/Error: assert_equal/);
  });

  it('rejects an incorrect streaks', async () => {
    const zkApp = new NewNonogramZkApp(zkAppAddress);
    await deploy(zkApp, zkAppPrivateKey, account);

    const streaksClone = {
      rows: circuitGameInfo.rows.map((row) => row.map((streak) => streak)),
      columns: circuitGameInfo.columns.map((column) =>
        column.map((streak) => streak)
      ),
    };
    streaksClone.rows[0][0] = { color: new Color(0), length: Field(1) };

    await expect(async () => {
      let tx = await Mina.transaction(account, () => {
        let zkApp = new NewNonogramZkApp(zkAppAddress);
        zkApp.submitSolution(
          NonogramSubmission.from(secretSolution),
          SolutionNonogram.fromJS(streaksClone)
        );
      });
      await tx.prove();
      await tx.send();
    }).rejects.toThrow(
      /streaks do not match the on-chain committed streaks for this nonogram/
    );
  });
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
