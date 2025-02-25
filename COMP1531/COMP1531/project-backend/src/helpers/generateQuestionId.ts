import { Quiz } from '../dataStore';

export function generateQuestionId(quiz: Quiz) {
  const min: number = 10000000;
  const max: number = 99999999;

  let questionId: number;
  let foundUniqueQuestionId: boolean = false;

  while (!foundUniqueQuestionId) {
    const questionNumber: number = Math.floor(Math.random() * (max - min + 1)) + min;
    questionId = questionNumber;

    foundUniqueQuestionId = !questionIdExists(questionId, quiz);
  }

  return questionId;
}

function questionIdExists(questionId: number, quiz: Quiz): boolean {
  for (const question of quiz.questions) {
    if (question.questionId === questionId) {
      return true;
    }
  }
  return false;
}
