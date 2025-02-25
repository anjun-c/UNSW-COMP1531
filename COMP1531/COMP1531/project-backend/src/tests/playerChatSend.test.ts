import {
  httpPlayerChatSend,
  httpAdminQuizCreate,
  httpAdminQuizSessionStart,
  httpAdminAuthRegister,
  httpPlayerJoinSession,
  httpAdminQuizQuestionsCreate,
  httpPlayerChatView,
  httpClear
} from './testHelper';

describe('Testing POST - playerChatSend', () => {
  let admin, player1, player1Id: number, player2, player2Id: number, quiz, quizId: number, session;
  const questionBody = {
    question: 'Test Quiz 1',
    duration: 3,
    points: 1,
    answers: [{ answer: 'Test Answer 1', correct: true },
      { answer: 'Test Answe 2', correct: false },
      { answer: 'Test Answer 3', correct: false },
      { answer: 'Test Answer 4', correct: false }
    ]
  };
  beforeEach(() => {
    httpClear();
    admin = httpAdminAuthRegister('test1@email.com', 'TestPassword123', 'Firstone', 'Lastone');
    expect(admin.statusCode).toBe(200);
    quiz = httpAdminQuizCreate(JSON.parse(admin.jsonBody.token as string), 'Quiz1', 'Quiz1 description');
    expect(quiz.statusCode).toBe(200);
    quizId = quiz.jsonBody.quizId as number;
    httpAdminQuizQuestionsCreate(JSON.parse(admin.jsonBody.token as string), quizId, questionBody);
    session = httpAdminQuizSessionStart(JSON.parse(admin.jsonBody.token as string), (quiz.jsonBody.quizId as number), 2);
    expect(session.statusCode).toBe(200);
    player1 = httpPlayerJoinSession(session.jsonBody.sessionId as number, 'Player1');
    expect(player1.statusCode).toBe(200);
    player1Id = player1.jsonBody.playerId as number;
    player2 = httpPlayerJoinSession(session.jsonBody.sessionId as number, 'Player2');
    player2Id = player2.jsonBody.playerId as number;
    expect(player2.statusCode).toBe(200);
  });

  describe('Testing playerChatSend, error', () => {
    test('Invalid playerId', () => {
      const response = httpPlayerChatSend(-1, 'Message');
      expect(response.statusCode).toBe(400);
      expect(response.jsonBody.error).toStrictEqual(expect.any(String));
    });

    test('Invalid message length', () => {
      const response = httpPlayerChatSend(player1Id, '');
      expect(response.statusCode).toBe(400);
      expect(response.jsonBody.error).toStrictEqual(expect.any(String));
    });
  });

  describe('Testing playerChatSend, success', () => {
    test('Player1 sends message', () => {
      const response = httpPlayerChatSend(player1Id, 'Message');
      expect(response.statusCode).toBe(200);
      expect(response.jsonBody).toStrictEqual({});
      const messages = httpPlayerChatView(player1Id);
      expect(messages.jsonBody).toStrictEqual({
        messages: [
          {
            playerId: player1Id,
            messageBody: 'Message',
            playerName: 'Player1',
            timeSent: expect.any(Number)
          }
        ]
      });
    });

    test('Player1 and Player2 sends message', () => {
      const response1 = httpPlayerChatSend(player1Id, 'Message1');
      expect(response1.statusCode).toBe(200);
      const response2 = httpPlayerChatSend(player2Id, 'Message2');
      expect(response2.statusCode).toBe(200);
      const messages = httpPlayerChatView(player1Id);
      expect(messages.jsonBody).toStrictEqual({
        messages: [
          {
            playerId: player1Id,
            messageBody: 'Message1',
            playerName: 'Player1',
            timeSent: expect.any(Number)
          },
          {
            playerId: player2Id,
            messageBody: 'Message2',
            playerName: 'Player2',
            timeSent: expect.any(Number)
          }
        ]
      });
    });
  });
});
