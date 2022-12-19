import { NewNonogramZkApp } from './NewNonogramZkApp.js';
import { AccountUpdate, Field, Mina, PrivateKey, shutdown } from 'snarkyjs';

const personalPrivateKey = '';
const appPrivateKey = '';

// setup
const Local = Mina.BerkeleyQANet(
  'https://proxy.berkeley.minaexplorer.com/graphql'
);
Mina.setActiveInstance(Local);

const account = PrivateKey.fromBase58(personalPrivateKey);
const zkAppPrivateKey = PrivateKey.fromBase58(appPrivateKey);
const zkAppAddress = zkAppPrivateKey.toPublicKey();
// create an instance of the smart contract
const zkApp = new NewNonogramZkApp(zkAppAddress);

console.log('Deploying and initializing Nonogram...');
await NewNonogramZkApp.compile();
let deployTx = await Mina.transaction(account, () => {
  AccountUpdate.fundNewAccount(account);
  zkApp.deploy();
});
await deployTx.prove();
/**
 * note: this tx needs to be signed with `tx.sign()`, because `deploy` uses `requireSignature()` under the hood,
 * so one of the account updates in this tx has to be authorized with a signature (vs proof).
 * this is necessary for the deploy tx because the initial permissions for all account fields are "signature".
 * (but `deploy()` changes some of those permissions to "proof" and adds the verification key that enables proofs.
 * that's why we don't need `tx.sign()` for the later transactions.)
 */
await deployTx.sign([zkAppPrivateKey]).send();

// Note: this tx shouldn't be required. I was just hitting a bug with zk deploy.
console.log('Initializing Nonogram...');
let updateTx = await Mina.transaction(
  {
    feePayerKey: account,
    fee: 100000000,
  },
  () => {
    zkApp.update(
      Field(
        '12088336191140403124638594755517918076968435720907935785006885229166255168908'
      )
    );
  }
);
await updateTx.prove();
await updateTx.send();

// cleanup
await shutdown();
