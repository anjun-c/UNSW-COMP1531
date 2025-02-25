export enum Objection {
  /**
  * By default, enum are integers 0, 1, 2, ...
  * However, we can also give them string values
  */
  ARGUMENTATIVE = 'argumentative',
  COMPOUND = 'compound',
  HEARSAY = 'hearsay',
  LEADING = 'leading',
  NON_RESPONSIVE = 'non-responsive',
  RELEVANCE = 'relevance',
  SPECULATION = 'speculation',
}

export enum ExaminationType {
  /**
    * It is also possible to specify a "start" number.
    *
    * Below would assign CROSS = 1, DIRECT = 2, the next
    * would be 3, etc.
    */
  CROSS = 1,
  DIRECT,
}

// Helper function - feel free to remove / modify.
function isArgumentative(question: string) {
  return !question.endsWith('?');
}

/**
 * Feel free to modify the function below as you see fit,
 * so long as you satisfy the specification.
 */
export function getObjections(
  question: string,
  testimony: string,
  examinationType: ExaminationType
): Set<Objection> {
  // error handling
  if (question === '' || testimony === '') {
    throw new Error('Question or testimony cannot be empty');
  }

  // convert to lowercase
  question = question.toLowerCase();
  testimony = testimony.toLowerCase();

  // create a set to store objections
  const objections = new Set<Objection>();

  // check for objections based on the examination type
  if (examinationType === ExaminationType.CROSS) {
    if (isArgumentative(question)) {
      objections.add(Objection.ARGUMENTATIVE);
    }
    if (question.includes('think')) {
      objections.add(Objection.SPECULATION);
    }
  } else if (examinationType === ExaminationType.DIRECT) {
    if (question.startsWith('why did you') || question.startsWith('do you agree') ||
    question.endsWith('right?') || question.endsWith('correct?')) {
      objections.add(Objection.LEADING);
    }
    if (testimony.includes('think')) {
      objections.add(Objection.SPECULATION);
    }
  }

  // checks for the number of question marks
  const questionMarkCount = question.split('').filter((char) => char === '?').length;
  if (questionMarkCount > 1) {
    objections.add(Objection.COMPOUND);
  }

  // check for hearsay
  if (testimony.includes('heard from') || testimony.includes('told me')) {
    objections.add(Objection.HEARSAY);
  }

  // check for non-responsive
  // remove all non-alphanumeric characters and split by spaces
  const normalizedQuestion = question.toLowerCase().replace(/[^a-z0-9\s]/gi, '');
  const normalizedTestimony = testimony.toLowerCase().replace(/[^a-z0-9\s]/gi, '');
  const questionWords = normalizedQuestion.split(/\s+/).filter(word => word.length > 0);
  // create a set of words in the testimony
  const testimonyWords = new Set(normalizedTestimony.split(/\s+/).filter(word => word.length > 0));
  // check if all words in the question are not in the testimony
  const isNonResponsive = questionWords.every(word => !testimonyWords.has(word));
  // add non-responsive objection if applicable
  if (isNonResponsive) {
    objections.add(Objection.NON_RESPONSIVE);
  }
  if (testimony.length > 2 * question.length) {
    objections.add(Objection.RELEVANCE);
  }

  return objections;
}
