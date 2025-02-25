import express, { json, Request, Response } from 'express';
import { echo } from './newecho';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

import { adminAuthLogout } from './features/adminAuthLogout';
import { adminAuthLogin } from './features/adminAuthLogin';
import { adminAuthRegister } from './features/adminAuthRegister';
import { clear } from './features/clear';
import { adminQuizQuestionCreate } from './features/adminQuizQuestionCreate';
import { adminQuizCreate } from './features/adminQuizCreate';
import { adminQuizList } from './features/adminQuizList';
import { adminUserPasswordUpdate } from './features/adminUserPasswordUpdate';
import { adminQuizInfo } from './features/adminQuizInfo';
import { adminQuizRemove } from './features/adminQuizRemove';
import { adminUserDetails } from './features/adminUserDetails';
import { adminUserDetailsUpdate } from './features/adminUserDetailsUpdate';
import { adminQuizQuestionMove } from './features/adminQuizQuestionMove';
import { adminQuizQuestionDuplicate } from './features/adminQuizQuestionDuplicate';
import { adminQuizTransfer } from './features/adminQuizTransfer';
import { adminQuizNameUpdate } from './features/adminQuizNameUpdate';
import { adminQuizDescriptionUpdate } from './features/adminQuizDescriptionUpdate';
import { adminQuizQuestionDelete } from './features/adminQuizQuestionDelete';
import { adminQuizRestore } from './features/adminQuizRestore';
import { adminQuizQuestionMoveResponse } from './features/adminQuizQuestionMove';
import { adminQuizQuestionDuplicateResponse } from './features/adminQuizQuestionDuplicate';
import { adminQuizTrashEmpty } from './features/adminQuizTrashEmpty';
import { adminQuizQuestionUpdate } from './features/adminQuizQuestionUpdate';
import { adminQuizTrashView } from './features/adminQuizTrashView';
import { adminQuizSessionStart } from './features/adminQuizSessionStart';
import { playerJoinSession } from './features/playerJoinSession';
import { adminQuizThumbnail } from './features/adminQuizThumbnail';
import { playerChatSend } from './features/playerChatSend';
import { playerGetStatus } from './features/playerGetStatus';
import { playerGetQuestionInfo } from './features/playerGetQuestionInfo';
import { playerSubmitAnswers } from './features/playerSubmitAnswers';
import { adminQuizSessionsView } from './features/adminQuizSessionsView';
import { playerChatView } from './features/playerChatView';
import { strToAction } from './helpers/stringToEnum';
import { adminQuizSessionUpdate } from './features/adminQuizSessionUpdate';
import { adminQuizSessionGetStatus } from './features/adminQuizSessionGetStatus';
import { playerQuizQuestionResult } from './features/playerQuizQuestionResult';
import { playerSessionFinalResult } from './features/playerSessionFinalResult';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));
// for producing the docs that define the API
const file = fs.readFileSync(path.join(process.cwd(), 'swagger.yaml'), 'utf8');
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || '127.0.0.1';

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const result = echo(req.query.echo as string);
  if ('error' in result) {
    res.status(400);
  }

  return res.json(result);
});

app.put('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  try {
    const quizid = parseInt(req.params.quizid);
    const questionid = parseInt(req.params.questionid);
    const { questionBody } = req.body;
    const token = JSON.parse(req.body.token as string);
    const result = adminQuizQuestionUpdate(token, quizid, questionid, questionBody);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'User is not owner of this quiz or quiz does not exist.') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Token is empty or invalid.') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'QuizId is not a valid quiz.') {
      return res.status(400).json({ error: e.message });
    }
    if (e.message === 'Too many answers.' ||
      e.message === 'Too few answers.' ||
      e.message === 'Question too short.' ||
      e.message === 'Question too long.' ||
      e.message === 'Points too low.' ||
      e.message === 'Points too high.' ||
      e.message === 'Duration too short.' ||
      e.message === 'Duration too long.' ||
      e.message === 'Answer too short.' ||
      e.message === 'Answer too long.' ||
      e.message === 'Sum of duration too long.' ||
      e.message === 'Duplicate answers.' ||
      e.message === 'QuestionId is not a valid question.' ||
      e.message === 'No correct answer.') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.post('/v1/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  try {
    const quizid = parseInt(req.params.quizid as string);
    const token = JSON.parse(req.body.token as string);
    const questionBodyObject = req.body.questionBody;

    const result = adminQuizQuestionCreate(token, quizid, questionBodyObject);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'QuizId is not a valid quiz.') {
      return res.status(400).json({ error: e.message });
    }
    if (e.message === 'UserId is not a valid user.') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'User is not owner of this quiz or quiz does not exist.') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Too many answers.' ||
      e.message === 'Too few answers.' ||
      e.message === 'Question too short.' ||
      e.message === 'Question too long.' ||
      e.message === 'Points too low.' ||
      e.message === 'Points too high.' ||
      e.message === 'Duration too short.' ||
      e.message === 'Duration too long.' ||
      e.message === 'Answer too short.' ||
      e.message === 'Answer too long.' ||
      e.message === 'Sum of duration too long.' ||
      e.message === 'Duplicate answers.' ||
      e.message === 'No correct answer.') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  // const token = req.query.token as string;
  // const result = adminQuizList({ sessionId: token });

  // if (result.error) {
  //   return res.status(401);
  // }

  // res.json(result);
  try {
    const token = JSON.parse(req.query.token as string);
    const result = adminQuizList(token);

    return res.json(result);
  } catch (e) {
    return res.status(401).json({ error: e.message });
  }
});

app.post('/v1/admin/quiz', (req: Request, res: Response) => {
  try {
    const token = JSON.parse(req.body.token);
    const name = req.body.name;
    const description = req.body.description;
    const result = adminQuizCreate(token, name, description);
    res.json(result);
  } catch (e) {
    if (e.message === 'Invalid User ID') {
      return res.status(401).json({ error: e.message });
    }
    return res.status(400).json({ error: e.message });
  }
});

app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  try {
    const token = JSON.parse(req.query.token as string);
    const result = adminQuizList(token);

    return res.json(result);
  } catch (e) {
    return res.status(401).json({ error: e.message });
  }
});

app.delete('/v1/clear', (req: Request, res: Response) => {
  clear();
  res.status(200);
  return res.json({});
});

app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  try {
    const token = JSON.parse(req.body.token);
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const result = adminUserPasswordUpdate(token, oldPassword, newPassword);
    return res.json(result);
  } catch (e) {
    if (e.message === 'Invalid User ID') {
      return res.status(401).json({ error: e.message });
    }
    return res.status(400).json({ error: e.message });
  }
});

app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  try {
    const { email, password, nameFirst, nameLast } = req.body;
    const token = adminAuthRegister(email, password, nameFirst, nameLast);
    const tokenStr = JSON.stringify(token);
    const result = { token: tokenStr };
    return res.json(result);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = adminAuthLogin(email, password);
    const tokenStr = JSON.stringify(token);
    const result = { token: tokenStr };
    return res.json(result);
  } catch (e) {
    if (e.message === 'Email does not exist') {
      return res.status(400).json({ error: e.message });
    }
    if (e.message === 'Incorrect password') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  try {
    const token = JSON.parse(req.body.token);
    const result = adminAuthLogout(token);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'Session not found') {
      return res.status(401).json({ error: e.message });
    }
  }
});

app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  try {
    const token = JSON.parse(req.query.token as string);
    const result = adminQuizTrashView(token);
    return res.json(result);
  } catch (e) {
    if (e.message === 'UserId is not a valid user.') {
      return res.status(401).json({ error: e.message });
    }
    return res.status(400).json({ error: e.message });
  }
});

app.get('/v1/admin/quiz/:quizId', (req: Request, res: Response) => {
  try {
    const token = JSON.parse(req.query.token as string);
    const quizId = parseInt(req.params.quizId);
    const result = adminQuizInfo(token, quizId);
    return res.json(result);
  } catch (e) {
    if (e.message === 'Quiz is not in the end state') {
      return res.status(400).json({ error: e.message });
    }
    if (e.message === 'User not found.' || e.message === 'Invalid User ID') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'Given user is not the author of this quiz.' || e.message === 'Quiz not found.') {
      return res.status(403).json({ error: e.message });
    }
  }
});

app.delete('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  try {
    const token = JSON.parse(req.query.token as string);
    const quizId = parseInt(req.params.quizid);
    const result = adminQuizRemove(token, quizId);
    return res.json(result);
  } catch (e) {
    if (e.message === 'Invalid User ID') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'Given user is not the author of this quiz.' || e.message === 'Quiz not found.') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Quiz is not in trash.') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.delete('/v1/admin/quiz/trash/empty', (req: Request, res: Response) => {
  try {
    const token = JSON.parse(req.query.token as string);
    const quizIds = req.query.quizIds as string;
    const result = adminQuizTrashEmpty(token, quizIds);
    return res.json(result);
  } catch (e) {
    if (e.message === 'UserId is not a valid user.') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'Given user is not the author of this quiz.' ||
      e.message === 'Quiz not found.' || e.message === 'No quizIds provided.') {
      return res.status(403).json({ error: e.message });
    } else {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  try {
    const token = JSON.parse(req.query.token as string);
    const result = adminUserDetails(token);
    res.status(200).json(result);
  } catch (e) {
    if (e.message === 'UserId is not a valid user.') {
      return res.status(401).json({ error: e.message });
    }
  }
});

app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  try {
    const { email, nameFirst, nameLast } = req.body;
    const token = JSON.parse(req.body.token as string);
    const result = adminUserDetailsUpdate(token, email, nameFirst, nameLast);

    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'UserId is not a valid user.') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'Invalid email format.') {
      return res.status(400).json({ error: e.message });
    }
    if (e.message === 'Email is already used by another user.') {
      return res.status(400).json({ error: e.message });
    }
    if (e.message === 'First name contains invalid characters.') {
      return res.status(400).json({ error: e.message });
    }
    if (e.message === 'Last name contains invalid characters.') {
      return res.status(400).json({ error: e.message });
    }
    if (e.message === 'First name must be between 2 and 20 characters.') {
      return res.status(400).json({ error: e.message });
    }
    if (e.message === 'Last name must be between 2 and 20 characters.') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.put('/v1/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  try {
    const quizId = parseInt(req.params.quizid);
    const questionId = parseInt(req.params.questionid);
    const token = JSON.parse(req.body.token as string);
    const newPosition = req.body.newPosition;

    const result: adminQuizQuestionMoveResponse = adminQuizQuestionMove(questionId, quizId, token, newPosition);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'Quiz does not exist') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Token is empty or invalid') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'User is not owner of this quiz') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Invalid new position') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.post('/v1/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  try {
    const quizid = parseInt(req.params.quizid);
    const questionid = parseInt(req.params.questionid);
    const token = JSON.parse(req.body.token as string);

    const result: adminQuizQuestionDuplicateResponse = adminQuizQuestionDuplicate(quizid, questionid, token);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'Token is empty or invalid') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'Quiz does not exist') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'User is not owner of this quiz or quiz does not exist') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Question does not exist in this quiz') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.post('/v1/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  try {
    const { userEmail } = req.body;
    const token = JSON.parse(req.body.token as string);
    const quizid = parseInt(req.params.quizid);
    const result = adminQuizTransfer(quizid, token, userEmail);
    return res.json(result);
  } catch (e) {
    if (e.message === 'Invalid token') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'User does not own a quiz with this quizId') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Email not found' ||
      e.message === 'Email belongs to current user' ||
      e.message === 'User already owns a quiz with this name') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.put('/v1/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  try {
    const quizid = parseInt(req.params.quizid);
    const { name } = req.body;
    const token = JSON.parse(req.body.token as string);

    const result = adminQuizNameUpdate(token, quizid, name);
    return res.json(result);
  } catch (e) {
    if (e.message === 'UserId is not a valid user.') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'Quiz not found.' ||
      e.message === 'Given user is not the author of this quiz.') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Invalid name' ||
      e.message === 'Name already used') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.put('/v1/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  try {
    const quizid = parseInt(req.params.quizid);
    const { description } = req.body;
    const token = JSON.parse(req.body.token as string);

    const result = adminQuizDescriptionUpdate(token, quizid, description);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'Quiz not found.') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'UserId is not a valid user.') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'Given user is not the author of this quiz.') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Invalid description') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.delete('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  try {
    const quizid = parseInt(req.params.quizid);
    const questionid = parseInt(req.params.questionid);
    const token = JSON.parse(req.query.token as string);

    const result = adminQuizQuestionDelete(token, quizid, questionid);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'Quiz not found.') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'UserId is not a valid user.') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'Given user is not the author of this quiz.') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Question not found in this quiz') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.post('/v1/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  try {
    const quizid = parseInt(req.params.quizid);
    const token = JSON.parse(req.body.token);
    const result = adminQuizRestore(token, quizid);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'UserId is not a valid user.') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'Quiz not found.' ||
      e.message === 'Given user is not the author of this quiz.') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Quiz exists but not in trash.' ||
      e.message === 'Name is already taken by another active quiz') {
      return res.status(400).json({ error: e.message });
    }
  }
});

// ====================================================================
// ================= ITERATION 3 ROUTES BELOW THIS LINE ================
// ====================================================================
app.get('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  try {
    const quizid = parseInt(req.params.quizid);
    const sessionid = parseInt(req.params.sessionid);
    const token = JSON.parse(req.header('token') as string);
    const result = adminQuizSessionGetStatus(token, quizid, sessionid);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'Token is empty or invalid') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'User does not own this quiz') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Session does not exist') {
      return res.status(400).json({ error: e.message });
    }
    return res.status(400).json({ error: e.message });
  }
});

app.put('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  try {
    const quizid = parseInt(req.params.quizid);
    const sessionid = parseInt(req.params.sessionid);
    const token = JSON.parse(req.header('token') as string);
    const { action } = req.body; // As string
    const actionEnum = strToAction(action); // match string to enum
    const result = adminQuizSessionUpdate(token, quizid, sessionid, actionEnum);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'Token is empty or invalid') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'User does not own this quiz') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Session does not exist' ||
        e.message === 'Invalid Action' ||
        e.message === 'Action cannot be applied') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.put('/v1/admin/quiz/:quizid/thumbnail', (req: Request, res: Response) => {
  try {
    const quizid = parseInt(req.params.quizid);
    const token = JSON.parse(req.header('token') as string);
    const imgUrl = req.body.imgUrl;
    const result = adminQuizThumbnail(token, quizid, imgUrl);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'Token is empty or invalid') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'User is not owner of this quiz') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Invalid thumbnail URL format') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.post('/v1/admin/quiz/:quizid/session/start', (req: Request, res: Response) => {
  try {
    const token = JSON.parse(req.header('token') || '{}');
    const quizid = parseInt(req.params.quizid);
    const autoStartNum = req.body.autoStartNum;
    const result = adminQuizSessionStart(token, quizid, autoStartNum);
    return res.status(200).json(result);
  } catch (e) {
    if (
      e.message === 'Player threshold cannot be greater than 50' ||
      e.message === 'There are too many active sessions for this quiz' ||
      e.message === 'This quiz has no questions' ||
      e.message === 'The quiz is in trash'
    ) {
      console.log('successful if statement route');
      return res.status(400).json({ error: e.message });
    }
    if (e.message === 'Token is invalid') {
      return res.status(401).json({ error: e.message });
    }
    if (
      e.message === 'User does not own this quiz' ||
      e.message === 'Quiz does not exist'
    ) {
      return res.status(403).json({ error: e.message });
    }
  }
});

app.get('/v1/admin/quiz/:quizId/sessions', (req: Request, res: Response) => {
  try {
    const token = JSON.parse(req.header('token'));
    const quizid = parseInt(req.params.quizId);
    const result = adminQuizSessionsView(token, quizid);
    return res.status(200).json(result);
  } catch (e) {
    if (
      e.message === 'Token is invalid' ||
      e.message === 'Token is empty'
    ) {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'User does not own a quiz with this name') {
      return res.status(403).json({ error: e.message });
    }
  }
});

app.post('/v1/player/join', (req: Request, res: Response) => {
  try {
    const { sessionId, name } = req.body;
    const result = playerJoinSession(sessionId, name);
    return res.status(200).json(result);
  } catch (e) {
    if (
      e.message === 'Session Id does not refer to a valid session' ||
      e.message === 'Session is not in LOBBY state' ||
      e.message === 'Name of user entered is not unique'
      // e.message === 'No players in quiz'
    ) {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.get('/v1/player/:playerid', (req: Request, res: Response) => {
  try {
    const playerId = parseInt(req.params.playerid);
    const result = playerGetStatus(playerId);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'Player ID does not exist') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.get('/v1/player/:playerid/question/:questionposition', (req: Request, res: Response) => {
  try {
    const playerId = parseInt(req.params.playerid);
    const questionPosition = parseInt(req.params.questionposition);
    const result = playerGetQuestionInfo(playerId, questionPosition);
    return res.status(200).json(result);
  } catch (e) {
    if (
      e.message === 'Player ID does not exist' ||
      e.message === 'Question position is not valid for the session this player is in' ||
      e.message === 'Session is not currently on this question' ||
      e.message === 'Session is in LOBBY, QUESTION_COUNTDOWN, FINAL_RESULTS or END state'
    ) {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.put('/v1/player/:playerid/question/:questionposition/answer', (req: Request, res: Response) => {
  try {
    const playerId = parseInt(req.params.playerid);
    const questionPosition = parseInt(req.params.questionposition);
    const { answerIds } = req.body;
    const result = playerSubmitAnswers(playerId, questionPosition, answerIds);
    return res.status(200).json(result);
  } catch (e) {
    if (
      e.message === 'Player ID does not exist' ||
      e.message === 'Question position is not valid for the session this player is in' ||
      e.message === 'Session is not in QUESTION_OPEN state' ||
      e.message === 'Session is not currently on this question' ||
      e.message === 'Answer IDs are not valid for this particular question' ||
      e.message === 'There are duplicate answer IDs provided' ||
      e.message === 'Less than 1 answer ID was submitted'
    ) {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.post('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  try {
    const playerId = parseInt(req.params.playerid);
    const message = req.body.message;
    const result = playerChatSend(playerId, message);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'Player ID does not exist' ||
      e.message === 'Message length must be between 1 and 100 characters') {
      console.log(e.message);
      return res.status(400).json({ error: e.message });
    }
  }
});

app.get('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  try {
    const playerId = parseInt(req.params.playerid);
    const result = playerChatView(playerId);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'Player ID does not exist') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.get('/v1/player/:playerid/question/:questionposition/results', (req: Request, res: Response) => {
  try {
    const playerId = parseInt(req.params.playerid);
    const questionPosition = parseInt(req.params.questionposition);
    const result = playerQuizQuestionResult(playerId, questionPosition);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'Player ID does not exist' ||
      e.message === 'Question position is not valid for the session this player is in' ||
      e.message === 'Session is not currently on this question' ||
      e.message === 'Session is not in ANSWER_SHOW state') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.get('/v1/player/:playerid/results', (req: Request, res: Response) => {
  try {
    const playerId = parseInt(req.params.playerid);
    const result = playerSessionFinalResult(playerId);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'Player ID does not exist' || e.message === 'Session is not in FINAL_RESULTS state') {
      return res.status(400).json({ error: e.message });
    }
  }
  });

// ====================================================================
// =================  V2 ROUTES BELOW THIS LINE ========================
// ====================================================================

app.put('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  try {
    const quizid = parseInt(req.params.quizid);
    const questionid = parseInt(req.params.questionid);
    const { questionBody } = req.body;
    const token = JSON.parse(req.header('token'));
    const result = adminQuizQuestionUpdate(token, quizid, questionid, questionBody);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'User is not owner of this quiz or quiz does not exist.') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Token is empty or invalid.') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'QuizId is not a valid quiz.') {
      return res.status(400).json({ error: e.message });
    }
    if (e.message === 'Too many answers.' ||
      e.message === 'Too few answers.' ||
      e.message === 'Question too short.' ||
      e.message === 'Question too long.' ||
      e.message === 'Points too low.' ||
      e.message === 'Points too high.' ||
      e.message === 'Duration too short.' ||
      e.message === 'Duration too long.' ||
      e.message === 'Answer too short.' ||
      e.message === 'Answer too long.' ||
      e.message === 'Sum of duration too long.' ||
      e.message === 'Duplicate answers.' ||
      e.message === 'QuestionId is not a valid question.' ||
      e.message === 'No correct answer.' ||
      e.message === 'Thumbnail URL is empty.' ||
      e.message === 'Invalid thumbnail file type.' ||
      e.message === 'Invalid thumbnail URL format.') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.post('/v2/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  try {
    const quizid = parseInt(req.params.quizid as string);
    const token = JSON.parse(req.header('token'));
    const questionBodyObject = req.body.questionBody;

    const result = adminQuizQuestionCreate(token, quizid, questionBodyObject);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'QuizId is not a valid quiz.') {
      return res.status(400).json({ error: e.message });
    }
    if (e.message === 'UserId is not a valid user.') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'User is not owner of this quiz or quiz does not exist.') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Too many answers.' ||
      e.message === 'Too few answers.' ||
      e.message === 'Question too short.' ||
      e.message === 'Question too long.' ||
      e.message === 'Points too low.' ||
      e.message === 'Points too high.' ||
      e.message === 'Duration too short.' ||
      e.message === 'Duration too long.' ||
      e.message === 'Answer too short.' ||
      e.message === 'Answer too long.' ||
      e.message === 'Sum of duration too long.' ||
      e.message === 'Duplicate answers.' ||
      e.message === 'No correct answer.' ||
      e.message === 'Thumbnail URL is empty.' ||
      e.message === 'Invalid thumbnail file type.' ||
      e.message === 'Invalid thumbnail URL format.') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.get('/v2/admin/quiz/list', (req: Request, res: Response) => {
  try {
    const token = JSON.parse(req.header('token'));
    const result = adminQuizList(token);

    return res.json(result);
  } catch (e) {
    return res.status(401).json({ error: e.message });
  }
});

app.post('/v2/admin/quiz', (req: Request, res: Response) => {
  try {
    const token = JSON.parse(req.header('token'));
    const name = req.body.name;
    const description = req.body.description;
    const result = adminQuizCreate(token, name, description);
    res.json(result);
  } catch (e) {
    if (e.message === 'Invalid User ID') {
      return res.status(401).json({ error: e.message });
    }
    return res.status(400).json({ error: e.message });
  }
});

app.delete('/v1/clear', (req: Request, res: Response) => {
  clear();
  res.status(200);
  return res.json({});
});

app.put('/v2/admin/user/password', (req: Request, res: Response) => {
  try {
    const token = JSON.parse(req.header('token'));
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const result = adminUserPasswordUpdate(token, oldPassword, newPassword);
    return res.json(result);
  } catch (e) {
    if (e.message === 'Invalid User ID') {
      return res.status(401).json({ error: e.message });
    }
    return res.status(400).json({ error: e.message });
  }
});

app.post('/v2/admin/auth/logout', (req: Request, res: Response) => {
  try {
    const token = JSON.parse(req.header('token'));
    const result = adminAuthLogout(token);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'Session not found') {
      return res.status(401).json({ error: e.message });
    }
  }
});

app.get('/v2/admin/quiz/trash', (req: Request, res: Response) => {
  try {
    const token = JSON.parse(req.header('token'));
    const result = adminQuizTrashView(token);
    return res.json(result);
  } catch (e) {
    if (e.message === 'UserId is not a valid user.') {
      return res.status(401).json({ error: e.message });
    }
    return res.status(400).json({ error: e.message });
  }
});

app.get('/v2/admin/quiz/:quizId', (req: Request, res: Response) => {
  try {
    const token = JSON.parse(req.header('token'));
    const quizId = parseInt(req.params.quizId);
    const result = adminQuizInfo(token, quizId);
    return res.json(result);
  } catch (e) {
    if (e.message === 'User not found.' || e.message === 'Invalid User ID') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'Given user is not the author of this quiz.' || e.message === 'Quiz not found.') {
      return res.status(403).json({ error: e.message });
    }
  }
});

app.delete('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  try {
    const token = JSON.parse(req.header('token'));
    const quizId = parseInt(req.params.quizid);
    const result = adminQuizRemove(token, quizId);
    return res.json(result);
  } catch (e) {
    if (e.message === 'Invalid User ID') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'Given user is not the author of this quiz.' || e.message === 'Quiz not found.') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Quiz has an active session.') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.delete('/v2/admin/quiz/trash/empty', (req: Request, res: Response) => {
  try {
    const token = JSON.parse(req.header('token'));
    const quizIds = req.query.quizIds as string;
    const result = adminQuizTrashEmpty(token, quizIds);
    return res.json(result);
  } catch (e) {
    if (e.message === 'UserId is not a valid user.') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'Given user is not the author of this quiz.' ||
      e.message === 'Quiz not found.' || e.message === 'No quizIds provided.') {
      return res.status(403).json({ error: e.message });
    } else {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.get('/v2/admin/user/details', (req: Request, res: Response) => {
  try {
    const token = JSON.parse(req.header('token'));
    const result = adminUserDetails(token);
    res.status(200).json(result);
  } catch (e) {
    if (e.message === 'UserId is not a valid user.') {
      return res.status(401).json({ error: e.message });
    }
  }
});

app.put('/v2/admin/user/details', (req: Request, res: Response) => {
  try {
    const { email, nameFirst, nameLast } = req.body;
    const token = JSON.parse(req.header('token'));
    const result = adminUserDetailsUpdate(token, email, nameFirst, nameLast);

    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'UserId is not a valid user.') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'Invalid email format.') {
      return res.status(400).json({ error: e.message });
    }
    if (e.message === 'Email is already used by another user.') {
      return res.status(400).json({ error: e.message });
    }
    if (e.message === 'First name contains invalid characters.') {
      return res.status(400).json({ error: e.message });
    }
    if (e.message === 'Last name contains invalid characters.') {
      return res.status(400).json({ error: e.message });
    }
    if (e.message === 'First name must be between 2 and 20 characters.') {
      return res.status(400).json({ error: e.message });
    }
    if (e.message === 'Last name must be between 2 and 20 characters.') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.put('/v2/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  try {
    const quizId = parseInt(req.params.quizid);
    const questionId = parseInt(req.params.questionid);
    const token = JSON.parse(req.header('token'));
    const newPosition = req.body.newPosition;

    const result: adminQuizQuestionMoveResponse = adminQuizQuestionMove(questionId, quizId, token, newPosition);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'Quiz does not exist') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Token is empty or invalid') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'User is not owner of this quiz') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Invalid new position') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.post('/v2/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  try {
    const quizid = parseInt(req.params.quizid);
    const questionid = parseInt(req.params.questionid);
    const token = JSON.parse(req.header('token'));

    const result: adminQuizQuestionDuplicateResponse = adminQuizQuestionDuplicate(quizid, questionid, token);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'Token is empty or invalid') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'Quiz does not exist') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'User is not owner of this quiz or quiz does not exist') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Question does not exist in this quiz') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.post('/v2/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  try {
    const { userEmail } = req.body;
    const token = JSON.parse(req.header('token'));
    const quizid = parseInt(req.params.quizid);
    const result = adminQuizTransfer(quizid, token, userEmail);
    return res.json(result);
  } catch (e) {
    if (e.message === 'Invalid token') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'User does not own a quiz with this quizId') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Email not found' ||
      e.message === 'Email belongs to current user' ||
      e.message === 'User already owns a quiz with this name' ||
      e.message === 'Quiz has an active session') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.put('/v2/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  try {
    const quizid = parseInt(req.params.quizid);
    const { name } = req.body;
    const token = JSON.parse(req.header('token'));

    const result = adminQuizNameUpdate(token, quizid, name);
    return res.json(result);
  } catch (e) {
    if (e.message === 'UserId is not a valid user.') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'Quiz not found.' ||
      e.message === 'Given user is not the author of this quiz.') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Invalid name' ||
      e.message === 'Name already used') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.put('/v2/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  try {
    const quizid = parseInt(req.params.quizid);
    const { description } = req.body;
    const token = JSON.parse(req.header('token'));

    const result = adminQuizDescriptionUpdate(token, quizid, description);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'Quiz not found.') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'UserId is not a valid user.') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'Given user is not the author of this quiz.') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Invalid description') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.delete('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  try {
    const quizid = parseInt(req.params.quizid);
    const questionid = parseInt(req.params.questionid);
    const token = JSON.parse(req.header('token'));

    const result = adminQuizQuestionDelete(token, quizid, questionid);
    return res.status(200).json(result);
  } catch (e) {
    if (e.message === 'Quiz not found.') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'UserId is not a valid user.') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'Given user is not the author of this quiz.') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Question not found in this quiz' ||
      e.message === 'Quiz has an active session') {
      return res.status(400).json({ error: e.message });
    }
  }
});

app.post('/v2/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  try {
    const quizid = parseInt(req.params.quizid);
    const token = JSON.parse(req.header('token'));
    const result = adminQuizRestore(token, quizid);
    return res.json(result);
  } catch (e) {
    if (e.message === 'UserId is not a valid user.') {
      return res.status(401).json({ error: e.message });
    }
    if (e.message === 'Quiz not found.' ||
      e.message === 'Given user is not the author of this quiz.') {
      return res.status(403).json({ error: e.message });
    }
    if (e.message === 'Quiz exists but not in trash.' ||
      e.message === 'Name is already taken by another active quiz') {
      return res.status(400).json({ error: e.message });
    }
  }
});

// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

app.use((req: Request, res: Response) => {
  const error = `
    Route not found - This could be because:
      0. You have defined routes below (not above) this middleware in server.ts
      1. You have not implemented the route ${req.method} ${req.path}
      2. There is a typo in either your test or server, e.g. /posts/list in one
         and, incorrectly, /post/list in the other
      3. You are using ts-node (instead of ts-node-dev) to start your server and
         have forgotten to manually restart to load the new changes
      4. You've forgotten a leading slash (/), e.g. you have posts/list instead
         of /posts/list in your server.ts or test file
  `;
  res.status(404).json({ error });
});

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Shutting down server gracefully.');
    process.exit();
  });
});
