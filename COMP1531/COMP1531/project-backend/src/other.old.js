import { setData } from './dataStore.ts';

// Reset state of application back to start
function clear () {
  setData({
    users: [],
    quizzes: [],
  });
}

export { clear };
