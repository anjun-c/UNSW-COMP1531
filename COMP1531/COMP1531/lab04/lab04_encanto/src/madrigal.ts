/**
 * Add type annotations to function parameters and replace all type stubs 'any'.
 *
 * Note: All functions in this lab are pure functions (https://en.wikipedia.org/wiki/Pure_function)
 * You should NOT introduce a "dataStore" or use any global variables in this file.
 */

export interface Madrigal {
  name: string;
  age: number;
  gift?: string;
}

export interface Song {
  name: string;
  singers: string | string[];
}

export function createMadrigal(name: string, age: number, gift? : string): Madrigal {
  if (gift === undefined) {
    const madrigal: Madrigal = { name: name, age: age };
    return madrigal;
  }
  const madrigal: Madrigal = { name: name, age: age, gift: gift };
  return madrigal;
}

export function createSong(name: string, singers: string | string[]): Song {
  const song: Song = { name: name, singers: singers };
  return song;
}

export function extractNamesMixed(array: (Madrigal | Song)[]) {
  const names: string[] = [];
  for (const item of array) {
    names.push(item.name);
  }
  return names;
}

export function extractNamesPure(array: Madrigal[] | Song[]) {
  const names: string[] = [];
  for (const item of array) {
    names.push(item.name);
  }
  return names;
}

export function madrigalIsSinger(madrigal: Madrigal, song: Song) {
  return song.singers.includes(madrigal.name);
}

export function sortedMadrigals(madrigals: Madrigal[]) {
  const sortedMadrigals = madrigals;
  sortedMadrigals.sort((a, b) => a.name.localeCompare(b.name));
  sortedMadrigals.sort((a, b) => a.age - b.age);
  return sortedMadrigals;
}

export function filterSongsWithMadrigals(madrigals: Madrigal[], songs: Song[]) {
  const filtered: Song[] = [];
  for (const song of songs) {
    for (const madrigal of madrigals) {
      if (madrigalIsSinger(madrigal, song)) {
        filtered.push(song);
        break;
      }
    }
  }
  return filtered;
}

// Find madrigal with most songs
export function getMostSpecialMadrigal(madrigals: Madrigal[], songs: Song[]): Madrigal {
  let mostSpecialMadrigal: Madrigal = madrigals[0];
  let mostSpecialSongs: number = 0;
  for (const madrigal of madrigals) {
    let songCount: number = 0;
    for (const song of songs) {
      if (madrigalIsSinger(madrigal, song)) {
        songCount++;
      }
    }
    if (songCount > mostSpecialSongs) {
      mostSpecialMadrigal = madrigal;
      mostSpecialSongs = songCount;
    }
  }
  return mostSpecialMadrigal;
}