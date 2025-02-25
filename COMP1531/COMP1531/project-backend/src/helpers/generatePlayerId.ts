import { getData } from '../dataStore';

export function generatePlayerId() {
  const min: number = 10000000;
  const max: number = 99999999;

  let playerId: number;
  let foundUniquePlayerId: boolean = false;

  while (!foundUniquePlayerId) {
    const playerNumber: number = Math.floor(Math.random() * (max - min + 1)) + min;
    playerId = playerNumber;

    foundUniquePlayerId = !playerIdExists(playerId);
  }

  return playerId;
}

function playerIdExists(playerId: number): boolean {
  const data = getData();
  for (const quiz of data.quizzes) {
    if (!quiz.players) {
      continue;
    } else {
      for (const player of quiz.players) {
        if (player.playerId === playerId) {
          return true;
        }
      }
    }
  }
  return false;
}
