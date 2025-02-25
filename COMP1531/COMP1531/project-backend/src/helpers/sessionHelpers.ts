import { getData, Data } from '../dataStore';

export function getSessions(parentQuizId: number) {
  const data = getData();
  const sessions = [];
  for (const quiz of data.quizzes) {
    if (quiz.parentQuizId === parentQuizId) {
      sessions.push(quiz);
    }
  }
  return sessions;
}

export function getAllSessions() {
  const data = getData();
  const sessions = [];
  for (const quiz of data.quizzes) {
    if (quiz.parentQuizId) {
      sessions.push(quiz);
    }
  }
  return sessions;
}

export function generateSessionId() {
  // generates a 6 digit number
  let candidate = Math.floor(100000 + Math.random() * 900000);
  while (candidate in getAllSessions()) {
    candidate = Math.floor(100000 + Math.random() * 900000);
  }
  return candidate;
}

export function getSessionFromId(data: Data, sessionId: number) {
  for (const quiz of data.quizzes) {
    if (quiz.sessionId === sessionId) {
      return quiz;
    }
  }
  return null; // Return null if no session with the given sessionId is found
}
