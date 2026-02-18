/**
 * Helper functions for activity scoring and completion
 */

export interface ActivityInfo {
  id: string;
  name: string;
}

export const ACTIVITIES: Record<string, ActivityInfo> = {
  "exponential-explorer": {
    id: "exponential-explorer",
    name: "Exponential Explorer"
  },
  "log-detective": {
    id: "log-detective",
    name: "Log Detective"
  },
  "compound-interest": {
    id: "compound-interest",
    name: "Compound Interest Quest"
  },
  "viral-video": {
    id: "viral-video",
    name: "Viral Video Challenge"
  },
  "carbon-dating": {
    id: "carbon-dating",
    name: "Carbon Dating Lab"
  },
  "log-laws": {
    id: "log-laws",
    name: "Logarithm Laws Master"
  },
  "log-evaluation": {
    id: "log-evaluation",
    name: "Logarithm Evaluation Expert"
  },
  "equation-solver": {
    id: "equation-solver",
    name: "Equation Solver Challenge"
  },
  "graph-matcher": {
    id: "graph-matcher",
    name: "Graph Matcher Challenge"
  }
};

/**
 * Generate a random value within a range, excluding the target value
 */
export function randomExcluding(min: number, max: number, exclude: number, tolerance: number = 0.1): number {
  let value;
  do {
    value = Math.random() * (max - min) + min;
  } while (Math.abs(value - exclude) < tolerance);
  return value;
}

/**
 * Round to specified decimal places
 */
export function roundTo(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}
