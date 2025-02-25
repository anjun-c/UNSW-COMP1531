import {
  httpAdminQuizCreateV2,
  httpAdminQuizSessionStart,
  httpAdminAuthRegister,
  httpPlayerJoinSession,
  httpAdminQuizQuestionsCreateV2,
  httpPlayerQuizQuestionResult,
  httpAdminQuizSessionUpdate,
  httpPlayerSubmitAnswers,
  httpClear,
  httpAdminQuizInfoV2
} from './testHelper';
import { Token, Question } from '../dataStore';
import { QuizActions } from '../states';

describe('Testing GET - playerQuizQuestionResult', () => {
  let admin, player1, player1Id: number, player2, player2Id: number, player3, player3Id: number,
    quiz, quizId: number, session, questionId: number, question, token: Token, sessionId: number;
  const questionBody1 = {
    question: 'Test Quiz 1',
    duration: 3,
    points: 1,
    answers: [{ answer: 'Test Answer 1', correct: true },
      { answer: 'Test Answee 2', correct: false },
      { answer: 'Test Answer 3', correct: false },
      { answer: 'Test Answer 4', correct: false }
    ]
  };
  const questionBody2 = {
    question: 'Test Quiz 2',
    duration: 3,
    points: 1,
    answers: [{ answer: 'Test Answer 1', correct: true },
      { answer: 'Test Answee 2', correct: false },
      { answer: 'Test Answer 3', correct: false },
      { answer: 'Test Answer 4', correct: false }
    ]
  };
  beforeEach(() => {
    httpClear();
    admin = httpAdminAuthRegister('test1@email.com', 'TestPassword123', 'Firstone', 'Lastone');
    token = JSON.parse(admin.jsonBody.token as string);
    quiz = httpAdminQuizCreateV2(JSON.parse(admin.jsonBody.token as string), 'Quiz1', 'Quiz1 description');
    quizId = quiz.jsonBody.quizId as number;
    question = httpAdminQuizQuestionsCreateV2(JSON.parse(admin.jsonBody.token as string), quizId, questionBody1);
    questionId = question.jsonBody.questionId as number;
    httpAdminQuizQuestionsCreateV2(JSON.parse(admin.jsonBody.token as string), quizId, questionBody2);
    session = httpAdminQuizSessionStart(JSON.parse(admin.jsonBody.token as string), quiz.jsonBody.quizId as number, 3);
    sessionId = session.jsonBody.sessionId as number;
    player1 = httpPlayerJoinSession(session.jsonBody.sessionId as number, 'Player1');
    player1Id = player1.jsonBody.playerId as number;
    player2 = httpPlayerJoinSession(session.jsonBody.sessionId as number, 'Player2');
    player2Id = player2.jsonBody.playerId as number;
    player3 = httpPlayerJoinSession(session.jsonBody.sessionId as number, 'Player3');
    player3Id = player3.jsonBody.playerId as number;
  });

  describe('Testing playerQuizQuestionResult, error', () => {
    // If player ID does not exist
    test('Invalid playerId', () => {
      const response = httpPlayerQuizQuestionResult(-1, 1);
      expect(response.statusCode).toBe(400);
      expect(response.jsonBody.error).toStrictEqual(expect.any(String));
    });

    // If question position is not valid for the session this player is in
    test('Invalid questionPosition', () => {
      const response = httpPlayerQuizQuestionResult(player1Id, -1);
      expect(response.statusCode).toBe(400);
      expect(response.jsonBody.error).toStrictEqual(expect.any(String));
    });

    // Session is not in ANSWER_SHOW state
    test('Session not in ANSWER_SHOW state', () => {
      httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.END);
      const response = httpPlayerQuizQuestionResult(player1Id, 1);
      expect(response.statusCode).toBe(400);
      expect(response.jsonBody.error).toStrictEqual(expect.any(String));
    });

    // If session is not currently on this question
    test('Session not on this question', () => {
      httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.NEXT_QUESTION);
      const response = httpPlayerQuizQuestionResult(player1Id, 1);
      expect(response.statusCode).toBe(400);
      expect(response.jsonBody.error).toStrictEqual(expect.any(String));
    });
  });

  describe('Testing playerQuizQuestionResult, success', () => {
    test('Player1 answers correctly', () => {
      httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.NEXT_QUESTION);
      const quizInfo = httpAdminQuizInfoV2(token, quizId);
      const correctAnswerId = (quizInfo.jsonBody.questions as Question[])[0]
        .answers.find((answer) => answer.correct).answerId;
      httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.SKIP_COUNTDOWN);
      httpPlayerSubmitAnswers(player1Id, 1, [correctAnswerId]);
      httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.GO_TO_ANSWER);
      const response = httpPlayerQuizQuestionResult(player1Id, 1);
      expect(response.statusCode).toBe(200);
      expect(response.jsonBody).toStrictEqual({
        questionId: questionId,
        playerCorrectList: ['Player1'],
        averageAnswerTime: expect.any(Number),
        percentCorrect: 100
      });
    });

    test('Player1 answers correctly, Player2 answers incorrectly', () => {
      httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.NEXT_QUESTION);
      const quizInfo = httpAdminQuizInfoV2(token, quizId);
      const correctAnswerId = (quizInfo.jsonBody.questions as Question[])[0]
        .answers.find((answer) => answer.correct).answerId;
      const incorrectAnswerId = (quizInfo.jsonBody.questions as Question[])[0]
        .answers.find((answer) => !answer.correct).answerId;
      httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.SKIP_COUNTDOWN);
      httpPlayerSubmitAnswers(player1Id, 1, [correctAnswerId]);
      httpPlayerSubmitAnswers(player2Id, 1, [incorrectAnswerId]);
      httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.GO_TO_ANSWER);
      const response = httpPlayerQuizQuestionResult(player1Id, 1);
      expect(response.statusCode).toBe(200);
      expect(response.jsonBody).toStrictEqual({
        questionId: questionId,
        playerCorrectList: ['Player1'],
        averageAnswerTime: expect.any(Number),
        percentCorrect: 50
      });
    });

    test('Player1 and Player2 answer correctly, Player3 answers incorrectly', () => {
      httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.NEXT_QUESTION);
      const quizInfo = httpAdminQuizInfoV2(token, quizId);
      const correctAnswerId = (quizInfo.jsonBody.questions as Question[])[0]
        .answers.find((answer) => answer.correct).answerId;
      const incorrectAnswerId = (quizInfo.jsonBody.questions as Question[])[0]
        .answers.find((answer) => !answer.correct).answerId;
      httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.SKIP_COUNTDOWN);
      httpPlayerSubmitAnswers(player1Id, 1, [correctAnswerId]);
      httpPlayerSubmitAnswers(player2Id, 1, [correctAnswerId]);
      httpPlayerSubmitAnswers(player3Id, 1, [incorrectAnswerId]);
      httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.GO_TO_ANSWER);
      const response = httpPlayerQuizQuestionResult(player1Id, 1);
      expect(response.statusCode).toBe(200);
      expect(response.jsonBody).toStrictEqual({
        questionId: questionId,
        playerCorrectList: ['Player1', 'Player2'],
        averageAnswerTime: expect.any(Number),
        percentCorrect: 67
      });
    });
  });
});
