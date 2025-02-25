import {
  httpPlayerChatSend,
  httpAdminQuizCreateV2,
  httpAdminQuizSessionStart,
  httpAdminAuthRegister,
  httpPlayerJoinSession,
  httpAdminQuizQuestionsCreate,
  httpPlayerChatView,
  httpClear
} from './testHelper';
import { Chat } from '../dataStore';

describe('Testing GET - playerChatView', () => {
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
    quiz = httpAdminQuizCreateV2(JSON.parse(admin.jsonBody.token as string), 'Quiz1', 'Quiz1 description');
    expect(quiz.statusCode).toBe(200);
    quizId = quiz.jsonBody.quizId as number;
    httpAdminQuizQuestionsCreate(JSON.parse(admin.jsonBody.token as string), quizId, questionBody);
    session = httpAdminQuizSessionStart(JSON.parse(admin.jsonBody.token as string), quiz.jsonBody.quizId as number, 2);
    expect(session.statusCode).toBe(200);
    player1 = httpPlayerJoinSession(session.jsonBody.sessionId as number, 'Player1');
    expect(player1.statusCode).toBe(200);
    player1Id = player1.jsonBody.playerId as number;
    player2 = httpPlayerJoinSession(session.jsonBody.sessionId as number, 'Player2');
    player2Id = player2.jsonBody.playerId as number;
    expect(player2.statusCode).toBe(200);
  });

  describe('Testing playerChatView, error', () => {
    test('Invalid playerId', () => {
      httpPlayerChatSend(player1Id, 'Message');
      const response = httpPlayerChatView(-1);
      expect(response.statusCode).toBe(400);
      expect(response.jsonBody.error).toStrictEqual(expect.any(String));
    });
  });

  describe('Testing playerChatView, success', () => {
    test('Player1 sends message', () => {
      httpPlayerChatSend(player1Id, 'Message');
      const timeSent = Date.now();
      const response = httpPlayerChatView(player1Id);
      expect(response.statusCode).toBe(200);
      const message = (response.jsonBody.messages as unknown as Chat[])[0];
      expect(message.playerId).toBe(player1Id);
      expect(message.messageBody).toBe('Message');
      expect(message.playerName).toBe('Player1');
      expect(Math.abs(message.timeSent - timeSent)).toBeLessThanOrEqual(1000);
    });

    test('Player1 and Player2 sends message', () => {
      const timeSent1 = Date.now();
      httpPlayerChatSend(player1Id, 'Message1');
      const timeSent2 = Date.now();
      httpPlayerChatSend(player2Id, 'Message2');
      const response = httpPlayerChatView(player1Id);
      expect(response.statusCode).toBe(200);
      const message1 = (response.jsonBody.messages as unknown as Chat[])[0];
      expect(message1.playerId).toBe(player1Id);
      expect(message1.messageBody).toBe('Message1');
      expect(message1.playerName).toBe('Player1');
      expect(Math.abs(message1.timeSent - timeSent1)).toBeLessThanOrEqual(1000);
      const message2 = (response.jsonBody.messages as unknown as Chat[])[1];
      expect(message2.playerId).toBe(player2Id);
      expect(message2.messageBody).toBe('Message2');
      expect(message2.playerName).toBe('Player2');
      expect(Math.abs(message2.timeSent - timeSent2)).toBeLessThanOrEqual(1000);
    });

    test('Player1 and Player2 sends message', () => {
      const timeSent1 = Date.now();
      httpPlayerChatSend(player1Id, 'Message1');
      const timeSent2 = Date.now();
      httpPlayerChatSend(player2Id, 'Message2');
      const response = httpPlayerChatView(player2Id);
      expect(response.statusCode).toBe(200);
      const message1 = (response.jsonBody.messages as unknown as Chat[])[0];
      expect(message1.playerId).toBe(player1Id);
      expect(message1.messageBody).toBe('Message1');
      expect(message1.playerName).toBe('Player1');
      expect(Math.abs(message1.timeSent - timeSent1)).toBeLessThanOrEqual(1000);
      const message2 = (response.jsonBody.messages as unknown as Chat[])[1];
      expect(message2.playerId).toBe(player2Id);
      expect(message2.messageBody).toBe('Message2');
      expect(message2.playerName).toBe('Player2');
      expect(Math.abs(message2.timeSent - timeSent2)).toBeLessThanOrEqual(1000);
    });
  });
});
