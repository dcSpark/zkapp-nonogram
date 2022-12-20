import { NewNonogramZkApp } from './NewNonogramZkApp.js';
import { AccountUpdate, Mina, PrivateKey, shutdown } from 'snarkyjs';
import minimist from 'minimist';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

type KeyFileContent = {
  privateKey: string;
  publicKey: string;
};

const argv = minimist(process.argv.slice(2));

const personalKeys: KeyFileContent = require(argv.personal ??
  '../../../keys/berkeley.json');
const appKeys: KeyFileContent = require(argv.app ??
  '../../../keys/personal.json');

// setup
const Local = Mina.BerkeleyQANet(
  'https://proxy.berkeley.minaexplorer.com/graphql'
);
Mina.setActiveInstance(Local);

const account = PrivateKey.fromBase58(personalKeys.privateKey);
const zkAppPrivateKey = PrivateKey.fromBase58(appKeys.privateKey);
const zkAppAddress = zkAppPrivateKey.toPublicKey();
// create an instance of the smart contract
const zkApp = new NewNonogramZkApp(zkAppAddress);

console.log('Deploying and initializing Nonogram...');
const compiledContract = await NewNonogramZkApp.compile();
console.log(JSON.stringify(compiledContract.provers));
let deployTx = await Mina.transaction(
  {
    feePayerKey: account,
    fee: 100000000,
  },
  () => {
    AccountUpdate.fundNewAccount(account);
    zkApp.deploy({
      zkappKey: zkAppPrivateKey,
    });
  }
);
await deployTx.prove();
/**
 * note: this tx needs to be signed with `tx.sign()`, because `deploy` uses `requireSignature()` under the hood,
 * so one of the account updates in this tx has to be authorized with a signature (vs proof).
 * this is necessary for the deploy tx because the initial permissions for all account fields are "signature".
 * (but `deploy()` changes some of those permissions to "proof" and adds the verification key that enables proofs.
 * that's why we don't need `tx.sign()` for the later transactions.)
 */
await deployTx.sign([zkAppPrivateKey, account]).send();

// Note: this tx shouldn't be required. I was just hitting a bug with zk deploy.
// console.log('Initializing Nonogram...');
// let updateTx = await Mina.transaction(
// {
//   feePayerKey: account,
//   fee: 100000000,
// },
//   () => {
//     zkApp.update(
//       Field(
//         '12088336191140403124638594755517918076968435720907935785006885229166255168908'
//       )
//     );
//   }
// );
// await updateTx.prove();
// await updateTx.send();

// cleanup
await shutdown();
