/**
 * Compute the sum of the integer array.
 * If the array is empty, the sum is 0.
 *
 * @param {Array<number>} array of integers
 * @returns {number} the sum of the array
 */
function arraySum(array) {
  // FIXME
  let sum = 0;
  for (let i of array) {
    sum += i;
  }
  return sum;
}

/**
 * Compute the product of the given integer array.
 * If the array is empty, the product is 1.
 *
 * @param {Array<number>} array of integers
 * @returns {number} the product of the array
 */
function arrayProduct(array) {
  let product = 1;
  for (let i of array) {
    product *= i;
  }
  return product;
}

/**
 * Find the smallest number in the array
 *
 * @param {Array<number>} array of integers
 * @returns {number|null} the smallest number in the array, or
 * null if the array is empty
 */
function arrayMin(array) {
  if (array.length === 0) {
    return null;
  }
  return Math.min(...array);
}

/**
 * Find the largest number in the array
 *
 * @param {Array<number>} array of integers
 * @returns {number|null} the largest number in the array, or
 * null if the array is empty
 */
function arrayMax(array) {
  if (array.length === 0) {
    return null;
  }
  return Math.max(...array);
}

/**
 * Determine if the array contains a particular element.
 *
 * @param {Array<number>} array of integers
 * @param {number} item integer to check
 * @returns {boolean} whether the integer item is in the given array
 */
function arrayContains(array, item) {
  return array.includes(item);
}

/**
 * Create an array that is the reversed of the original.
 *
 * WARNING: a reminder that the original(s) array must not be modified.
 * You can create new arrays if needed.
 *
 * @param {Array<number>} array of integers
 * @returns {Array<number>} a new reversed array
 */
function arrayReversed(array) {
  return array.reverse();
}

/**
 * Returns the first element in the array
 *
 * @param {Array<number>} array of integers
 * @returns {number|null} the first element in the array,
 * or null if the array is empty
 */
function arrayHead(array) {
  if (array.length === 0) {
    return null;
  }
  return array[0];
}

/**
 * Return all elements in the array after the head. If the input array
 * contains one element, an empty array is returned.
 *   i.e. arrayTail([1]) => []
 *
 * WARNING: a reminder that the original(s) array must not be modified.
 * You can create new arrays if needed.
 *
 * @param {Array<number>} array of integers
 * @returns {Array<number>|null} an array of elements excluding the head,
 * or null if the input array is empty
 */
function arrayTail(array) {
  if (array.length === 0) {
    return null;
  }
  // if (array.length === 1) {
  //   return [];
  // }
  return array.slice(1);
}

/**
 * Given two arrays, multiply the elements at each index from arrays and store
 * the result in a third array. If the given two arrays differ in length,
 * excess elements of the larger array will be added on at the end.
 *
 * For example,
 *     [1, 3, 2]
 *   x [2, 4, 3, 5, 9]
 *   -----------------
 *   = [2, 12, 6, 5, 9]
 *
 * The result will be the same if array1 and array2 are swapped.
 *
 * @param {Array<number>} array1 of integers
 * @param {Array<number>} array2 of integers
 * @returns {Array<number>} array1 x array2 at each index
 */
function arraysMultiply(array1, array2) {
  let multiplied = [], 
  len = Math.max(array1.length, array2.length), 
  i = 0;
  while (i < len) {
    let a = array1[i] || 1;
    let b = array2[i] || 1;
    multiplied.push(a * b);
    i++;
  }
  return multiplied;
}

/**
 * Create a third array containing common elements between two arrays.
 *
 * Each element in the first array can map to at most one element
 * in the second array, and vice versa (one-to-one relationship).
 * 
 * Duplicated elements in each array are treated as separate entities.
 *
 * The order is determined by the first array.
 *
 * A few examples,
 *   arraysCommon([1,1], [1,1,1]) gives [1,1]
 *   arraysCommon([1,1,1], [1,1]) gives [1,1]
 *   arraysCommon([1,2,3,2,1], [5,4,3,2,1]) gives [1,2,3]
 *   arraysCommon([1,2,3,2,1], [2,2,3,3,4]) gives [2,3,2]
 *   arraysCommon([1,4,1,1,5,9,2,7], [1,8,2,5,1]) gives [1,1,5,2]
 *
 * WARNING: a reminder that the original array(s) must not be modified.
 * You can create new arrays if needed.
 *
 * @param {Array<number>} array1 of integers
 * @param {Array<number>} array2 of integers
 * @returns {Array<number>} number of common elements between two arrays
 */
function arraysCommon(array1, array2) {
  let common = [], i = 0, temp = [...array2];
  while (i < array1.length) {
    if (array2.includes(array1[i])) {
      common.push(array1[i]);
      temp.splice(temp.indexOf(array1[i]), 1);
    }
    i++;
  }
  return common;
}

// ========================================================================= //

/**
 * Debugging code
 */

console.assert(arraySum([1, 2, 3, 4]) === 10, 'arraySum([1,2,3,4]) === 10');
console.assert(arrayProduct([1, 2, 3, 4]) === 24, 'arrayProduct([1,2,3,4]) === 24');



console.log(`
  NOTE: you can't directly compare two arrays with '===', so you may need
  to come up with your own way of comparing arrays this week. For example, you
  could use console.log() and observe the output manually.
`)
console.log();
console.log('Testing : arrayCommon([1,2,3,2,1], [2,2,3,3,4])');
console.log('Received:', arraysCommon([1, 2, 3, 2, 1], [2, 2, 3, 3, 4]));
console.log('Expected: [ 2, 3, 2 ]');
console.log();

// TODO: your own debugging here

console.log('========================================================')

console.assert(arrayMin([1, 2, 3, 4]) === 1, 'arrayMin');
console.assert(arrayMax([1, 2, 3, 4]) === 4, 'arrayMax');
console.assert(arrayContains([1, 2, 3, 4], 1) === true, 'arrayContains');
console.log(arrayReversed([1,2,3,4]));
console.log(arrayTail([1]));
console.log(arraysMultiply([1,2,3,4], [5,6,7]));
console.log(arraysCommon([1,2,3,4], [5,6,7,1,2,3,4]));

console.log(`
  NOTE: these console.log messages will have no effect
  on automarking, so you do not need to remove before
  submitting your work.
`)