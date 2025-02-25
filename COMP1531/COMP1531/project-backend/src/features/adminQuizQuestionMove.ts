import { Token, getData, setData } from '../dataStore';
import { checkUserQuizValidity } from '../helpers/checkUserQuizValidity';
import { checkValidUser } from '../helpers/checkValidUser';

export interface adminQuizQuestionMoveResponse { }

/**
 * Moves a question position within quiz
 * @param questionId The id of the question which will be moved
 * @param quizId The Id of the quiz to help identify
 * @param token The token object containing sessionId to identify the session
 * @param newPosition The index in which the question will be moved to
 * @returns Empty object if successful otherwise an error
 */
export function adminQuizQuestionMove(questionId: number, quizId: number, token: Token, newPosition: number): adminQuizQuestionMoveResponse {
  const data = getData();
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);

  // Check if quiz exists
  if (!quiz) {
    console.log('heheeeeeeeee');
    throw new Error('Quiz does not exist');
    // return { error: 'Quiz does not exist', statusCode: 403 };
  }

  // Check token validity
  if (!checkValidUser(token)) {
    throw new Error('Token is empty or invalid');
    // return { error: 'Token is empty or invalid', statusCode: 401 };
  }

  // Check ownership of quiz
  const quizValidity = checkUserQuizValidity(token, quizId);
  if ('error' in quizValidity) {
    throw new Error('User is not owner of this quiz');
    // return { error: 'User is not owner of this quiz or quiz does not exist', statusCode: 403 };
  }

  // Find the index of the question to move
  const questionIndex = quiz.questions.findIndex(question => question.questionId === questionId);

  // Validate newPosition
  if (newPosition < 0 || newPosition >= quiz.questions.length || newPosition === questionIndex) {
    throw new Error('Invalid new position');
    // return { error: 'Invalid newPosition', statusCode: 400 };
  }

  // Move question
  const questionToMove = quiz.questions[questionIndex];
  quiz.questions.splice(questionIndex, 1); // Remove question from current position
  quiz.questions.splice(newPosition, 0, questionToMove); // Insert question at newPosition

  // Update timeLastEdited or any other necessary updates
  quiz.timeLastEdited = Date.now();

  // Save updated data
  setData(data);

  return { };
}
