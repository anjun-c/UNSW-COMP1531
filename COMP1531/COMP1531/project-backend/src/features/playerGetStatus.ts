import { getData, Quiz } from '../dataStore';
import { QuizState } from '../states';

interface PlayerStatusResponse {
  state: QuizState;
  numQuestions: number;
  atQuestion: number;
}

export function playerGetStatus(playerId: number): PlayerStatusResponse {
  const data = getData();
  let playerFound = false;
  let playerQuiz: Quiz;

  for (const quiz of data.quizzes) {
    if (!quiz.players) {
      continue;
    } else {
      const player = quiz.players.find(p => p.playerId === playerId);
      if (player) {
        playerFound = true;
        playerQuiz = quiz;
        break;
      }
    }
  }

  if (!playerFound) {
    throw new Error('Player ID does not exist');
  }

  const currentState = playerQuiz.quizState;
  const numQuestions = playerQuiz.questions.length;

  let atQuestion = playerQuiz.atQuestion;

  // Assuming `atQuestion` represents the current question index
  if (currentState === QuizState.LOBBY || currentState === QuizState.FINAL_RESULTS || currentState === QuizState.END) {
    atQuestion = 0;
  }

  return {
    state: currentState,
    numQuestions,
    atQuestion
  };
}
