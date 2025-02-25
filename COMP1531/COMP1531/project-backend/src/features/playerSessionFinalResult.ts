import { sortAndDeduplicateDiagnostics } from 'typescript';
import { playerQuizQuestionResultResponse } from './playerQuizQuestionResult';
import { getData } from '../dataStore';
import { QuizState } from '../states';

export interface playerSessionFinalResult {
    usersRankedByScore: {
        name: string;
        score: number;
    }[],
    questionResults: {
        questionId: number;
        playersCorrectList: string[];
        averageAnswerTime: number;
        percentCorrect: number;
    }[] | playerQuizQuestionResultResponse[]
}

interface finalResultHelperResponse {
  questionId?: number;
  playerCorrectList?: string[];
  averageAnswerTime?: number;
  percentCorrect?: number;
}

export const playerSessionFinalResult = (playerId: number): playerSessionFinalResult => {
  const data = getData();
  let player, currentQuiz;
  for (const quiz of data.quizzes) {
    if (!quiz.players) {
      continue;
    } else {
      player = quiz.players.find(p => p.playerId === playerId);
      if (player) {
        currentQuiz = quiz;
        break;
      }
    }
  }
  if (!player) {
    throw new Error('Player ID does not exist');
  }
  const currentState = currentQuiz.quizState;
  if (currentState !== QuizState.FINAL_RESULTS) {
    throw new Error('Session is not in FINAL_RESULTS state');
  }
  
  let scoreArray = currentQuiz.players.map(p => { return { name: p.name, score: p.score }; });
  let questionResults = [];
  let j = 1;
  for (const question of currentQuiz.questions) {
    console.log('')
    questionResults.push(finalResultHelper(playerId, j));
    console.log('im going to crash tf outtttttttttttttttttttttttt');
    let infoArray = question.playerAnswerInformation
    .filter(info => info.correct)
    .sort((a, b) => a.answerTime - b.answerTime);
    for (let i = 0; i < infoArray.length; i++) {
      console.log('what is going onnnnnnnnnnnnnnnn');
      if (infoArray[i].name) {
      scoreArray.find(p => p.name === infoArray[i].name).score += question.points * 1/(i + 1);
      }
    }
    console.log('bruh whattttttttttttttttttttttttttttt');
    j++;
  }
  console.log('i still have 2521111111111111111111111111');
  console.log(scoreArray);
  scoreArray = scoreArray.sort((a, b) => b.score - a.score);

  return {
    usersRankedByScore: scoreArray,
    questionResults: questionResults
  };
};

export const finalResultHelper = (playerId: number,
questionposition: number):
finalResultHelperResponse => {
  const data = getData();
  let player, currentQuiz;
  for (const quiz of data.quizzes) {
    if (!quiz.players) {
      continue;
    } else {
      player = quiz.players.find(p => p.playerId === playerId);
      if (player) {
        currentQuiz = quiz;
        break;
      }
    }
  }

  const question = currentQuiz.questions[questionposition - 1];
  let averageAnswerTime: number = 0; let percentCorrect: number = 0; const playerCorrectList: string[] = [];
  for (const qInfo of question.playerAnswerInformation) {
    averageAnswerTime += qInfo.answerTime;
    if (qInfo.correct) {
      playerCorrectList.push(qInfo.name);
      percentCorrect++;
    }
  }

  averageAnswerTime = averageAnswerTime / question.playerAnswerInformation.length;
  percentCorrect = (percentCorrect / question.playerAnswerInformation.length) * 100;
  percentCorrect = Math.round(percentCorrect);
  console.log('helper sendssssssssssssssssssssssssssssssssssssss');
  return {
    questionId: question.questionId,
    playerCorrectList: playerCorrectList,
    averageAnswerTime: averageAnswerTime,
    percentCorrect: percentCorrect,
  };
};

