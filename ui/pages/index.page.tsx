import { useEffect, useState } from 'react';
import type { NonogramZkApp } from '../../contracts/src/';
import { Mina, isReady, PublicKey, fetchAccount } from 'snarkyjs';

import Game from '../src/components/game/Game';
import { GameMouse } from '../src/components/game/GameMouse';
import { GameBoard } from '../src/components/game/Board';
import { GameHistory } from '../src/components/game/History';
import { GameTimer } from '../src/components/game/Timer';

export default function Home() {
  useEffect(() => {
    (async () => {
      await isReady;
      const { NonogramZkApp } = await import('../../contracts/build/src/index');

      // Update this to use the address (public key) for your zkApp account
      // To try it out, you can try this address for an example "NonogramZkApp" smart contract that we've deployed to
      // Berkeley Testnet B62qqkb7hD1We6gEfrcqosKt9C398VLp1WXeTo1i9boPoqF7B1LxHg4
      const zkAppAddress = 'B62qikvYSRJPpJXsTmrJBGPNkaXSftNbsSyMGy2cMt2FGF5BMeuBXcU';
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
    <GameBoard>
      <GameMouse>
        <GameHistory>
          <GameTimer>
            <Game />
          </GameTimer>
        </GameHistory>
      </GameMouse>
    </GameBoard>
  );
}
