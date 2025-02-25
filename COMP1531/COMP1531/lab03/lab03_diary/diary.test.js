


// Notice how we are only importing the functions listed from the specification, and not
// our underlying "diary" object. To keep our tests black-box, we must only test the
// known input and output that are explicitly specified (no more, no less).

import {
  addDiaryEntry,
  clear,
  editDiaryEntry,
  listDiaryEntries,
  searchDiary,
  viewDiaryEntry
} from './diary';

beforeEach(() => {
  // Reset the state of our data so that each tests can run independently
  clear();
});

describe('clear', () => {
  test('has the correct return type, {}', () => {
    expect(clear()).toStrictEqual({});
  });
});

describe('addDiaryEntry', () => {
  test('has the correct return type', () => {
    const e = addDiaryEntry('Day 1', 'I worked on the adddDiaryEntry function');
    expect(e).toStrictEqual({ entryId: expect.any(Number) });
  });

  test('can add two entries with the same title and content', () => {
    const e1 = addDiaryEntry('Day 1', 'I worked on the adddDiaryEntry function');
    const e2 = addDiaryEntry('Day 1', 'I worked on the adddDiaryEntry function');
    expect(e2).toStrictEqual({ entryId: expect.any(Number)} )

    // The two diary entries should have two different IDs
    expect(e1.entryId).not.toStrictEqual(e2.entryId);
  });

  test.each([
    { title: '', content: 'valid' },
    { title: 'valid', content: '' },
    { title: '', content: '' },
  ])('returns an error for title=$title and content=$content', ({ title, content }) => {
    expect(addDiaryEntry(title, content)).toStrictEqual({ error: expect.any(String) });
  });
});

describe('viewDiary', () => {
  test('returns an error for a non-existent entry id', () => {
    expect(viewDiaryEntry(1)).toStrictEqual({ error: expect.any(String) });
  });

  describe('when one diary is created', () => {
    let entry;
    beforeEach(() => {
      entry = addDiaryEntry('Day 1', 'One day');
    });

    test('view diary with invalid id', () => {
      expect(viewDiaryEntry(entry.entryId + 1)).toStrictEqual({ error: expect.any(String) });
    });

    test('the correct details are returned', () => {
      expect(viewDiaryEntry(entry.entryId)).toStrictEqual({
        entry: {
          entryId: entry.entryId,
          title: 'Day 1',
          content: 'One day',
          timestamp: expect.any(Number),
        }
      });
    });
  });

  // Remove the todo and complete this test, or simply remove it and write other
  // test cases as you see fit.
  // test.todo('can view multiple diary entries correctly');
  test('can view multiple diary entries correctly', () => {
    let entry1 = addDiaryEntry('Day 1', 'one day');
    let entry2 = addDiaryEntry('Day 2', 'two days');
    let entry3 = addDiaryEntry('Day 3', 'three days');
    expect(viewDiaryEntry(entry1.entryId)).toStrictEqual({
      entry: {
        entryId: entry1.entryId,
        title: 'Day 1',
        content: 'one day',
        timestamp: expect.any(Number),
      }
    });
    expect(viewDiaryEntry(entry2.entryId)).toStrictEqual({
      entry: {
        entryId: entry2.entryId,
        title: 'Day 2',
        content: 'two days',
        timestamp: expect.any(Number),
      }
    });
    expect(viewDiaryEntry(entry3.entryId)).toStrictEqual({
      entry: {
        entryId: entry3.entryId,
        title: 'Day 3',
        content: 'three days',
        timestamp: expect.any(Number),
      }
    });
  });
});

describe('listDiaryEntries', () => {
  test('correctly list an empty diary', () => {
    expect(listDiaryEntries()).toStrictEqual({ entries: []})
  });

  //test.todo('correctly list one entry');

  test('correctly list one entry', () => {
    let entry = addDiaryEntry('Day 1', 'One day');
    expect(listDiaryEntries()).toStrictEqual({
      entries: [
        {
          entryId: entry.entryId,
          title: 'Day 1',
        }
      ]
    });
  });

  //test.todo('correctly list multiple entries');

  test('correctly list multiple entries', () => {
    let entry1 = addDiaryEntry('Day 1', 'one day');
    let entry2 = addDiaryEntry('Day 2', 'two days');
    let entry3 = addDiaryEntry('Day 3', 'three days');
    expect(listDiaryEntries()).toStrictEqual({
      entries: [
        {
          entryId: entry1.entryId,
          title: 'Day 1',
        },
        {
          entryId: entry2.entryId,
          title: 'Day 2',
        },
        {
          entryId: entry3.entryId,
          title: 'Day 3',
        }
      ]
    });
  });
});

describe('editDiaryEntry', () => {
  test('returns an error for a non-existent entry id', () => {
    expect(editDiaryEntry(1, 'valid', 'valid')).toStrictEqual({ error: expect.any(String) });
  });

  describe('when one diary is created', () => {
    let entry;
    beforeEach(() => {
      entry = addDiaryEntry('Day 1', 'One day');
    });

    test.each([
      { title: '', content: 'valid' },
      { title: 'valid', content: '' },
      { title: '', content: '' },
    ])('returns an error for title=$title and content=$content', ({ title, content }) => {
      expect(editDiaryEntry(entry.entryId, title, content)).toStrictEqual({ error: expect.any(String) });
    });

    //test.todo('and an invalid entry id is given');

    test('and an invalid entry id is given', () => {
      expect(editDiaryEntry(entry.entryId + 1, 'validd', 'valid')).toStrictEqual({ error: expect.any(String) });
    });

    //test.todo('has the correct return type');

    test('has the correct return type', () => {
      expect(editDiaryEntry(entry.entryId, 'valid', 'valid')).toStrictEqual({});
    });

    test('successfully edits a diary entry', () => {
      editDiaryEntry(entry.entryId, 'newtitle', 'newcontent')
      expect(viewDiaryEntry(entry.entryId)).toStrictEqual({
        entry: {
          entryId: entry.entryId,
          title: 'newtitle',
          content: 'newcontent',
          timestamp: expect.any(Number),
        }
      });
    });
  });

  //test.todo('successfully edits multiple diary entries');

  test('successfully edits multiple diary entries', () => {
    let entry1 = addDiaryEntry('Day 1', 'one day');
    let entry2 = addDiaryEntry('Day 2', 'two days');
    let entry3 = addDiaryEntry('Day 3', 'three days');
    editDiaryEntry(entry1.entryId, 'new Day 1', 'new one day');
    editDiaryEntry(entry2.entryId, 'new Day 2', 'new two days');
    editDiaryEntry(entry3.entryId, 'new Day 3', 'new three days');
    expect(viewDiaryEntry(entry1.entryId)).toStrictEqual({
      entry: {
        entryId: entry1.entryId,
        title: 'new Day 1',
        content: 'new one day',
        timestamp: expect.any(Number),
      }
    });
    expect(viewDiaryEntry(entry2.entryId)).toStrictEqual({
      entry: {
        entryId: entry2.entryId,
        title: 'new Day 2',
        content: 'new two days',
        timestamp: expect.any(Number),
      }
    });
    expect(viewDiaryEntry(entry3.entryId)).toStrictEqual({
      entry: {
        entryId: entry3.entryId,
        title: 'new Day 3',
        content: 'new three days',
        timestamp: expect.any(Number),
      }
    });
  });
});

describe('searchDiary', () => {
  test('empty search string returns an error', () => {
    expect(searchDiary('')).toStrictEqual({ error: expect.any(String) });
  });

  test('returns no results for an empty diary', () => {
    expect(searchDiary('hi')).toStrictEqual({ entries: [] });
  });

  // TODO: add more tests
  test('returns no results for search', () => {
    let entry = addDiaryEntry('Day 1', 'one day');
    expect(searchDiary('asdasdasd')).toStrictEqual({ entries: [] });
  });

  test('returns 1 result for 1 entry', () => {
    let entry = addDiaryEntry('Day 1', 'one day');
    expect(searchDiary('one')).toStrictEqual({
      entries: [
        {
          entryId: entry.entryId,
          title: 'Day 1',
        }
      ]
    });
  });

  test ('returns results for all entries', () => {
    let entry1 = addDiaryEntry('Day 1', 'one day');
    let entry2 = addDiaryEntry('Day 2', 'two days');
    let entry3 = addDiaryEntry('Day 3', 'three days');
    expect(searchDiary('day')).toStrictEqual({
      entries: [
        {
          entryId: entry1.entryId,
          title: 'Day 1',
        },
        {
          entryId: entry2.entryId,
          title: 'Day 2',
        },
        {
          entryId: entry3.entryId,
          title: 'Day 3',
        }
      ]
    });
  });

  test ('returns some results for all entries', () => {
    let entry1 = addDiaryEntry('Day 1', 'one day');
    let entry2 = addDiaryEntry('Day 2', 'two days');
    let entry3 = addDiaryEntry('Day 3', 'three days');
    expect(searchDiary('days')).toStrictEqual({
      entries: [
        {
          entryId: entry2.entryId,
          title: 'Day 2',
        },
        {
          entryId: entry3.entryId,
          title: 'Day 3',
        }
      ]
    });
  });

  test('case sensitive test', () => {
    let entry = addDiaryEntry('Day 1', 'one day');
    expect(searchDiary('One')).toStrictEqual({ entries: [] });
  });
});
