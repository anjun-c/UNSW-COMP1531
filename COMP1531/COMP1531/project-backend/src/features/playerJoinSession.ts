import { Quiz, getData, setData } from '../dataStore';
// import { generateRandomName, generatePlayerId } from '../helpers';
import { QuizState } from '../states';
import { generateRandomName } from '../helpers/generateRandomName';
import { generatePlayerId } from '../helpers/generatePlayerId';

export interface PlayerJoinSessionResponse {
  playerId?: number;
}

/**
 * Allows a player to join a quiz session.
 * @param sessionId The ID of the session to join.
 * @param name The name of the player.
 * @returns An object containing the playerId.
 */
export function playerJoinSession(sessionId: number, name: string): PlayerJoinSessionResponse {
  const data = getData();
  const quiz: Quiz = data.quizzes.find(quiz => quiz.sessionId === sessionId);

  // 400: Invalid session ID
  if (!quiz) {
    throw new Error('Session Id does not refer to a valid session');
  }

  // 400: Session is not in LOBBY state
  if (quiz.quizState !== QuizState.LOBBY) {
    throw new Error('Session is not in LOBBY state');
  }

  // 400: Name is not unique
  // if (!quiz.players) {
  //   throw new Error('No players in quiz')
  // }
  const uniqueName = quiz.players.find(player => player.name === name);
  // console.log('AAGggggggggggggggggggggggggggggggggggggggggg');
  // console.log(uniqueName);
  if (uniqueName) {
    throw new Error('Name of user entered is not unique');
  }

  // If name is empty, generate a random name
  if (name === '') {
    name = generateRandomName();
  }

  // Add player to session (example; adjust according to your actual session model)
  const newPlayerId = generatePlayerId();
  const newPlayer = { playerId: newPlayerId, name: name, score: 0 };

  quiz.players.push(newPlayer);
  // console.log(quiz.players);

  setData(data);

  return { playerId: newPlayerId };
}
