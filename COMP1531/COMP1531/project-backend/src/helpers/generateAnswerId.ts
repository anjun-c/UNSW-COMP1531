import { Answer } from '../dataStore';

export interface questionBody {
    question: string,
    duration: number,
    points: number,
    answers: Answer[];
    thumbnailUrl?: string;
  }

export function generateAnswerId(questionBodyObject: questionBody) {
  const min: number = 10000000;
  const max: number = 99999999;

  let answerId: number;
  let foundUniqueAnswerId: boolean = false;

  while (!foundUniqueAnswerId) {
    const answerNumber: number = Math.floor(Math.random() * (max - min + 1)) + min;
    answerId = answerNumber;

    foundUniqueAnswerId = !answerIdExists(answerId, questionBodyObject);
  }

  return answerId;
}

function answerIdExists(answerId: number, questionBodyObject: questionBody): boolean {
  for (const answer of questionBodyObject.answers) {
    if (answer.answerId === answerId) {
      return true;
    }
  }
  return false;
}
