import { getData, Quiz, Chat } from '../dataStore';

export interface PlayerChatViewResponse {
    messages: Chat[];
}

export const playerChatView = (playerId: number): PlayerChatViewResponse => {
  const data = getData();
  let currentQuiz: Quiz;
  for (const quiz of data.quizzes) {
    if (quiz.players && quiz.players.find(player => player.playerId === playerId)) {
      currentQuiz = quiz;
      break;
    }
  }

  if (!currentQuiz) {
    throw new Error('Player ID does not exist');
  }

  return {
    messages: currentQuiz.messages
  };
};
