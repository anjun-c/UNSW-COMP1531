import { getData, Token } from '../dataStore';
import { checkValidUser } from '../helpers/checkValidUser';
import { adminUserDetails } from './adminUserDetails';

export interface QuizResponse {
    quizId: number;
    name: string;
}

export interface QuizListResponse {
    quizzes: QuizResponse[];
}

export function adminQuizList(token: Token): QuizListResponse {
  const data = getData();
  if (!checkValidUser(token)) {
    // return { error: userDetails.error };
    throw new Error('UserId is not a valid user.');
  }
  const userDetails = adminUserDetails(token);
  const userId: number = userDetails.user.userId;

  const quizzes: QuizResponse[] = [];
  data.quizzes.forEach(quiz => {
    if (quiz.authorId === userId) {
      quizzes.push({
        quizId: quiz.quizId,
        name: quiz.name,
      });
    }
  });

  return { quizzes };
}
