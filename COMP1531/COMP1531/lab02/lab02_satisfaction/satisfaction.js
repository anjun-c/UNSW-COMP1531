/**
 * NOTE: If you are having difficulty completing this exercise,
 * please take a look at our example in the file "sample.js"!
 */

/**
 * Given an array of fast food restaurants, return a new sorted
 * array in descending order by:
 *
 *   1. customerService
 *   2. foodVariety
 *   3. valueForMoney
 *   4. timeToMake
 *   5. taste
 *   6. name (in lexicographical order, case-insensitive)
 *
 * For example, if two restaurant have the same customerService
 * and foodVariety, the one with a higher valueForMoney will be
 * in front (nearer to the start of the returned array).
 *
 * If the all other fields are equal and the name is compared,
 * "hungry Jacks" will be before "KFC" because "h" is before "K".
 *
 * WARNING: You should NOT modify the order of the original array.
 *
 * @param {
 *   Array<{
 *     name: string,
 *     customerService: number,
 *     foodVariety: number,
 *     valueForMoney: number,
 *     timeToMake: number,
 *     taste: number
 *   }>
 * } fastFoodArray with information about fast food restaurants,
 * which should not be modified.
 * @returns array with the same items, sorted by the key-order given.
 */
function sortedFastFood(fastFoodArray) {
  // TODO: Observe the return type from the stub code
  // FIXME: Replace the stub code with your implementation
  const sortedFastFood = fastFoodArray.toSorted((a, b) => {
    if (a.customerService !== b.customerService) {
      return b.customerService - a.customerService;
    }
    if (a.foodVariety !== b.foodVariety) {
      return b.foodVariety - a.foodVariety;
    }
    if (a.valueForMoney !== b.valueForMoney) {
      return b.valueForMoney - a.valueForMoney;
    }
    if (a.timeToMake !== b.timeToMake) {
      return b.timeToMake - a.timeToMake;
    }
    if (a.taste !== b.taste) {
      return b.taste - a.taste;
    }
    return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
  });

  return sortedFastFood;
}

/**
 * Given an array of fast food restaurants, return a new sorted
 * array ranked by the overall satisfaction.
 *
 * The satisfaction of a restaurant is the average score between
 * customerService, foodVariety, valueForMoney, timeToMake and taste.
 *
 * You do not need to round the satisfaction value.
 *
 * If two restaurants have the same satisfaction, the names
 * are compared in lexigraphical order (case-insensitive).
 * For example, "hungry Jacks" will appear before "KFC" because
 * "h" is before "K".
 *
 * WARNING: you should NOT modify the order of the original array.
 *
 * @param {
 *   Array<{
 *     name: string,
 *     customerService: number,
 *     foodVariety: number,
 *     valueForMoney: number,
 *     timeToMake: number,
 *     taste: number
 *  }>
 * } fastFoodArray with information about fast food restaurants,
 * which should not be modified.
 * @returns {
 *   Array<{
 *     restaurantName: string,
 *     satisfaction: number,
 *   }>
 * } a new sorted array based on satisfaction. The restaurantName
 * will be the same as the original name given.
 */
function sortedSatisfaction(fastFoodArray) {
  // TODO: Observe the return type from the stub code
  // FIXME: Replace the stub code with your implementation

  const sortedSatisfaction = fastFoodArray.toSorted((a,b) => {
    const satisfactionA = (a.customerService + 
      a.foodVariety + a.valueForMoney + 
      a.timeToMake + a.taste) / 5;
    const satisfactionB = (b.customerService + 
      b.foodVariety + b.valueForMoney + 
      b.timeToMake + b.taste) / 5;
    if (satisfactionA !== satisfactionB) {
      return satisfactionB - satisfactionA;
    }
    return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
  })

  return sortedSatisfaction;
  // return [
  //   {
  //     restaurantName: 'kentucky',
  //     satisfaction: 3.6,
  //   },
  //   {
  //     restaurantName: 'maccas',
  //     satisfaction: 3.2
  //   }
  // ];
}

// ========================================================================= //

/**
 * Execute the file with:
 *     $ node satisfaction.js
 *
 * The expected/sample output for the starter code is in the README.md.
 * Feel free to modify the code below to further test your functions.
 */

// Note: do not use this "fastFoods" global variable directly in your function.
// Your function has the parameter "fastFoodArray".
const fastFoods = [
  // {
  //   name: 'Second fastFood, third satisfaction (4.6)',
  //   customerService: 5,
  //   foodVariety: 5,
  //   valueForMoney: 5,
  //   timeToMake: 4,
  //   taste: 4,
  // },
  // {
  //   // Same as above, but name starts with "f"
  //   // which is before "S" (case-insensitive)
  //   name: 'First fastFood, second satisfaction (4.6)',
  //   customerService: 5,
  //   foodVariety: 5,
  //   valueForMoney: 5,
  //   timeToMake: 4,
  //   taste: 4
  // },
  // {
  //   // Worse foodVariety, but better overall
  //   name: 'Third fastFood, first satisfaction (4.8)',
  //   customerService: 5,
  //   foodVariety: 4,
  //   valueForMoney: 5,
  //   timeToMake: 5,
  //   taste: 5
  // },

  // new test cases
  {
    name: 'f',
    customerService: 5,
    foodVariety: 5,
    valueForMoney: 5,
    timeToMake: 4,
    taste: 4,
  },
  {
    name: 'e',
    customerService: 5,
    foodVariety: 5,
    valueForMoney: 5,
    timeToMake: 4,
    taste: 4
  },
  {
    name: 'd',
    customerService: 5,
    foodVariety: 4,
    valueForMoney: 5,
    timeToMake: 5,
    taste: 5
  },
  {
    name: 'c',
    customerService: 3,
    foodVariety: 2,
    valueForMoney: 1,
    timeToMake: 3,
    taste: 4
  },
  {
    name: 'b',
    customerService: 1,
    foodVariety: 2,
    valueForMoney: 3,
    timeToMake: 2,
    taste: 2
  },
  {
    name: 'a',
    customerService: 5,
    foodVariety: 5,
    valueForMoney: 5,
    timeToMake: 5,
    taste: 5
  },
];

// Note: We are using console.log because arrays cannot be commpared with ===.
// There are better ways to test which we will explore in future weeks :).
console.log('========================');
console.log('1. Testing Fast Food');
console.log('===========');
console.log(sortedFastFood(fastFoods));
console.log();

console.log('========================');
console.log('2. Testing Satisfaction');
console.log('===========');
console.log(sortedSatisfaction(fastFoods));
console.log();

console.log('========================================================');
console.log(`
  TIP:
    after attempting yourself, if you are still stuck, please take a
    look at sample.js in your respository.
`);
console.log(`
  WARNING:
    do not return an array within an array,
      e.g. [[1, 2, 3]] (wrong) instead of [1, 2, 3] (correct).
    You should only see one set of square brackets in the output.
`);
