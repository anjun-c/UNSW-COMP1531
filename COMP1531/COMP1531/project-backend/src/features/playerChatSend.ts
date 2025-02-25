import { getData, Quiz, Player, setData } from '../dataStore';

export interface PlayerChatSendResponse {}

export const playerChatSend = (playerId: number, message: string): PlayerChatSendResponse => {
  const data = getData();
  let currentQuiz: Quiz, player: Player;
  for (const quiz of data.quizzes) {
    if (quiz.players && quiz.players.find(player => player.playerId === playerId)) {
      player = quiz.players.find(player => player.playerId === playerId);
      currentQuiz = quiz;
      break;
    }
  }

  if (!currentQuiz) {
    throw new Error('Player ID does not exist');
  }
  if (message.length < 1 || message.length > 100) {
    throw new Error('Message length must be between 1 and 100 characters');
  }
  currentQuiz.messages.push({
    playerId: playerId,
    messageBody: message,
    playerName: player.name,
    timeSent: Date.now()
  });
  setData(data);

  return {};
};
