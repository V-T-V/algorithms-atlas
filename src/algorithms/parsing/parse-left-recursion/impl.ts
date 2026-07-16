// 消除直接左递归 · 纯算法实现
export interface Rule {
  head: string;
  alts: string[][];
}
export interface ElimResult {
  rules: Rule[];
  changed: boolean;
}

export function eliminateLeftRecursion(rule: Rule): ElimResult {
  const recursive: string[][] = [];
  const nonRecursive: string[][] = [];
  for (const alt of rule.alts) {
    if (alt.length > 0 && alt[0] === rule.head) recursive.push(alt.slice(1));
    else nonRecursive.push(alt);
  }
  if (recursive.length === 0) return { rules: [rule], changed: false };
  if (nonRecursive.length === 0)
    throw new Error('pure left recursion cannot be eliminated this way');
  const prime = `${rule.head}'`;
  return {
    rules: [
      { head: rule.head, alts: nonRecursive.map((b) => [...b, prime]) },
      { head: prime, alts: [...recursive.map((a) => [...a, prime]), []] },
    ],
    changed: true,
  };
}
