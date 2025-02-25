import { getData } from '../dataStore';
import { QuizState } from '../states';

export interface playerQuizQuestionResultResponse {
    questionId?: number;
    playerCorrectList?: string[];
    averageAnswerTime?: number;
    percentCorrect?: number;
}

export const playerQuizQuestionResult = (playerId: number,
  questionposition: number):
playerQuizQuestionResultResponse => {
  const data = getData();
  let player, currentQuiz;
  for (const quiz of data.quizzes) {
    if (!quiz.players) {
      continue;
    } else {
      player = quiz.players.find(p => p.playerId === playerId);
      if (player) {
        currentQuiz = quiz;
        break;
      }
    }
  }
  if (!player) {
    throw new Error('Player ID does not exist');
  }
  if (questionposition < 1 || questionposition > currentQuiz.questions.length) {
    throw new Error('Question position is not valid for the session this player is in');
  }
  const currentState = currentQuiz.quizState;
  if (currentState !== QuizState.ANSWER_SHOW) {
    throw new Error('Session is not in ANSWER_SHOW state');
  }
  if (currentQuiz.atQuestion !== questionposition) {
    throw new Error('Session is not currently on this question');
  }

  const question = currentQuiz.questions[questionposition - 1];
  let averageAnswerTime: number = 0; let percentCorrect: number = 0; const playerCorrectList: string[] = [];
  for (const qInfo of question.playerAnswerInformation) {
    averageAnswerTime += qInfo.answerTime;
    if (qInfo.correct) {
      playerCorrectList.push(qInfo.name);
      percentCorrect++;
    }
  }

  averageAnswerTime = averageAnswerTime / question.playerAnswerInformation.length;
  percentCorrect = (percentCorrect / question.playerAnswerInformation.length) * 100;
  percentCorrect = Math.round(percentCorrect);
  
  return {
    questionId: question.questionId,
    playerCorrectList: playerCorrectList,
    averageAnswerTime: averageAnswerTime,
    percentCorrect: percentCorrect,
  };
};
