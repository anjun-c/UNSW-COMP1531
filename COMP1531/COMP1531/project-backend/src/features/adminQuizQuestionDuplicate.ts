import { Token, getData, setData } from '../dataStore';
import { checkUserQuizValidity } from '../helpers/checkUserQuizValidity';
import { generateQuestionId } from '../helpers/generateQuestionId';
import { checkValidUser } from '../helpers/checkValidUser';

export interface adminQuizQuestionDuplicateResponse {
  error?: string;
  newQuestionId?: number;
  statusCode?: number;
}

/**
 * Duplicates a question
 * @param quizId The Id of the quiz to help identify
 * @param questionId The id of the question which will be moved
 * @param token The token object containing sessionId to identify the session
 * @returns New questionId if successful otherwise an error
 */
export function adminQuizQuestionDuplicate(quizId: number, questionId: number, token: Token): adminQuizQuestionDuplicateResponse {
  const data = getData();
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);

  // Check if quiz exists
  if (!quiz) {
    // return { error: 'Quiz does not exist', statusCode: 403 };
    throw new Error('Quiz does not exist');
  }

  // Check token validity
  if (!checkValidUser(token)) {
    // return { error: 'Token is empty or invalid', statusCode: 401 };
    throw new Error('Token is empty or invalid');
  }

  // Check ownership of quiz
  const quizValidity = checkUserQuizValidity(token, quizId);
  if ('error' in quizValidity) {
    // return { error: 'User is not owner of this quiz or quiz does not exist', statusCode: 403 };
    throw new Error('User is not owner of this quiz or quiz does not exist');
  }

  // Find the index of the question to duplicate
  const questionIndex = quiz.questions.findIndex(question => question.questionId === questionId);

  // Check if question exists in the quiz
  if (questionIndex === -1) {
    // return { error: 'Question does not exist in this quiz', statusCode: 400 };
    throw new Error('Question does not exist in this quiz');
  }

  // Duplicate question to immediately after its current position
  const newQuestion = { ...quiz.questions[questionIndex] };

  // Generate new questionId
  const newQuestionId = generateQuestionId(quiz);

  // Assign new questionId to the duplicated question
  newQuestion.questionId = newQuestionId;

  // Insert duplicated question
  quiz.questions.splice(questionIndex + 1, 0, newQuestion);

  // Update timeLastEdited or any other necessary updates
  quiz.timeLastEdited = Date.now();

  // Save updated data
  setData(data);

  return { newQuestionId };
}
