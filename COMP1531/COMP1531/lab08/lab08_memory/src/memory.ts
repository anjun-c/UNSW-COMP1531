/**
/* Note:
/* - You should *not* need use try/catch in this file - your tests should instead expect an error to be thrown.
/* - The use of try/catch is demonstrated in the file src/game.ts
/*
 */
import fs from 'fs';

interface Game {
  score: number;
  mistakesRemaining: number;
  cluesRemaining: number;
  dictionary: string[];
}

const currentGame: Game = {
  score: 0,
  mistakesRemaining: 3,
  cluesRemaining: 3,
  dictionary: [],
};

// returns the current game state
export function getGameInfo() {
  return {
    score: currentGame.score,
    mistakesRemaining: currentGame.mistakesRemaining,
    cluesRemaining: currentGame.cluesRemaining,
  };
}

// adds a word to the dictionary
export function addWord(word: string) {
  // error handling
  if (currentGame.mistakesRemaining <= 0) {
    throw new Error('No mistakes remaining');
  }
  if (currentGame.dictionary.includes(word)) {
    currentGame.mistakesRemaining -= 1;
    throw new Error('Word already exists in dictionary');
  } else {
    // add word to dictionary
    currentGame.score += 1;
    currentGame.dictionary.push(word);
  }
}

// removes a word from the dictionary
export function removeWord(word: string) {
  // error handling
  if (currentGame.mistakesRemaining <= 0) {
    throw new Error('No mistakes remaining');
  }
  if (!currentGame.dictionary.includes(word)) {
    currentGame.mistakesRemaining -= 1;
    throw new Error('Word does not exist in dictionary');
  } else {
    currentGame.score += 1;
    currentGame.dictionary = currentGame.dictionary.filter((w) => w !== word);
  }
}

// returns the dictionary
export function viewDictionary() {
  if (currentGame.cluesRemaining <= 0) {
    throw new Error('No clues remaining');
  }
  currentGame.cluesRemaining -= 1;
  return currentGame.dictionary;
}

// resets the game state to initial state
export function resetGame() {
  currentGame.score = 0;
  currentGame.mistakesRemaining = 3;
  currentGame.cluesRemaining = 3;
  currentGame.dictionary = [];
}

// saves the current game state to a json file
export function saveGame(name: string) {
  if (!name.match(/^[a-z0-9]+$/i)) {
    throw new Error('Name must be alphanumeric');
  }
  const filename = `memory_${name}.json`;
  if (fs.existsSync(filename)) {
    throw new Error(`File '${filename}' already exists`);
  }
  const gameData = JSON.stringify(currentGame, null, 2);
  fs.writeFileSync(filename, gameData);
}

// loads a game state from a json file
export function loadGame(name: string) {
  if (!name.match(/^[a-z0-9]+$/i)) {
    throw new Error('Name must be alphanumeric');
  }
  const filename = `memory_${name}.json`;
  if (!fs.existsSync(filename)) {
    throw new Error(`File '${filename}' does not exist`);
  }
  const gameData = fs.readFileSync(filename, 'utf8');
  Object.assign(currentGame, JSON.parse(gameData));
}
