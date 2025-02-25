import fs from 'fs';

import {
  getGameInfo,
  addWord,
  removeWord,
  viewDictionary,
  resetGame,
  loadGame,
  saveGame,
} from './memory';

const PRINT_DELETED_FILENAME_FOR_DEBUGGING = true;

// Helper function to remove all memory_[NAME].json files in
// the current directory.
function removeSavedGames() {
  fs.readdirSync('./')
    .filter(file => /^memory_[a-zA-Z0-9]+\.json$/.test(file))
    .forEach(file => {
      if (PRINT_DELETED_FILENAME_FOR_DEBUGGING) {
        console.log(`REMOVING FILE: ${file}`);
      }
      fs.unlinkSync('./' + file);
    });
}

function clear() {
  removeSavedGames();
  resetGame();
}

beforeAll(() => {
  clear();
});

afterEach(() => {
  clear();
});

describe('addWord', () => {
  test('adding the same word twice', () => {
    expect(() => addWord('hello')).not.toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);
  });

  test('successfully adds a new word', () => {
    expect(() => addWord('hello')).not.toThrow();
    const dictionary = viewDictionary();
    expect(dictionary).toContain('hello');
  });

  test('throws error when game is inactive', () => {
    addWord('test');
    for (let i = 0; i < 3; i++) {
      expect(() => addWord('test')).toThrow(Error);
    }
    expect(() => addWord('test')).toThrow(Error);
  });
});

describe('removeWord', () => {
  test('No such word', () => {
    expect(() => removeWord('hello')).toThrow(Error);
  });

  test('Double remove', () => {
    addWord('hello');
    expect(() => removeWord('hello')).not.toThrow(Error);
    expect(() => removeWord('hello')).toThrow(Error);
  });

  test('successfully removes an existing word', () => {
    addWord('hello');
    expect(() => removeWord('hello')).not.toThrow();
    const dictionary = viewDictionary();
    expect(dictionary).not.toContain('hello');
  });

  test('throws error when game is inactive', () => {
    resetGame();
    addWord('test');
    for (let i = 0; i < 3; i++) {
      expect(() => addWord('test')).toThrow(Error);
    }
    expect(() => removeWord('test')).toThrow(Error);
  });
});

// TODO: your other tests here
describe('getGameInfo', () => {
  test('returns correct initial game info', () => {
    const info = getGameInfo();
    expect(info).toEqual({
      score: 0,
      mistakesRemaining: 3,
      cluesRemaining: 3
    });
  });

  test('returns correct game info after some actions', () => {
    addWord('word1');
    addWord('word2');
    removeWord('word1');
    viewDictionary();
    const info = getGameInfo();
    expect(info).toEqual({
      score: 3,
      mistakesRemaining: 3,
      cluesRemaining: 2
    });
  });
});

describe('viewDictionary', () => {
  test('successfully views dictionary when clues are available', () => {
    addWord('word1');
    addWord('word2');
    const dictionary = viewDictionary();
    expect(dictionary).toEqual(['word1', 'word2']);
  });

  test('throws error when no clues are remaining', () => {
    for (let i = 0; i < 3; i++) {
      viewDictionary();
    }
    expect(() => viewDictionary()).toThrow(Error);
  });

  test('does not throw error when game is inactive', () => {
    addWord('word1');
    addWord('word2');
    const dictionary = viewDictionary();
    for (let i = 0; i < 3; i++) {
      expect(() => addWord('word1')).toThrow(Error);
    }
    expect(dictionary).toEqual(['word1', 'word2']);
  });
});

describe('resetGame', () => {
  test('resets the game to initial state', () => {
    addWord('word1');
    addWord('word2');
    removeWord('word1');
    resetGame();
    const info = getGameInfo();
    expect(info).toEqual({
      score: 0,
      mistakesRemaining: 3,
      cluesRemaining: 3
    });
    const dictionary = viewDictionary();
    expect(dictionary).toEqual([]);
  });
});

describe('saveGame', () => {
  test('successfully saves a new game', () => {
    addWord('word1');
    saveGame('testgame');
    const savedFile = 'memory_testgame.json';
    expect(fs.existsSync(savedFile)).toBe(true);
    const savedGame = JSON.parse(fs.readFileSync(savedFile, 'utf8'));
    expect(savedGame).toEqual({
      score: 1,
      mistakesRemaining: 3,
      cluesRemaining: 3,
      dictionary: ['word1']
    });
  });

  test('throws error when saving with an invalid name', () => {
    expect(() => saveGame('')).toThrow(Error);
    expect(() => saveGame('test*name')).toThrow(Error);
    saveGame('validname');
    expect(() => saveGame('validname')).toThrow(Error);
  });
});

describe('loadGame', () => {
  test('successfully loads a saved game', () => {
    addWord('word1');
    saveGame('loadtest');
    resetGame();
    loadGame('loadtest');
    const info = getGameInfo();
    expect(info).toEqual({
      score: 1,
      mistakesRemaining: 3,
      cluesRemaining: 3
    });
    const dictionary = viewDictionary();
    expect(dictionary).toEqual(['word1']);
  });

  test('throws error when loading a non-existent game', () => {
    expect(() => loadGame('nonexistent')).toThrow(Error);
  });

  test('throws error when loading with an invalid name', () => {
    expect(() => loadGame('')).toThrow(Error);
    expect(() => loadGame('test*name')).toThrow(Error);
  });
});
