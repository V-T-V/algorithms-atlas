// 提取左公共因子 · 纯算法实现
export interface Rule {
  head: string;
  alts: string[][];
}
export interface FactorResult {
  rules: Rule[];
  changed: boolean;
}

function commonPrefixLen(a: string[], b: string[]): number {
  const n = Math.min(a.length, b.length);
  let i = 0;
  while (i < n && a[i] === b[i]) i++;
  return i;
}

export function leftFactor(rule: Rule): FactorResult {
  const alts = rule.alts;
  if (alts.length < 2) return { rules: [rule], changed: false };
  let best = 0;
  for (let i = 0; i < alts.length; i++) {
    for (let j = i + 1; j < alts.length; j++) {
      const p = commonPrefixLen(alts[i]!, alts[j]!);
      if (p > best) best = p;
    }
  }
  if (best === 0) return { rules: [rule], changed: false };
  const prefix = alts.find((a) => a.length >= best)!.slice(0, best);
  const prime = `${rule.head}"`;
  const covered = new Set<number>();
  const primeAlts: string[][] = [];
  for (let i = 0; i < alts.length; i++) {
    const alt = alts[i]!;
    if (alt.length >= best && prefix.every((t, k) => alt[k] === t)) {
      covered.add(i);
      primeAlts.push(alt.slice(best));
    }
  }
  const newHeadAlts: string[][] = [];
  let addedPrime = false;
  for (let i = 0; i < alts.length; i++) {
    if (covered.has(i)) {
      if (!addedPrime) {
        newHeadAlts.push([...prefix, prime]);
        addedPrime = true;
      }
    } else {
      newHeadAlts.push([...alts[i]!]);
    }
  }
  return {
    rules: [
      { head: rule.head, alts: newHeadAlts },
      { head: prime, alts: primeAlts },
    ],
    changed: true,
  };
}
