import { Token, Answer, Question } from '../dataStore';
import {
  httpPlayerSubmitAnswers,
  httpAdminQuizSessionStart,
  httpAdminAuthRegister,
  httpClear,
  httpAdminQuizCreateV2,
  httpAdminQuizQuestionsCreateV2,
  httpPlayerJoinSession,
  httpAdminQuizSessionUpdate,
  httpAdminQuizInfoV2
} from './testHelper';
import { QuizActions } from '../states';

describe('Player Submit Answer Tests', () => {
  let token: Token;
  let quizId: number;
  let sessionId: number;
  let playerId: number;
  let questionArray: Question[];
  let validAnswerIds1: number[];
  let validAnswerIds2: number[];

  beforeEach(() => {
    httpClear();
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
    token = JSON.parse(registerResult.jsonBody.token as string);

    const quizCreateResult = httpAdminQuizCreateV2(token, 'My Quiz', 'Quiz Description');
    quizId = quizCreateResult.jsonBody.quizId as number;

    const questionBody1 = {
      question: 'Test Quiz 1',
      duration: 3,
      points: 1,
      answers: [
        { answer: 'Test Answer 1', correct: true, colour: 'red' },
        { answer: 'Test Answer 2', correct: false, colour: 'blue' },
        { answer: 'Test Answer 3', correct: false, colour: 'green' },
        { answer: 'Test Answer 4', correct: false, colour: 'yellow' }
      ]
    };
    const questionBody2 = {
      question: 'Test Quiz 1',
      duration: 3,
      points: 1,
      answers: [
        { answer: 'Test Answer 1', correct: true, colour: 'red' },
        { answer: 'Test Answer 2', correct: false, colour: 'blue' },
        { answer: 'Test Answer 3', correct: false, colour: 'green' },
        { answer: 'Test Answer 4', correct: false, colour: 'yellow' }
      ]
    };

    httpAdminQuizQuestionsCreateV2(token, quizId, questionBody1);
    httpAdminQuizQuestionsCreateV2(token, quizId, questionBody2);

    const quizInfo = httpAdminQuizInfoV2(token, quizId);
    questionArray = quizInfo.jsonBody.questions as Question[];
    // const questions = quizInfo.jsonBody.questions as Question[];
    // const question1 = questions.find((question: Question) => question.questionId === questionId1 as unknown as number) as Question;
    // const question2 = questions.find((question: Question) => question.questionId === questionId2 as unknown as number) as Question;
    validAnswerIds1 = questionArray[0].answers.map((answer: Answer) => answer.answerId) as number[];
    validAnswerIds2 = questionArray[1].answers.map((answer: Answer) => answer.answerId) as number[];
    // validAnswerIds1 = question1.answers.map((answer: Answer) => answer.answerId) as number[];
    // validAnswerIds2 = question1.answers.map((answer: Answer) => answer.answerId) as number[];

    const sessionStartResult = httpAdminQuizSessionStart(token, quizId, 1);
    sessionId = sessionStartResult.jsonBody.sessionId as number;

    const playerJoinResult = httpPlayerJoinSession(sessionId, 'Hayden Smith');
    playerId = playerJoinResult.jsonBody.playerId as number;
  });

  test('Submit answer successfully', () => {
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.NEXT_QUESTION);
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.SKIP_COUNTDOWN);
    const result = httpPlayerSubmitAnswers(playerId, 1, validAnswerIds1);
    expect(result.statusCode).toBe(200);
    expect(result.jsonBody).toEqual({});
  });

  test('Submit answer successfully after changing current Question', () => {
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.NEXT_QUESTION);
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.SKIP_COUNTDOWN);
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.GO_TO_ANSWER);
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.NEXT_QUESTION);
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.SKIP_COUNTDOWN);
    const result = httpPlayerSubmitAnswers(playerId, 2, validAnswerIds2);
    expect(result.statusCode).toBe(200);
    expect(result.jsonBody).toEqual({});
  });

  test('Invalid player ID returns 400', () => {
    const answerIds = [1234]; // Replace with a valid answer ID
    const result = httpPlayerSubmitAnswers(-1, 1, answerIds);
    expect(result.statusCode).toBe(400);
    expect(result.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Invalid question position returns 400', () => {
    const answerIds = [1234]; // Replace with a valid answer ID
    const result = httpPlayerSubmitAnswers(playerId, -1, answerIds);
    expect(result.statusCode).toBe(400);
    expect(result.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Submitting answers when session is not in QUESTION_OPEN state returns 400', () => {
    const answerIds = [1234]; // Replace with a valid answer ID
    // Simulate session state other than QUESTION_OPEN
    // This would require direct modification of the data store or using a helper function
    const result = httpPlayerSubmitAnswers(playerId, 1, answerIds);
    expect(result.statusCode).toBe(400);
    expect(result.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Submitting invalid answer IDs returns 400', () => {
    const answerIds = [9999]; // Assume 9999 is an invalid answer ID
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.NEXT_QUESTION);
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.SKIP_COUNTDOWN);
    const result = httpPlayerSubmitAnswers(playerId, 1, answerIds);
    expect(result.statusCode).toBe(400);
    expect(result.jsonBody.error).toStrictEqual(expect.any(String));
  });

  // Provide valid answer duplicate id's
  test('Submitting duplicate answer IDs returns 400', () => {
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.NEXT_QUESTION);
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.SKIP_COUNTDOWN);
    const result = httpPlayerSubmitAnswers(playerId, 1, [validAnswerIds1[0], validAnswerIds1[0]]);
    expect(result.statusCode).toBe(400);
    expect(result.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Submitting less than 1 answer ID returns 400', () => {
    const answerIds: number[] = [];
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.NEXT_QUESTION);
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.SKIP_COUNTDOWN);
    const result = httpPlayerSubmitAnswers(playerId, 1, answerIds);
    expect(result.statusCode).toBe(400);
    expect(result.jsonBody.error).toStrictEqual(expect.any(String));
  });
});
