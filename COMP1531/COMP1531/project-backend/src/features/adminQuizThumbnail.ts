import { Token, getData, Quiz, setData } from '../dataStore';
import { checkUserQuizValidity } from '../helpers/checkUserQuizValidity';

/**
 * Updates the thumbnail URL of the quiz with 'quizId' owned by user identified with the given token to the imgUrl
 * @param token - The token identifying the user
 * @param quizId - The unique number identifying the quiz
 * @param imgUrl - The URL of the new thumbnail image
 * @returns An empty object if the update is successful, otherwise it throws an appropriate error
 */
export function adminQuizThumbnail(token: Token, quizId: number, imgUrl: string): object {
  const data = getData();

  // Finds the quiz and user
  const quiz: Quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  const user = data.users.find(user => user.sessions.includes(token.sessionId));

  // 401
  if (!user) {
    throw new Error('Token is empty or invalid');
  }

  // 403
  if (!quiz) {
    throw new Error('User is not owner of this quiz');
  }

  // 403
  const userQuizValid = checkUserQuizValidity(token, quizId);

  if ('error' in userQuizValid) {
    throw new Error('User is not owner of this quiz');
  }

  // 400
  // The imgUrl does not end with one of the following filetypes (case insensitive): jpg, jpeg, png
  // method from https://www.geeksforgeeks.org/javascript-string-endswith-method/
  if (!imgUrl.endsWith('.jpg') && !imgUrl.endsWith('.jpeg') && !imgUrl.endsWith('.png')) {
    throw new Error('Invalid thumbnail URL format');
  }
  // 400
  // The imgUrl does not begin with 'http://' or 'https://'
  if (!imgUrl.startsWith('http://') && !imgUrl.startsWith('https://')) {
    throw new Error('Invalid thumbnail URL format');
  }

  // Implementation
  quiz.thumbnailUrl = imgUrl;
  quiz.timeLastEdited = Date.now();

  setData(data);
  return {};
}
