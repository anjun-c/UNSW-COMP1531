import { Token, setData, getData } from '../dataStore';
import { checkUserQuizValidity } from '../helpers/checkUserQuizValidity';

interface adminQuizQuestionDeleteResponse {}

/**
 * Deleted a question
 * @param token The token object containing sessionId to identify the session
 * @param quizId The Id of the quiz to help identify
 * @param questionId The id of the question which will be deleted
 * @returns Empty object if successful otherwise an error
 */
export function adminQuizQuestionDelete(token: Token, quizId: number, questionId: number): adminQuizQuestionDeleteResponse {
  const data = getData();

  // quiz validty check
  if ('error' in checkUserQuizValidity(token, quizId)) {
    // return checkUserQuizValidity(token, quizId);
    throw new Error(checkUserQuizValidity(token, quizId).error);
  }

  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);

  // Find the question in the quiz
  const questionIndex = quiz.questions.findIndex(question => question.questionId === questionId);
  if (questionIndex === -1) {
    // return { error: 'Question not found in this quiz' };
    throw new Error('Question not found in this quiz');
  }

  // update the duration
  const questionDuration = quiz.questions[questionIndex].duration;
  quiz.duration -= questionDuration;

  // Delete the question
  quiz.questions.splice(questionIndex, 1);
  quiz.numQuestions -= 1;
  quiz.timeLastEdited = Date.now();

  setData(data);

  return {};
}
