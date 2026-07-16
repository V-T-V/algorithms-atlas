// 贪心最大割 · 实现
export interface McHooks {
  onPlace?: (v: number, side: 0 | 1, cutGain: number) => void;
  onConclude?: (cutSize: number) => void;
}
export function greedyMaxCut(
  n: number,
  edges: ReadonlyArray<readonly [number, number]>,
  hooks: McHooks = {},
): { side: number[]; cutSize: number } {
  const adj = Array.from({ length: n }, () => new Array<number>());
  for (const [u, v] of edges) {
    adj[u]!.push(v);
    adj[v]!.push(u);
  }
  const side = new Array<number>(n).fill(-1);
  let cutSize = 0;
  for (let v = 0; v < n; v++) {
    let s0 = 0,
      s1 = 0;
    for (const u of adj[v]!) {
      if (side[u] === 0) s1++;
      else if (side[u] === 1) s0++;
    }
    const choice: 0 | 1 = s0 >= s1 ? 0 : 1;
    side[v] = choice;
    cutSize += Math.max(s0, s1);
    hooks.onPlace?.(v, choice, Math.max(s0, s1));
  }
  hooks.onConclude?.(cutSize);
  return { side, cutSize };
}
