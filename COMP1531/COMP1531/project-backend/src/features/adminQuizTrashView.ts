import { Token, getData } from '../dataStore';
import { adminUserDetails } from './adminUserDetails';

// The response structure of the adminQuizTrashView function
export interface adminQuizTrashViewResponse {
    error?: string;
    quizzes?: quizTrashInfo[];
}

// The structure of the quizTrashInfo object
export interface quizTrashInfo {
    quizId: number;
    name: string;
}

/**
 * Returns the information of quizzes in trash
 * @param token The token object containing sessionId to identify the session
 * @returns {adminQuizTrashViewResponse} - An object containing an error message if the view fails,
 * otherwise an object containing the quizId and name of each quiz in trash.
 */
export const adminQuizTrashView = (token: Token): adminQuizTrashViewResponse => {
  // Get the data from the dataStore
  const data = getData();
  // Get the user details
  const userDetails = adminUserDetails(token);
  // Create an array of quizTrashInfo objects
  const quizArray: quizTrashInfo[] = [];
  // Check if token is valid
  if ('error' in userDetails) {
    throw new Error(userDetails.error);
  }
  // Add the quizId and name of each quiz in trash to the quizArray
  for (const quiz of data.trash) {
    quizArray.push({ quizId: quiz.quizId, name: quiz.name });
  }
  return { quizzes: quizArray };
};
