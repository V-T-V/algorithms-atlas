// 拟阵交 (简化: 图拟阵 = 森林, 颜色拟阵 = 每色上限) · 实现
export interface MiHooks {
  onAugment?: (S: number[], added: number) => void;
  onConclude?: (size: number) => void;
}
// 这里用"图边构成森林"(拟阵1) 与 "每点度数<=1"(配对拟阵, 拟阵2) 的简化
export function matroidIntersection(
  edges: ReadonlyArray<readonly [number, number]>,
  hooks: MiHooks = {},
): number[] {
  const S: number[] = [];
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < edges.length; i++) {
      if (S.includes(i)) continue;
      const trial = [...S, i];
      if (isForest(trial, edges) && isMatching(trial, edges)) {
        S.push(i);
        hooks.onAugment?.(S, i);
        changed = true;
      }
    }
  }
  hooks.onConclude?.(S.length);
  return S;
}
function isForest(idx: number[], edges: ReadonlyArray<readonly [number, number]>): boolean {
  const parent = new Map<number, number>();
  const find = (x: number): number => {
    while (parent.get(x) !== x) {
      parent.set(x, parent.get(parent.get(x)!)!);
      x = parent.get(x)!;
    }
    return x;
  };
  for (const i of idx) {
    const [u, v] = edges[i]!;
    if (!parent.has(u)) parent.set(u, u);
    if (!parent.has(v)) parent.set(v, v);
    const ru = find(u),
      rv = find(v);
    if (ru === rv) return false;
    parent.set(ru, rv);
  }
  return true;
}
function isMatching(idx: number[], edges: ReadonlyArray<readonly [number, number]>): boolean {
  const deg = new Map<number, number>();
  for (const i of idx) {
    const [u, v] = edges[i]!;
    if ((deg.get(u) ?? 0) >= 1 || (deg.get(v) ?? 0) >= 1) return false;
    deg.set(u, 1);
    deg.set(v, 1);
  }
  return true;
}
