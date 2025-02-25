import { getData, setData, Quiz, EmptyObject, QuestionAnswerInformation } from '../dataStore';
import { QuizState } from '../states';

export function playerSubmitAnswers(playerId: number, questionPosition: number, answerIds: number[]): EmptyObject {
  const timeSubmitted = Date.now();
  const data = getData();
  let player;
  let playerQuiz: Quiz;
  for (const quiz of data.quizzes) {
    if (!quiz.players) {
      continue;
    } else {
      player = quiz.players.find(p => p.playerId === playerId);
      if (player) {
        playerQuiz = quiz;
        break;
      }
    }
  }
  if (!player) {
    throw new Error('Player ID does not exist');
  }

  if (questionPosition < 1 || questionPosition > playerQuiz.questions.length) {
    throw new Error('Question position is not valid for the session this player is in');
  }

  const currentState = playerQuiz.quizState;
  if (currentState !== QuizState.QUESTION_OPEN) {
    throw new Error('Session is not in QUESTION_OPEN state');
  }

  const currentQuestion = playerQuiz.questions[questionPosition - 1];

  const atQuestion = playerQuiz.atQuestion;
  if (atQuestion !== questionPosition) {
    throw new Error('Session is not currently on this question');
  }

  const validAnswerIds = currentQuestion.answers.map(answer => answer.answerId);

  if (!answerIds.every(answerId => validAnswerIds.includes(answerId))) {
    throw new Error('Answer IDs are not valid for this particular question');
  }

  if (new Set(answerIds).size !== answerIds.length) {
    throw new Error('There are duplicate answer IDs provided');
  }

  if (answerIds.length < 1) {
    throw new Error('Less than 1 answer ID was submitted');
  }

  // Store the player's answer submission
  // const playerAnswers = playerQuiz.players.find(p => p.playerId === playerId).answers || [];
  // playerAnswers.push({ questionId: currentQuestion.questionId, answerIds });

  currentQuestion.playerAnswerInformation = currentQuestion.playerAnswerInformation || [];
  const questionAnswerInformation: QuestionAnswerInformation = {
    playerId: playerId,
    name: player.name,
    answerTime: timeSubmitted - currentQuestion.timeStarted,
    answerIds: answerIds,
    correct: undefined
  };

  for (const answerId of answerIds) {
    const answer = currentQuestion.answers.find(a => a.answerId === answerId);
    if (answer.correct === false) {
      questionAnswerInformation.correct = false;
      break;
    }
  }
  if (questionAnswerInformation.correct === undefined) {
    questionAnswerInformation.correct = true;
  }
  currentQuestion.playerAnswerInformation.push(questionAnswerInformation);
  setData(data);

  return {};
}
