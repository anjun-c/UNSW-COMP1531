import request, { HttpVerb } from 'sync-request-curl';
import { port, url } from '../config.json';
import { Question, Token } from '../dataStore';
import { quizTrashInfo } from '../features/adminQuizTrashView';
import { QuizActions } from '../states';
import { actionToStr } from '../helpers/stringToEnum';

const SERVER_URL = `${url}:${port}`;

// ========================================================================= //

type jsonBody = Record<string, number> | Record<string, string> | Record<string, Token> | Record<string, Question[]> | Record<string, quizTrashInfo[]> | Record<string, number[]>;

/**
The below interface and requestHelper function were taken from this repository:
https://nw-syd-gitlab.cseunsw.tech/COMP1531/24T2/week5-server-example
 */
export interface RequestHelperReturnType {
  statusCode: number;
  jsonBody?: jsonBody;
  error?: string;
}

const requestHelper = (
  method: HttpVerb,
  path: string,
  payload: object = {},
  headers: Record<string, string> = {}
): RequestHelperReturnType => {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }
  // console.log(`Requesting ${method} ${SERVER_URL + path} with payload:`, payload);
  const res = request(method, SERVER_URL + path, { qs, json, headers, timeout: 20000 });
  const bodyString = res.body.toString();
  let bodyObject: RequestHelperReturnType;
  try {
    // Return if valid JSON, in our own custom format
    bodyObject = {
      jsonBody: JSON.parse(bodyString),
      statusCode: res.statusCode,
    };
  } catch (error) {
    bodyObject = {
      error: `\
Server responded with ${res.statusCode}, but body is not JSON!


GIVEN:
${bodyString}.

REASON:
${error.message}.

HINT:
Did you res.json(undefined)?`,
      statusCode: res.statusCode,
    };
  }
  if ('error' in bodyObject) {
    // Return the error in a custom structure for testing later
    return { statusCode: res.statusCode, error: bodyObject.error };
  }
  return bodyObject;
};

export const httpAdminQuizQuestionsCreate = (token: Token, quizid: number, questionBody: object) => {
  const tokenStr = JSON.stringify(token);
  return requestHelper('POST', `/v1/admin/quiz/${quizid}/question`, { token: tokenStr, questionBody });
};

export const httpClear = () => {
  return requestHelper('DELETE', '/v1/clear');
};

export const httpAdminQuizCreate = (token: Token, name: string, description: string) => {
  const tokenStr = JSON.stringify(token);
  return requestHelper('POST', '/v1/admin/quiz', { token: tokenStr, name, description });
};

export const httpAdminQuizList = (token: Token) => {
  const tokenStr = JSON.stringify(token);
  return requestHelper('GET', '/v1/admin/quiz/list', { token: tokenStr });
};

export const httpAdminUserPasswordUpdate = (token: Token, oldPassword: string, newPassword: string) => {
  return requestHelper('PUT', '/v1/admin/user/password', { token, oldPassword, newPassword });
};

export const httpAdminAuthRegister = (email: string, password: string, nameFirst: string, nameLast: string) => {
  return requestHelper('POST', '/v1/admin/auth/register', { email, password, nameFirst, nameLast });
};

export const httpAdminAuthLogin = (email: string, password: string) => {
  return requestHelper('POST', '/v1/admin/auth/login', { email, password });
};

export const httpQuizDescriptionUpdate = (token: Token, quizId: number, description: string) => {
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/description`, { token, description });
};

export const httpQuizNameUpdate = (token: Token, quizId: number, name: string) => {
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/name`, { token, name });
};

export const httpAdminAuthLogout = (token: Token) => {
  const tokenStr = JSON.stringify(token);
  return requestHelper('POST', '/v1/admin/auth/logout', { token: tokenStr });
};

export const httpAdminQuizInfo = (token: Token, quizid: number) => {
  const tokenStr = JSON.stringify(token);
  return requestHelper('GET', `/v1/admin/quiz/${quizid}`, { token: tokenStr });
};

export const httpAdminQuizRemove = (token: Token, quizid: number) => {
  const tokenStr = JSON.stringify(token);
  return requestHelper('DELETE', `/v1/admin/quiz/${quizid}`, { token: tokenStr });
};

export const httpAdminUserDetails = (token: Token) => {
  const tokenStr = JSON.stringify(token);
  return requestHelper('GET', '/v1/admin/user/details', { token: tokenStr });
};

export const httpAdminUserDetailsUpdate = (token: Token, email: string, nameFirst: string, nameLast: string) => {
  const tokenStr = JSON.stringify(token);
  return requestHelper('PUT', '/v1/admin/user/details', { token: tokenStr, email, nameFirst, nameLast });
};

export const httpAdminQuizQuestionMove = (quizId: number, questionId: number, token: Token, newPosition: number) => {
  const tokenStr = JSON.stringify(token);
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/question/${questionId}/move`, { token: tokenStr, newPosition });
};

export const httpAdminQuizQuestionDuplicate = (quizId: number, questionId: number, token: Token) => {
  const tokenStr = JSON.stringify(token);
  return requestHelper('POST', `/v1/admin/quiz/${quizId}/question/${questionId}/duplicate`, { token: tokenStr });
};

export const httpAdminQuizTransfer = (quizid: number, token: Token, userEmail: string) => {
  const tokenStr = JSON.stringify(token);
  return requestHelper('POST', `/v1/admin/quiz/${quizid}/transfer`, { token: tokenStr, userEmail });
};

export const httpAdminQuizQuestionDelete = (token: Token, quizid: number, questionid: number) => {
  const tokenStr = JSON.stringify(token);
  return requestHelper('DELETE', `/v1/admin/quiz/${quizid}/question/${questionid}`, { token: tokenStr });
};

export const httpAdminQuizRestore = (token: Token, quizid: number) => {
  const tokenStr = JSON.stringify(token);
  return requestHelper('POST', `/v1/admin/quiz/${quizid}/restore`, { token: tokenStr });
};

export const httpAdminQuizTrashEmpty = (token: Token, quizIds: string) => {
  const tokenStr = JSON.stringify(token);
  return requestHelper('DELETE', '/v1/admin/quiz/trash/empty', { token: tokenStr, quizIds });
};

export const httpAdminQuizQuestionUpdate = (token: Token, quizid: number, questionid: number, questionBodyObject: object) => {
  const questionBody = questionBodyObject;
  const tokenStr = JSON.stringify(token);
  return requestHelper('PUT', `/v1/admin/quiz/${quizid}/question/${questionid}`, { token: tokenStr, questionBody: questionBody });
};

export const httpAdminQuizTrashView = (token: Token) => {
  const tokenStr = JSON.stringify(token);
  return requestHelper('GET', '/v1/admin/quiz/trash', { token: tokenStr });
};

// ====================================================================
// ============ ITERATION 3 AND V2 HELPERS BELOW THIS LINE ============
// ====================================================================

export const httpAdminQuizThumbnail = (token: Token, quizId: number, imgUrl: string) => {
  const tokenStr = JSON.stringify(token);
  const headers = { token: tokenStr };
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/thumbnail`, { imgUrl }, headers);
};

export const httpAdminQuizSessionStart = (token: Token, quizId: number, autoStartNum: number) => {
  const tokenStr = JSON.stringify(token);
  const headers = { token: tokenStr };
  return requestHelper('POST', `/v1/admin/quiz/${quizId}/session/start`, { autoStartNum }, headers);
};

export const httpPlayerJoinSession = (sessionId: number, name: string) => {
  return requestHelper('POST', '/v1/player/join', { sessionId, name });
};

export const httpPlayerGetStatus = (playerId: number) => {
  return requestHelper('GET', `/v1/player/${playerId}`, {});
};

export const httpPlayerGetQuestionInfo = (playerId: number, questionPosition: number) => {
  return requestHelper('GET', `/v1/player/${playerId}/question/${questionPosition}`, {});
};

export const httpPlayerSubmitAnswers = (playerId: number, questionPosition: number, answerIds: number[]) => {
  return requestHelper('PUT', `/v1/player/${playerId}/question/${questionPosition}/answer`, { answerIds });
};

export const httpAdminQuizSessionsView = (token: Token, quizId: number) => {
  const tokenStr = JSON.stringify(token);
  const headers = { token: tokenStr };
  return requestHelper('GET', `/v1/admin/quiz/${quizId}/sessions`, {}, headers);
};

export const httpAdminQuizQuestionUpdateV2 = (token: Token, quizid: number, questionid: number, questionBodyObject: object) => {
  const questionBody = questionBodyObject;
  const tokenStr = JSON.stringify(token);
  const headers = { token: tokenStr };
  return requestHelper('PUT', `/v2/admin/quiz/${quizid}/question/${questionid}`, { questionBody: questionBody }, headers);
};

export const httpAdminQuizQuestionsCreateV2 = (token: Token, quizid: number, questionBody: object) => {
  const tokenStr = JSON.stringify(token);
  const headers = { token: tokenStr };
  return requestHelper('POST', `/v2/admin/quiz/${quizid}/question`, { questionBody }, headers);
};

export const httpAdminQuizCreateV2 = (token: Token, name: string, description: string) => {
  const tokenStr = JSON.stringify(token);
  const headers = { token: tokenStr };
  return requestHelper('POST', '/v2/admin/quiz', { name, description }, headers);
};

// I am unsure of this route, as this route was the only one i found thus far that originally (V1) took in token instead of
// { token: tokenStr }
// This will likely need to be changed, i took a random guess as a placeholder
// - Oliver
export const httpAdminUserPasswordUpdateV2 = (token: Token, oldPassword: string, newPassword: string) => {
  const tokenStr = token.sessionId;
  const headers = { token: tokenStr };
  return requestHelper('PUT', '/v2/admin/user/password', { oldPassword, newPassword }, headers);
};

export const httpAdminAuthLogoutV2 = (token: Token) => {
  const tokenStr = JSON.stringify(token);
  const headers = { token: tokenStr };
  // If there is an error relating to this, it may be due to the fact that the body here now becomes empty as token
  // is moved to header and im not sure if i should entirely delete the body or leave it as an empty object, currently an
  // empty object but keep it in mind when debugging around here, use the old version of this route as reference
  // honestly i think I should delete it but I feel like when debugging its easier for someone else to delete an empty object
  // than remember to add it
  return requestHelper('POST', '/v2/admin/auth/logout', {}, headers);
};

export const httpAdminQuizTrashViewV2 = (token: Token) => {
  const tokenStr = JSON.stringify(token);
  const headers = { token: tokenStr };
  // note that this route has the exact same *potential* issue as the previous and im too tired to decide whats correct - tis someone elses problem
  return requestHelper('GET', '/v2/admin/quiz/trash', {}, headers);
};

export const httpAdminQuizInfoV2 = (token: Token, quizid: number) => {
  const tokenStr = JSON.stringify(token);
  const headers = { token: tokenStr };
  // surprise! same potential issue!
  return requestHelper('GET', `/v2/admin/quiz/${quizid}`, {}, headers);
};

export const httpAdminQuizRemoveV2 = (token: Token, quizid: number) => {
  const tokenStr = JSON.stringify(token);
  const headers = { token: tokenStr };
  // not even giving a nice comment atp - same potential issue
  return requestHelper('DELETE', `/v2/admin/quiz/${quizid}`, {}, headers);
};

export const httpAdminQuizTrashEmptyV2 = (token: Token, quizIds: string) => {
  const tokenStr = JSON.stringify(token);
  const headers = { token: tokenStr };
  return requestHelper('DELETE', '/v2/admin/quiz/trash/empty', { quizIds }, headers);
};

export const httpAdminUserDetailsV2 = (token: Token) => {
  const tokenStr = JSON.stringify(token);
  const headers = { token: tokenStr };
  // same thing cuh
  return requestHelper('GET', '/v2/admin/user/details', {}, headers);
};

export const httpAdminUserDetailsUpdateV2 = (token: Token, email: string, nameFirst: string, nameLast: string) => {
  const tokenStr = JSON.stringify(token);
  const headers = { token: tokenStr };
  return requestHelper('PUT', '/v2/admin/user/details', { email, nameFirst, nameLast }, headers);
};

export const httpAdminQuizQuestionMoveV2 = (quizId: number, questionId: number, token: Token, newPosition: number) => {
  const tokenStr = JSON.stringify(token);
  const headers = { token: tokenStr };
  return requestHelper('PUT', `/v2/admin/quiz/${quizId}/question/${questionId}/move`, { newPosition }, headers);
};

export const httpAdminQuizQuestionDuplicateV2 = (quizId: number, questionId: number, token: Token) => {
  const tokenStr = JSON.stringify(token);
  const headers = { token: tokenStr };
  // RAAAAH SAME POTENTIAL ISSUE
  return requestHelper('POST', `/v2/admin/quiz/${quizId}/question/${questionId}/duplicate`, {}, headers);
};

export const httpAdminQuizTransferV2 = (quizid: number, token: Token, userEmail: string) => {
  const tokenStr = JSON.stringify(token);
  const headers = { token: tokenStr };
  return requestHelper('POST', `/v2/admin/quiz/${quizid}/transfer`, { userEmail }, headers);
};

// if there is an issue here, see the comment above httpAdminUserPasswordUpdateV2
// essentially see how this v1 route differs to other v1 routes
export const httpAdminQuizNameUpdateV2 = (token: Token, quizId: number, name: string) => {
  const tokenStr = token.sessionId;
  const headers = { token: tokenStr };
  return requestHelper('PUT', `/v2/admin/quiz/${quizId}/name`, { name }, headers);
};

// if there is an issue here, see the comment above httpAdminUserPasswordUpdateV2
// essentially see how this v1 route differs to other v1 routes
export const httpAdminQuizDescriptionUpdateV2 = (token: Token, quizId: number, description: string) => {
  const tokenStr = token.sessionId;
  const headers = { token: tokenStr };
  return requestHelper('PUT', `/v2/admin/quiz/${quizId}/description`, { description }, headers);
};

export const httpAdminQuizQuestionDeleteV2 = (token: Token, quizid: number, questionid: number) => {
  const tokenStr = JSON.stringify(token);
  const headers = { token: tokenStr };
  // standard potential empty body object problem
  return requestHelper('DELETE', `/v2/admin/quiz/${quizid}/question/${questionid}`, {}, headers);
};

export const httpAdminQuizRestoreV2 = (token: Token, quizid: number) => {
  const tokenStr = JSON.stringify(token);
  const headers = { token: tokenStr };
  // standard potential empty body object problem
  return requestHelper('POST', `/v2/admin/quiz/${quizid}/restore`, {}, headers);
};

export const httpPlayerChatSend = (playerId: number, message: string) => {
  return requestHelper('POST', `/v1/player/${playerId}/chat`, { message });
};

export const httpPlayerChatView = (playerId: number) => {
  return requestHelper('GET', `/v1/player/${playerId}/chat`, {});
};

export const httpAdminQuizSessionUpdate = (token: Token, quizId: number, sessionid: number, action: QuizActions) => {
  const tokenStr = JSON.stringify(token);
  const headers = { token: tokenStr };
  const actionStr = actionToStr(action);
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/session/${sessionid}`, { action: actionStr }, headers);
};

export const httpAdminQuizSessionGetStatus = (token: Token, quizId: number, sessionid: number) => {
  const tokenStr = JSON.stringify(token);
  const headers = { token: tokenStr };
  return requestHelper('GET', `/v1/admin/quiz/${quizId}/session/${sessionid}`, { }, headers);
};

export const httpPlayerQuizQuestionResult = (playerId: number, questionposition: number) => {
  return requestHelper('GET', `/v1/player/${playerId}/question/${questionposition}/results`, {});
};

export const httpPlayerSessionFinalResult = (playerId: number) => {
  return requestHelper('GET', `/v1/player/${playerId}/results`, {});
}
