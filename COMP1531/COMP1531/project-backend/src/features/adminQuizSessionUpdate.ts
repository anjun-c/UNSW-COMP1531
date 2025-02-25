import { getData, Token, setData, Quiz, Data, Question } from '../dataStore';
import { checkUserQuizValidity } from '../helpers/checkUserQuizValidity';
import { QuizState, QuizActions } from '../states';
import { getSessionFromId } from '../helpers/sessionHelpers';

/**
 * Updates the state of a quiz session
 * @param token - Token identifying the user
 * @param quizId - Unique number identifying the quiz
 * @param sessionid - Unique number identifying the specific session of the quiz which will have a state change
 * @param action - The action to perform on the session which will change the state appropriately
 * @returns An empty object if successful, otherwise throws an appropriate error
 */
export function adminQuizSessionUpdate(token: Token, quizId: number, sessionid: number, action: QuizActions): object {
  const data = getData();

  // Find the quiz and user
  const quiz: Quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  const user = data.users.find(user => user.sessions.includes(token.sessionId));
  const session = getSessionFromId(data, sessionid);

  // 401
  if (!user) {
    throw new Error('Token is empty or invalid');
  }

  // 403
  if (!quiz === undefined) {
    throw new Error('User does not own this quiz');
  }

  // 403
  const userQuizValid = checkUserQuizValidity(token, quizId);

  if ('error' in userQuizValid) {
    throw new Error('User does not own this quiz');
  }

  // 400 Session Id does not refer to a valid session within this quiz
  if (quiz.activeSessions === undefined || quiz.activeSessions.length === 0 || !quiz.activeSessions.includes(sessionid)) {
    throw new Error('Session does not exist');
  }

  // 400 Action provided is not a valid Action enum
  if (action === undefined) {
    throw new Error('Action provided is not a valid Action enum');
  }

  const quizState: QuizState = session.quizState;
  if (quizState === undefined) {
    throw new Error('Quiz state is undefined');
  }

  // 400 Action enum cannot be applied in the current state (see spec for details)
  let newState: QuizState;
  try {
    newState = transitionState(token, quizId, sessionid, quizState, action, data);
  } catch (error) {
    throw new Error(error.message);
  }

  if (newState) {
    session.quizState = newState;
  }

  setData(data);
  return {};
}

function transitionState(token: Token, quizId: number, sessionid: number, currentState: QuizState, action: QuizActions, data: Data): QuizState {
  const session = getSessionFromId(data, sessionid);
  let question: Question;
  let currIndex: number;

  const quiz = data.quizzes.find(q => q.quizId === quizId);

  // Special exception for custom question close
  if (action === QuizActions.QUESTION_CLOSE) {
    return QuizState.QUESTION_CLOSE;
  }

  // Will go to the end regardless of where we are!
  if (action === QuizActions.END) {
    const activeIndex = quiz.activeSessions?.indexOf(sessionid);

    quiz.activeSessions.splice(activeIndex, 1);

    if (quiz.inactiveSessions) {
      quiz.inactiveSessions.push(sessionid);
    } else {
      quiz.inactiveSessions = [sessionid];
    }
    session.atQuestion = 0;
    return QuizState.END;
  }
  if (currentState === QuizState.LOBBY) {
    if (action === QuizActions.NEXT_QUESTION) {
      session.atQuestion += 1;
      startCountdown(token, quizId, sessionid);
      return QuizState.QUESTION_COUNTDOWN;
    }
  }
  if (currentState === QuizState.QUESTION_COUNTDOWN) {
    if (action === QuizActions.SKIP_COUNTDOWN) {
      currIndex = session.atQuestion - 1;
      question = session.questions[currIndex];
      question.timeStarted = Date.now();
      questionDurationCountdown(token, quizId, sessionid, question.duration);
      return QuizState.QUESTION_OPEN;
    }
  }
  if (currentState === QuizState.QUESTION_OPEN) {
    if (action === QuizActions.GO_TO_ANSWER) {
      return QuizState.ANSWER_SHOW;
    }
  }
  if (currentState === QuizState.QUESTION_CLOSE) {
    if (action === QuizActions.GO_TO_ANSWER) {
      return QuizState.ANSWER_SHOW;
    }
    if (action === QuizActions.GO_TO_FINAL_RESULTS) {
      session.atQuestion = 0;
      return QuizState.FINAL_RESULTS;
    }
  }
  if (currentState === QuizState.ANSWER_SHOW) {
    if (action === QuizActions.NEXT_QUESTION) {
      session.atQuestion += 1;
      startCountdown(token, quizId, sessionid);
      return QuizState.QUESTION_COUNTDOWN;
    }
    if (action === QuizActions.GO_TO_FINAL_RESULTS) {
      session.atQuestion = 0;
      return QuizState.FINAL_RESULTS;
    }
  }
}

function startCountdown(token: Token, quizId: number, sessionid: number) {
  console.log('Starting countdown for starting question');
  setTimeout(() => {
    try {
      adminQuizSessionUpdate(token, quizId, sessionid, QuizActions.SKIP_COUNTDOWN);
      console.log('Question open');
    } catch (error) {
      console.error('Error during countdown:', error.message);
    }
  }, 3000);
}

function questionDurationCountdown(token: Token, quizId: number, sessionid: number, questionDuration: number) {
  console.log('Starting countdown for question Duration');
  setTimeout(() => {
    try {
      adminQuizSessionUpdate(token, quizId, sessionid, QuizActions.QUESTION_CLOSE);
      console.log('Question closed');
    } catch (error) {
      console.error('Error during countdown:', error.message);
    }
  }, questionDuration * 1000);
}
