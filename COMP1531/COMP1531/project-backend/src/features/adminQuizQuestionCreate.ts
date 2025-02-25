import { Answer, Quiz, setData, Token } from '../dataStore';
import { getData } from '../dataStore';
import { adminUserDetails } from './adminUserDetails';
import { checkUserQuizValidity } from '../helpers/checkUserQuizValidity';
import { generateQuestionId } from '../helpers/generateQuestionId';
import { generateAnswerId } from '../helpers/generateAnswerId';
export interface adminQuizQuestionCreateResponse {
    error?: string;
    questionId?: number;
}

export interface questionBody {
  question: string,
  duration: number,
  points: number,
  answers: Answer[];
  thumbnailUrl?: string;
}

export function adminQuizQuestionCreate(token: Token, quizid: number, questionBodyObject: questionBody): adminQuizQuestionCreateResponse {
  // console.log("(adminquizQuestionCreate) Hard enter");
  // console.log('(adminquizQuestionCreate) questionBodyObject: ', questionBodyObject);
  const data = getData();
  const quiz:Quiz = data.quizzes.find(quiz => quiz.quizId === quizid);

  // Checks if user exists
  const userDetails = adminUserDetails(token);
  if ('error' in userDetails) {
    // return { error: userDetails.error.toString() + ' Code: 401' };
    throw new Error(userDetails.error);
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

  let sumDuration: number = 0;
  for (const question of quiz.questions) {
    sumDuration += question.duration;
  }
  if (sumDuration + questionBodyObject.duration > 180) {
    // return { error: 'Duration too long. Code: 400' };
    throw new Error('Duration too long.');
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
      break;
    }
  }

  for (const answer of questionBodyObject.answers) {
    answer.answerId = generateAnswerId(questionBodyObject);
  }

  let i = 0;
  for (const answer of questionBodyObject.answers) {
    if (i === 0) {
      answer.colour = 'red';
    } else if (i === 1) {
      answer.colour = 'blue';
    } else if (i === 2) {
      answer.colour = 'yellow';
    } else if (i === 3) {
      answer.colour = 'green';
    } else if (i === 4) {
      answer.colour = 'purple';
    } else {
      answer.colour = 'pink';
    }
    i++;
  }

  if (correctAnswer) {
  // Create question
    const questionId = generateQuestionId(quiz);
    quiz.questions.push({
      questionId: questionId,
      question: questionBodyObject.question,
      duration: questionBodyObject.duration,
      points: questionBodyObject.points,
      answers: questionBodyObject.answers,
    });
    quiz.timeLastEdited = Date.now();
    quiz.numQuestions += 1;
    quiz.duration += questionBodyObject.duration;

    setData(data);
    return { questionId };
  }
  // return { error: 'No correct answer. Code: 400' };
  throw new Error('No correct answer.');
}
