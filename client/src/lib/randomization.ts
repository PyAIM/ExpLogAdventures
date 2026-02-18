/**
 * Randomization Utilities for Challenge Generation
 * Ensures students see different problems on each visit
 */

// Random number generator with exclusion range
export const randomExcluding = (min: number, max: number, exclude: number, range: number): number => {
  let value;
  do {
    value = Math.random() * (max - min) + min;
  } while (Math.abs(value - exclude) < range);
  return Number(value.toFixed(1));
};

// Random integer in range
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Random choice from array
export const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Shuffle array
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Random decimal in range
export const randomDecimal = (min: number, max: number, decimals: number = 1): number => {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
};

// Generate random base for exponential/logarithm (avoiding 1)
export const randomBase = (): number => {
  const bases = [2, 3, 4, 5, 10, Math.E];
  return randomChoice(bases);
};

// Generate random coefficient
export const randomCoefficient = (): number => {
  const coefficients = [0.5, 1, 2, 3, 4, 5];
  return randomChoice(coefficients);
};

// Generate random transformation parameters
export const randomTransform = () => {
  return {
    h: randomInt(-3, 3), // horizontal shift
    k: randomInt(-5, 5), // vertical shift
    a: randomChoice([0.5, 1, 2, 3]), // vertical stretch/compression
  };
};

// Generate random exponential function parameters
export const randomExponentialParams = () => {
  const b = randomDecimal(0.1, 4, 1);
  const a = randomDecimal(-5, 5, 1);
  return { a: a === 0 ? 1 : a, b: b === 1 ? 1.5 : b };
};

// Generate random logarithm expression
export const randomLogExpression = () => {
  const bases = [2, 3, 10, Math.E];
  const values = [2, 4, 8, 16, 27, 81, 100, 1000];
  const base = randomChoice(bases);
  const value = randomChoice(values.filter(v => {
    // Only include values that are powers of the base or make sense
    const log = Math.log(v) / Math.log(base);
    return Number.isInteger(log) || Math.abs(log - Math.round(log)) < 0.1;
  }));
  return { base, value };
};

// Generate random compound interest scenario
export const randomCompoundScenario = () => {
  const principals = [1000, 2500, 5000, 10000];
  const rates = [0.03, 0.04, 0.05, 0.06, 0.07, 0.08];
  const compounds = [1, 2, 4, 12, 365];
  const years = [5, 10, 15, 20, 25, 30];
  
  return {
    principal: randomChoice(principals),
    rate: randomChoice(rates),
    compoundsPerYear: randomChoice(compounds),
    years: randomChoice(years),
  };
};

// Generate random viral video scenario
export const randomViralScenario = () => {
  const initialViews = [100, 500, 1000, 5000];
  const growthRates = [1.5, 2, 2.5, 3];
  const timeUnits = ['hours', 'days'];
  
  return {
    initialViews: randomChoice(initialViews),
    growthRate: randomChoice(growthRates),
    timeUnit: randomChoice(timeUnits),
  };
};

// Generate random carbon dating scenario
export const randomCarbonScenario = () => {
  const artifacts = [
    { name: "Ancient Pottery", trueAge: randomInt(2000, 4000) },
    { name: "Wooden Tool", trueAge: randomInt(5000, 8000) },
    { name: "Cave Painting", trueAge: randomInt(10000, 15000) },
    { name: "Fossil Fragment", trueAge: randomInt(20000, 30000) },
    { name: "Bone Sample", trueAge: randomInt(3000, 7000) },
  ];
  
  return randomChoice(artifacts);
};

// Generate random equation to solve
export const randomEquation = (type: 'exponential' | 'logarithmic'): { equation: string; solution: number } => {
  if (type === 'exponential') {
    const base = randomChoice([2, 3, 10]);
    const result = Math.pow(base, randomInt(2, 4));
    const solution = Math.log(result) / Math.log(base);
    return {
      equation: `${base}^x = ${result}`,
      solution: Number(solution.toFixed(2)),
    };
  } else {
    const base = randomChoice([2, 3, 10]);
    const x = randomInt(2, 5);
    const value = Math.pow(base, x);
    return {
      equation: `log_${base}(x) = ${x}`,
      solution: value,
    };
  }
};
