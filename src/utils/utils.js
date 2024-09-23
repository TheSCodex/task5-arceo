import seedrandom from 'seedrandom';

// Combine seed and page number
export function combineSeedAndPage(seed, pageNumber, errorRate) {
  return `${seed}-${pageNumber}-${errorRate}`;
}

// Generate a random seed
export function generateRandomSeed() {
  return Math.floor(Math.random() * 1000000);
}

// Create an RNG (random number generator) based on the seed
export function createRng(seed) {
  return seedrandom(seed);
}
