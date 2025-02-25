import {
    httpAdminQuizCreateV2,
    httpAdminQuizSessionStart,
    httpAdminAuthRegister,
    httpPlayerJoinSession,
    httpAdminQuizQuestionsCreateV2,
    httpPlayerSessionFinalResult,
    httpAdminQuizSessionUpdate,
    httpPlayerSubmitAnswers,
    httpClear,
    httpAdminQuizInfoV2,
    httpAdminQuizSessionGetStatus
  } from './testHelper';
  import { Token, Question } from '../dataStore';
  import { QuizActions } from '../states';
  
  describe('Testing GET - playerSessionFinalResult', () => {
    let admin, player1, player1Id: number, player2, player2Id: number, player3, player3Id: number,
      quiz, quizId: number, session, questionId: number, question, token: Token, sessionId: number;
    const questionBody1 = {
      question: 'Test Quiz 1',
      duration: 3,
      points: 1,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionBody2 = {
      question: 'Test Quiz 2',
      duration: 3,
      points: 1,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
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
  
    describe('Testing playerSessionFinalResult, error', () => {
      // If player ID does not exist
      test('Invalid playerId', () => {
        httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.GO_TO_FINAL_RESULTS);
        const response = httpPlayerSessionFinalResult(-1);
        expect(response.statusCode).toBe(400);
        expect(response.jsonBody.error).toStrictEqual(expect.any(String));
      });

      // Session is not in FINAL_RESULTS state
      test('Session not in FINAL_RESULTS state', () => {
        httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.END);
        const response = httpPlayerSessionFinalResult(player1Id);
        expect(response.statusCode).toBe(400);
        expect(response.jsonBody.error).toStrictEqual(expect.any(String));
      });
    });
  
    // describe('Testing playerSessionFinalResult, success', () => {
    //   test('Player1 answers correctly', () => {
    //     httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.NEXT_QUESTION);
    //     const quizInfo = httpAdminQuizInfoV2(token, quizId);
    //     const correctAnswerId = (quizInfo.jsonBody.questions as Question[])[0]
    //       .answers.find((answer) => answer.correct).answerId;
    //     httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.SKIP_COUNTDOWN);
    //     httpPlayerSubmitAnswers(player1Id, 1, [correctAnswerId]);
    //     httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.GO_TO_ANSWER);
    //     httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.GO_TO_FINAL_RESULTS);
    //     const response = httpPlayerSessionFinalResult(player1Id);
    //     expect(response.statusCode).toBe(200);
    //     expect(response.jsonBody.error).toBeUndefined();
    //   });
  
    //   test('Player1 answers correctly, Player2 answers incorrectly', () => {
    //     httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.NEXT_QUESTION);
    //     const quizInfo = httpAdminQuizInfoV2(token, quizId);
    //     const correctAnswerId = (quizInfo.jsonBody.questions as Question[])[0]
    //       .answers.find((answer) => answer.correct).answerId;
    //     const incorrectAnswerId = (quizInfo.jsonBody.questions as Question[])[0]
    //       .answers.find((answer) => !answer.correct).answerId;
    //     httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.SKIP_COUNTDOWN);
    //     httpPlayerSubmitAnswers(player1Id, 1, [correctAnswerId]);
    //     httpPlayerSubmitAnswers(player2Id, 1, [incorrectAnswerId]);
    //     httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.GO_TO_ANSWER);
    //     httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.GO_TO_FINAL_RESULTS);
    //     const response = httpPlayerSessionFinalResult(player1Id);
    //     expect(response.statusCode).toBe(200);
    //     expect(response.jsonBody.error).toBeUndefined();
    //   });
  
    //   test('Player1 and Player2 answer correctly, Player3 answers incorrectly', () => {
    //     httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.NEXT_QUESTION);
    //     const quizInfo = httpAdminQuizInfoV2(token, quizId);
    //     const correctAnswerId = (quizInfo.jsonBody.questions as Question[])[0]
    //       .answers.find((answer) => answer.correct).answerId;
    //     const incorrectAnswerId = (quizInfo.jsonBody.questions as Question[])[0]
    //       .answers.find((answer) => !answer.correct).answerId;
    //     httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.SKIP_COUNTDOWN);
    //     httpPlayerSubmitAnswers(player1Id, 1, [correctAnswerId]);
    //     httpPlayerSubmitAnswers(player2Id, 1, [correctAnswerId]);
    //     httpPlayerSubmitAnswers(player3Id, 1, [incorrectAnswerId]);
    //     httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.GO_TO_ANSWER);
    //     httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.GO_TO_FINAL_RESULTS);
    //     const response = httpPlayerSessionFinalResult(player1Id);
    //     expect(response.statusCode).toBe(200);
    //     expect(response.jsonBody.error).toBeUndefined();
    //   });
    // });
  });