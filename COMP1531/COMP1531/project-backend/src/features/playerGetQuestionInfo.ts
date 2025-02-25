import { getData, Quiz } from '../dataStore';
import { QuizState } from '../states';

interface PlayerQuestionResponse {
  questionId: number;
  question: string;
  duration: number;
  thumbnailUrl?: string;
  points: number;
  answers: { answerId: number; answer: string; colour: string }[];
}

export function playerGetQuestionInfo(playerId: number, questionPosition: number): PlayerQuestionResponse {
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

  if (questionPosition < 1 || questionPosition > playerQuiz.questions.length) {
    throw new Error('Question position is not valid for the session this player is in');
  }

  const atQuestion = playerQuiz.atQuestion;
  if (atQuestion !== questionPosition) {
    throw new Error('Session is not currently on this question');
  }

  const currentState = playerQuiz.quizState;
  if (
    currentState === QuizState.LOBBY ||
    currentState === QuizState.QUESTION_COUNTDOWN ||
    currentState === QuizState.FINAL_RESULTS ||
    currentState === QuizState.END
  ) {
    throw new Error('Session is in LOBBY, QUESTION_COUNTDOWN, FINAL_RESULTS or END state');
  }

  const question = playerQuiz.questions[questionPosition - 1];

  return {
    questionId: question.questionId,
    question: question.question,
    duration: question.duration,
    thumbnailUrl: playerQuiz.thumbnailUrl,
    points: question.points,
    answers: question.answers.map(answer => ({
      answerId: answer.answerId,
      answer: answer.answer,
      colour: answer.colour
    }))
  };
}
