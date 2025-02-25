import { Data, getData, setData, Question, Token } from '../dataStore';
import { adminUserDetails } from './adminUserDetails';

export interface AdminQuizCreateResponse {
    quizId?: number;
    error?: string;
}

/**
 * Description:
 * This function creates a new quiz with the provided name and description
 *
 * @param token of type Token
 * @param name of String
 * @param description of type String
 * @returns an object of quizId and error
 */

export function adminQuizCreate(token: Token, name:string, description:string): AdminQuizCreateResponse {
  const data: Data = getData();

  const userDetails = adminUserDetails(token);
  if ('error' in userDetails) {
    throw new Error(userDetails.error);
  }
  const userId: number = userDetails.user.userId;

  // Check if name length is valid
  if (name.length < 3 || name.length > 30) {
    throw new Error('Invalid Quiz Name Length');
  }

  const regex = /^[a-zA-Z0-9 ]*$/;
  if (regex.test(name) === false) {
    throw new Error('Invalid Quiz Name Characters');
  }

  // Check description length
  if (description.length > 100) {
    throw new Error('Invalid Quiz Description Length');
  }

  // Check if user is valid
  let userFound = false;
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].id === userId) {
      userFound = true;
      break;
    }
  }
  if (!userFound) {
    throw new Error('Invalid User ID');
  }

  // Check if name is already taken by same user
  for (const quiz of data.quizzes) {
    if (quiz.authorId === userId && quiz.name === name) {
      throw new Error('Name is already taken by same user');
    }
  }

  // Create quiz
  const authorId = userId;
  const quizId = data.quizzes.length + 1;
  const timeCreated = Date.now();
  const timeLastEdited = Date.now();
  const questions:Question[] = [];

  data.quizzes.push({
    authorId: authorId,
    quizId: quizId,
    name: name,
    description: description,
    questions: questions,
    timeCreated: timeCreated,
    timeLastEdited: timeLastEdited,
    numQuestions: 0,
    duration: 0,
    thumbnailUrl: '',
  });

  setData(data);
  return { quizId: quizId };
}
