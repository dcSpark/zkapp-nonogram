import { useEffect } from 'react';
import { isReady, PublicKey } from 'snarkyjs';

import Head from 'next/head';
import Game from '../src/components/game/Game';
import { GameMouse } from '../src/components/game/GameMouse';
import { GameBoard } from '../src/components/game/Board';
import { GameHistory } from '../src/components/game/History';
import { GameTimer } from '../src/components/game/Timer';

export default function Home() {
  useEffect(() => {
    (async () => {
      await isReady;
      const { NonogramZkApp } = await import('nonogram-zkapp/build/src/index');

      // Update this to use the address (public key) for your zkApp account
      // To try it out, you can try this address for an example "NonogramZkApp" smart contract that we've deployed to
      const zkAppAddress = 'B62qrKXoY2VJjE594fPTqu2SdmDwwYi4pB6P4jAQmBe8bXar2WeNaZY';
      // This should be removed once the zkAppAddress is updated.
      if (!zkAppAddress) {
        console.error(
          'The following error is caused because the zkAppAddress has an empty string as the public key. Update the zkAppAddress with the public key for your zkApp account, or try this address for an example "Add" smart contract that we deployed to Berkeley Testnet: B62qqkb7hD1We6gEfrcqosKt9C398VLp1WXeTo1i9boPoqF7B1LxHg4'
        );
      }

      const zkAppInstance = new NonogramZkApp(PublicKey.fromBase58(zkAppAddress));
    })();
  }, []);

  return (
    <>
      <Head>
        <title>ZK Nonogram</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <meta name="description" content="zero-knowledge Nonogram game made SnarkyJS and React" />
      </Head>
      <GameBoard>
        <GameMouse>
          <GameHistory>
            <GameTimer>
              <Game />
            </GameTimer>
          </GameHistory>
        </GameMouse>
      </GameBoard>
    </>
  );
}
