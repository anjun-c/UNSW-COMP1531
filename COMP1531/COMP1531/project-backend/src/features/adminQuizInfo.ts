import { getData, Token, Question, Quiz } from '../dataStore';
import { checkUserQuizValidity } from '../helpers/checkUserQuizValidity';

// The response structure of the adminQuizInfo function
export interface QuizInfoResponse {
  quizId: number;
  name: string;
  timeCreated: number;
  timeLastEdited: number;
  description: string;
  numQuestions: number;
  questions: Question[];
  duration: number;
  thumbnailUrl?: string;
}

/**
 * Returns the information of a quiz
 * @param quizId The Id of the quiz to get information from
 * @param token The token object containing sessionId to identify the session
 * @returns {QuizInfoResponse} The information of the quiz or an error message
 */
export function adminQuizInfo(token: Token, quizId: number): QuizInfoResponse {
  // Get the data from the dataStore
  const data = getData();
  // Check if the user has the permission to view the quiz and whether the quiz exists
  const validityCheck = checkUserQuizValidity(token, quizId);
  // If there is an error in the validity check, return the error
  if ('error' in validityCheck) {
    throw new Error(validityCheck.error);
  }
  // Find the quiz with the given quizId
  const quiz: Quiz = data.quizzes.find(quiz => !quiz.sessionId && quiz.quizId === quizId);
  if (!quiz) {
    throw new Error('Quiz not found.');
  }
  // Return the information of the quiz
  return {
    quizId: quiz.quizId,
    name: quiz.name,
    timeCreated: quiz.timeCreated,
    timeLastEdited: quiz.timeLastEdited,
    description: quiz.description,
    numQuestions: quiz.numQuestions,
    questions: quiz.questions,
    duration: quiz.duration,
    thumbnailUrl: quiz.thumbnailUrl,
  };
}
