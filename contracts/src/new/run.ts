/**
 * This file specifies how to run the `NewNonogramZkApp` smart contract locally using the `Mina.LocalBlockchain()` method.
 * The `Mina.LocalBlockchain()` method specifies a ledger of accounts and contains logic for updating the ledger.
 *
 * Please note that this deployment is local and does not deploy to a live network.
 * If you wish to deploy to a live network, please use the zkapp-cli to deploy.
 *
 * To run locally:
 * Build the project: `$ npm run build`
 * Run with node:     `$ node build/src/run.js`.
 */
import { NewNonogramZkApp } from './NewNonogramZkApp.js';
import { AccountUpdate, Mina, PrivateKey, shutdown } from 'snarkyjs';
import { Color } from '../common/types';
import { secretSolution } from '../common/solutionNonogram';
import { solutionColumns, solutionRows } from '../common/jsUtils';
import { NonogramSubmission, SolutionNonogram } from '../common/ioTypes';

// setup
const Local = Mina.LocalBlockchain();
Mina.setActiveInstance(Local);

const account = Local.testAccounts[0].privateKey;
const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();
// create an instance of the smart contract
const zkApp = new NewNonogramZkApp(zkAppAddress);

console.log('Deploying and initializing Nonogram...');
await NewNonogramZkApp.compile();
let tx = await Mina.transaction(account, () => {
  AccountUpdate.fundNewAccount(account);
  zkApp.deploy();
});
await tx.prove();
/**
 * note: this tx needs to be signed with `tx.sign()`, because `deploy` uses `requireSignature()` under the hood,
 * so one of the account updates in this tx has to be authorized with a signature (vs proof).
 * this is necessary for the deploy tx because the initial permissions for all account fields are "signature".
 * (but `deploy()` changes some of those permissions to "proof" and adds the verification key that enables proofs.
 * that's why we don't need `tx.sign()` for the later transactions.)
 */
await tx.sign([zkAppPrivateKey]).send();

const streaks = {
  rows: solutionRows(secretSolution),
  columns: solutionColumns(secretSolution),
};

console.log('Submitting wrong solution...');

const solutionClone = secretSolution.map((row) => row.map((col) => col));
solutionClone[0][0] = Color.hexToFields('000000');
try {
  let tx = await Mina.transaction(account, () => {
    zkApp.submitSolution(
      NonogramSubmission.from(solutionClone),
      SolutionNonogram.fromJS(streaks)
    );
  });
  await tx.prove();
  await tx.send();
} catch {
  console.log('There was an error submitting the solution, as expected');
}

// submit the actual solution
console.log('Submitting solution...');
tx = await Mina.transaction(account, () => {
  zkApp.submitSolution(
    NonogramSubmission.from(secretSolution),
    SolutionNonogram.fromJS(streaks)
  );
});
await tx.prove();
await tx.send();
console.log('Solution accepted!');

// cleanup
await shutdown();
