// YOU SHOULD MODIFY THIS OBJECT BELOW ONLY
import { QuizState } from './states';

export interface User {
  id: number;
  name: {
    first: string;
    last: string;
  };
  email: string;
  password: string;
  pastPasswords: string[];
  numFailedPasswordsSinceLastLogin: number;
  numSuccessfulLogins: number;
  numQuizzesMade: number;
  sessions: string[];
}

export interface Answer {
  answerId: number;
  answer: string;
  colour: string;
  correct: boolean;
}

export interface QuestionAnswerInformation {
  playerId: number;
  name: string;
  answerTime: number;
  correct: boolean;
  answerIds: number[];
}

export interface Question {
  questionId: number;
  question: string;
  duration: number;
  points: number;
  answers: Answer[];
  // playersCorrectList?: string[];
  // playersIncorrectList?: string[];
  playerAnswerInformation?: QuestionAnswerInformation[];
  timeStarted?: number;
}

export interface Player {
  playerId: number;
  name: string;
  score: number;
  // answers?: { questionId: number, answerIds: number[] }[];
}

export interface Chat {
  messageBody: string;
  playerId: number;
  playerName: string;
  timeSent: number;
}

export interface Quiz {
  authorId: number;
  quizId: number;
  name: string;
  description: string;
  numQuestions: number;
  questions: Question[];
  timeCreated: number;
  timeLastEdited: number;
  duration: number;
  // Iteration 3
  thumbnailUrl?: string;
  activeSessions?: number[];
  inactiveSessions?: number[];
  quizState?: QuizState;
  parentQuizId?: number;
  sessionId?: number;
  autoStartNum?: number;
  players?: Player[];
  atQuestion?: number;
  messages?: Chat[];
}

export interface Trash {
  authorId: number;
  quizId: number;
  name: string;
  description: string;
  numQuestions: number;
  questions: Question[];
  timeCreated: number;
  timeLastEdited: number;
  duration: number;
}
export interface Data {
  users: User[];
  quizzes: Quiz[];
  trash: Quiz[];
}

export interface Token {
  sessionId: string;
}

export interface EmptyObject {}

let data: Data = {
  users: [
    {
      id: 1,
      name: {
        first: 'testUserFirst',
        last: 'testUserLast',
      },
      email: 'test@gmail.com',
      password: 'pwdAsString',
      pastPasswords: ['firstPassword', 'SecondPassword', 'ThirdPassword'],
      numFailedPasswordsSinceLastLogin: 99,
      numSuccessfulLogins: 3,
      numQuizzesMade: 0,
      sessions: ['12345678'],
    },
  ],

  quizzes: [
    {
      authorId: 1,
      quizId: 12345,
      name: 'Test Name',
      description: 'Test description',
      numQuestions: 1,
      questions: [
        {
          questionId: 1234,
          question: 'testQ1',
          duration: 5,
          points: 5,
          answers: [
            {
              answerId: 1234,
              answer: 'ansQ1',
              colour: 'red',
              correct: true,
            }
          ],
        },
      ],
      timeCreated: 1683125870,
      timeLastEdited: 1683125871,
      duration: 10,
    },
  ],

  trash: [
    {
      authorId: 1,
      quizId: 12345,
      name: 'Test Name',
      description: 'Test description',
      numQuestions: 1,
      questions: [
        {
          questionId: 1234,
          question: 'testQ1',
          duration: 5,
          points: 5,
          answers: [
            {
              answerId: 1234,
              answer: 'ansQ1',
              colour: 'red',
              correct: true,
            }
          ],
        },
      ],
      timeCreated: 1683125870,
      timeLastEdited: 1683125871,
      duration: 10,
    },
  ],

};

// YOU SHOULD MODIFY THIS OBJECT ABOVE ONLY

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

import fs from 'fs';

// Use get() to access the data
// Get data reads into memory from dataStore.json
function getData(): Data {
  try {
    data = JSON.parse(fs.readFileSync('dataStore.json', 'utf8'));
  } catch (error) {
    console.log('Error reading dataStore.json');
  }
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: Data): void {
  fs.writeFileSync('dataStore.json', JSON.stringify(newData, null, 2));
  data = newData;
}

export { getData, setData };
