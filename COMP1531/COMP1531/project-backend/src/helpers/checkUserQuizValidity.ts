import { getData, Quiz, Token, User } from '../dataStore';
export interface checkUserQuizValidityResponse {
  user?: User;
  error?: string;
}

// Takes an input of token and quizId and checks whether it is valid
export function checkUserQuizValidity(token: Token, quizId: number): checkUserQuizValidityResponse {
  // Gets data from dataStore.js
  const data = getData();
  // Find the user
  const sessionId = token.sessionId;
  function getUserFromSessionId(sessionId:string) {
    for (const user of data.users) {
      if (user.sessions.includes(sessionId)) {
        return user;
      }
    }
    return null;
  }

  const user = getUserFromSessionId(sessionId);
  if (!user) {
    // Returns error message when UserId provided does not exist.
    return { error: 'UserId is not a valid user.' };
  }
  // Find the quiz
  const quiz: Quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  // Check if quiz exists, else return error
  if (!quiz) {
    return { error: 'Quiz not found.' };
  }
  // Check if user is the author of the quiz, else return error
  if (quiz.authorId !== user.id) {
    return { error: 'Given user is not the author of this quiz.' };
  }
  // Return empty object if all checks pass -> authUserId and quizId are valid
  return {};
}
