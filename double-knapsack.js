// PROBLEM: binary knapsack but we have two knapsacks instead of just one

const sum = (x, y) => x + y;
const sumArray = arr => arr.reduce(sum, 0);

// memoize only with respect to the first three arguments - space1, space2, items
// the other two are not necessary in this case
const memoizeFirstThreeArgs = fn => {
  const cache = new Map();
  return (...args) => {
    const jsonArgs = JSON.stringify(args.slice(0, 3));
    if (cache.has(jsonArgs)) { return cache.get(jsonArgs); }
    const res = fn(...args);
    cache.set(jsonArgs, res);
    return res;
  };
};

// helper function that generates all the possible solutions
// meaning, all the possible ways in which we can stuff two knapsacks
// and caches those solutions;
// returns the number of possible solutions but that is not neccessary
// in this case
const _doubleKnapsack = (space1, space2, items, pick, cache) => {
  let value;

  if (space1 === 0 && space2 === 0) {
    value = 1;
    cache.add(pick);
  } else if (items.length === 0) {
    value = 1;
    cache.add(pick);
  } else if (space1 < items[0][0] && space2 < items[0][0]) {
    value = _doubleKnapsack(space1, space2, items.slice(1), pick, cache);
  } else if (space1 < items[0][0]) {
    value = _doubleKnapsack(space1, space2, items.slice(1), pick, cache)
              + _doubleKnapsack(space1, space2 - items[0][0], items.slice(1), pick.concat([items[0]]), cache);
  } else if (space2 < items[0][0]) {
    value = _doubleKnapsack(space1, space2, items.slice(1), pick, cache)
              + _doubleKnapsack(space1 - items[0][0], space2, items.slice(1), pick.concat([items[0]]), cache);
  } else {
    value = _doubleKnapsack(space1, space2, items.slice(1), pick, cache)
              + _doubleKnapsack(space1, space2 - items[0][0], items.slice(1), pick.concat([items[0]]), cache)
              + _doubleKnapsack(space1 - items[0][0], space2, items.slice(1), pick.concat([items[0]]), cache);
  }

  return value;
};

// uses memoized version of doubleknapsack and provides cache to that function;
// after cache has been populated by executing memoized version of knapsack,
// find the option with biggest value
const doubleKnapsack = (space1, space2, items) => {
  const options = new Set();
  const memoizedDoubleKnapsack = memoizeFirstThreeArgs(_doubleKnapsack);

  memoizedDoubleKnapsack(space1, space2, items, [], options);

  let minLeftSpace = Infinity;
  let bestPick;

  for (const items of options) {
    let itemsSum = sumArray(items.map(v => v[1]));
    if (space1 + space2 - itemsSum < minLeftSpace) {
      minLeftSpace = space1 + space2 - itemsSum;
      bestPick = items;
    }
  }

  return {
    options,
    bestPick,
    bestValue: sumArray(bestPick.map(v => v[1]))
  };
};

const space1 = 10;
const space2 = 5;
const items = [[3, 10], [4, 20], [2, 5], [9, 30]];

console.log(doubleKnapsack(space1, space2, items));
