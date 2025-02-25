import { setData } from '../dataStore';

// Reset state of application back to start
function clear (): void {
  setData({
    users: [],
    quizzes: [],
    trash: []
  });
}

export { clear };
