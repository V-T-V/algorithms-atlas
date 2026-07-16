// 贪心 Steiner 树 (度量闭包 + MST 简化) · 实现
export interface GsHooks {
  onAttach?: (terminal: number, via: number, dist: number) => void;
  onConclude?: (totalWeight: number) => void;
}
export function greedySteinerTree(
  dist: ReadonlyArray<readonly number[]>,
  terminals: readonly number[],
  hooks: GsHooks = {},
): number {
  // dist: 终端间最短路距离矩阵; 求 MST 之和
  const n = terminals.length;
  const visited = new Array<boolean>(n).fill(false);
  visited[0] = true;
  let total = 0;
  for (let k = 1; k < n; k++) {
    let best = -1,
      bestD = Infinity,
      via = 0;
    for (let i = 0; i < n; i++)
      if (!visited[i])
        for (let j = 0; j < n; j++)
          if (visited[j]) {
            if (dist[terminals[i]!]![terminals[j]!]! < bestD) {
              bestD = dist[terminals[i]!]![terminals[j]!]!;
              best = i;
              via = j;
            }
          }
    if (best < 0) break;
    visited[best] = true;
    total += bestD;
    hooks.onAttach?.(terminals[best]!, terminals[via]!, bestD);
  }
  hooks.onConclude?.(total);
  return total;
}
