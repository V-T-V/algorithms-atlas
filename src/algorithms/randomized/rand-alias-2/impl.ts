// 别名法（加权离散采样）· 纯算法实现
export interface AliasHooks {
  onBuild?: (alias: number[], prob: number[]) => void;
  onSample?: (column: number, useAlias: boolean, value: number) => void;
}

export interface AliasTable {
  prob: number[]; // 每列本体概率（0..1）
  alias: number[]; // 每列的别名索引（-1 表示无别名）
  n: number;
}

export function buildAlias(weights: readonly number[], hooks: AliasHooks = {}): AliasTable {
  const n = weights.length;
  if (n === 0) return { prob: [], alias: [], n: 0 };
  const sum = weights.reduce((s, w) => s + w, 0);
  if (sum <= 0) throw new Error('权重总和必须为正');
  // 归一化到 n 为单位（期望 = n * w/sum，平均 = 1）
  const prob = weights.map((w) => (n * w) / sum);
  const alias = new Array<number>(n).fill(-1);
  const small: number[] = [];
  const large: number[] = [];
  for (let i = 0; i < n; i++) {
    if (prob[i]! < 1) small.push(i);
    else large.push(i);
  }
  while (small.length > 0 && large.length > 0) {
    const s = small.pop()!;
    const l = large.pop()!;
    alias[s] = l;
    prob[l] = prob[l]! - (1 - prob[s]!);
    if (prob[l]! < 1) small.push(l);
    else large.push(l);
  }
  // 浮点残留：剩余的全设为 1
  while (large.length > 0) prob[large.pop()!] = 1;
  while (small.length > 0) prob[small.pop()!] = 1;
  hooks.onBuild?.([...alias], [...prob]);
  return { prob, alias, n };
}

function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1103515245 + 12345) >>> 0;
    return s / 0x100000000;
  };
}

export function aliasSample(
  table: AliasTable,
  count: number,
  rng: () => number = lcg(42),
  hooks: AliasHooks = {},
): number[] {
  const out: number[] = [];
  for (let k = 0; k < count; k++) {
    const col = Math.floor(rng() * table.n);
    const u = rng();
    const useAlias = u > table.prob[col]! && table.alias[col]! >= 0;
    const val = useAlias ? table.alias[col]! : col;
    hooks.onSample?.(col, useAlias, val);
    out.push(val);
  }
  return out;
}
