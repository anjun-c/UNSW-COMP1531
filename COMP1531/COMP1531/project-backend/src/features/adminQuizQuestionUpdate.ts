import { Token, getData, setData } from '../dataStore';
import { questionBody } from './adminQuizQuestionCreate';
import { checkUserQuizValidity } from '../helpers/checkUserQuizValidity';
import { checkValidUser } from '../helpers/checkValidUser';

interface adminQuizQuestionUpdateResponse {}

export function adminQuizQuestionUpdate(token: Token, quizid: number, quiestionId: number, questionBodyObject: questionBody): adminQuizQuestionUpdateResponse {
  const data = getData();
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizid);
  // console.log('in quizQuestion Update. Here are my params token:', token);
  // console.log('in quizQuestion Update. Here are my params token type:', typeof (token));
  // console.log('in quizQuestion Update. Here are my param quizId:', quizid);
  // console.log('in quizQuestion Update. Here are my param quiestionId:', quiestionId);
  // console.log('in quizQuestion Update. Here are my param questionBodyObject:', questionBodyObject);
  // console.log('in quizQuestion Update. Here are my param questionBodyObject type: ', typeof (questionBodyObject));

  // Checks if user exists
  if (!checkValidUser(token)) {
    // return { error: userDetails.error.toString() + ' Code: 401' };
    throw new Error('Token is empty or invalid.');
  }
  // const userId: number = userDetails.user.userId;
  // const user = data.users.find(user => user.id === userId); // gets the user object

  // Check for ownership of quiz
  if ('error' in checkUserQuizValidity(token, quizid)) {
    // return { error: 'QuizId is not a valid quiz. Code: 403' };
    throw new Error('User is not owner of this quiz or quiz does not exist.');
  }

  if (!quiz) {
    // return { error: 'QuizId is not a valid quiz. Code: 400 ' };
    throw new Error('QuizId is not a valid quiz.');
  }

  if (questionBodyObject.answers.length > 6) {
    // return { error: 'Too many answers. Code: 400' };
    throw new Error('Too many answers.');
  }

  if (questionBodyObject.answers.length < 2) {
    // return { error: 'Too few answers. Code: 400' };
    throw new Error('Too few answers.');
  }

  if (questionBodyObject.question.length < 5) {
    // return { error: 'Question too short. Code: 400' };
    throw new Error('Question too short.');
  }

  if (questionBodyObject.question.length > 50) {
    // return { error: 'Question too long. Code: 400' };
    throw new Error('Question too long.');
  }

  if (questionBodyObject.points < 1) {
    // return { error: 'Points too low. Code: 400' };
    throw new Error('Points too low.');
  }

  if (questionBodyObject.points > 10) {
    // return { error: 'Points too high. Code: 400' };
    throw new Error('Points too high.');
  }

  if (questionBodyObject.duration < 1) {
    // return { error: 'Duration too short. Code: 400' };
    throw new Error('Duration too short.');
  }

  if (questionBodyObject.duration > 10) {
    // return { error: 'Duration too long. Code: 400' };
    throw new Error('Duration too long.');
  }

  // Checks for any answers which are under 1 character or over 30
  for (const answer of questionBodyObject.answers) {
    if (answer.answer.length < 1) {
      // return { error: 'Answer too short. Code: 400' };
      throw new Error('Answer too short.');
    }

    if (answer.answer.length > 30) {
      // return { error: 'Answer too long. Code: 400' };
      throw new Error('Answer too long.');
    }
  }

  if (questionBodyObject.thumbnailUrl) {
    if (questionBodyObject.thumbnailUrl === '') {
      throw new Error('Thumbnail URL is empty.');
    }

    const validFileTypes = ['jpg', 'jpeg', 'png'];
    const thumbnailUrlLowerCase = questionBodyObject.thumbnailUrl.toLowerCase();
    const fileTypeValid = validFileTypes.some(fileType => thumbnailUrlLowerCase.endsWith(fileType));
    if (!fileTypeValid) {
      throw new Error('Invalid thumbnail file type.');
    }

    const urlLowerCase = questionBodyObject.thumbnailUrl.toLowerCase();
    if (!urlLowerCase.startsWith('http://') && !urlLowerCase.startsWith('https://')) {
      throw new Error('Invalid thumbnail URL format.');
    }
  }

  const selectedQuestion = quiz.questions.find(question => question.questionId === quiestionId);
  let sumDuration: number = 0;
  for (const q of quiz.questions) {
    sumDuration += q.duration;
  }
  if ((sumDuration + questionBodyObject.duration - selectedQuestion.duration) > 180) {
    // return { error: 'Sum of duration too long. Code: 400' };
    throw new Error('Sum of duration too long.');
  }

  // Checks for duplicate answers
  const answerSet = new Set();
  for (const answer of questionBodyObject.answers) {
    if (answerSet.has(answer.answer)) {
      // return { error: 'Duplicate answers. Code: 400' };
      throw new Error('Duplicate answers.');
    }
    answerSet.add(answer.answer);
  }

  // Check for if there is a correct answer
  let correctAnswer = false;
  for (const answer of questionBodyObject.answers) {
    if (answer.correct === true) {
      correctAnswer = true;
    }
  }

  if (correctAnswer) {
    // Get question from id
    if (!selectedQuestion) {
      // return { error: 'QuestionId is not a valid question. Code: 400' };
      throw new Error('QuestionId is not a valid question.');
    }
    selectedQuestion.question = questionBodyObject.question;
    selectedQuestion.duration = questionBodyObject.duration;
    selectedQuestion.points = questionBodyObject.points;
    selectedQuestion.answers = questionBodyObject.answers;
    quiz.timeLastEdited = Date.now();
    setData(data);
    return {};
  }
  // return { error: 'No correct answer. Code: 400' };
  throw new Error('No correct answer.');
}
