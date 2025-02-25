import { getData, Trash, Token, Quiz } from '../dataStore';
import { adminUserDetails } from '../features/adminUserDetails';
export interface checkUserQuizTrashValidityResponse {
  error?: string;
}

// Takes an input of authUserId and quizId and checks whether it is valid
export function checkUserTrashQuizValidity(token: Token, quizId: number): checkUserQuizTrashValidityResponse {
  // console.log('CHECKUSERTRASHQUIZVALIDITY CALLED-------------------------------------------------------');
  const userDetails = adminUserDetails(token);
  if ('error' in userDetails) {
    return { error: userDetails.error };
  }

  const userId: number = userDetails.user.userId;
  const data = getData();

  // Find the real quiz
  const quiz: Quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  if (quiz) {
    // quiz exists, but not in the trash 400
    return { error: 'Quiz exists but not in trash.' };
  }

  // check to see if quiz is in the trash
  const quizTrash: Trash = data.trash.find(quizTrash => quizTrash.quizId === quizId);
  if (!quizTrash) {
    return { error: 'Quiz not found.' };
  }

  // Check if user is the author of the quiz, else return error
  if (quizTrash.authorId !== userId) {
    return { error: 'Given user is not the author of this quiz.' };
  }

  return {};
}
