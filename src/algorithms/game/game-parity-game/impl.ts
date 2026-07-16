// 奇偶博弈 · 实现 (小实例穷尽策略求胜者)
export interface ParityHooks {
  onNode?: (v: number, owner: 'E' | 'O', prio: number) => void;
  onWinner?: (v: number, winner: 'E' | 'O') => void;
}
export interface ParityGame {
  n: number;
  owner: ('E' | 'O')[];
  prio: number[];
  succ: number[][];
}
// 简化: 对每条可达无穷路径, 取 max(出现无穷次的优先级). 这里用 attractor 启发:
// 单优先级图 -> 偶最大优先级节点归 Even.
export function parityWinner(g: ParityGame, hooks: ParityHooks = {}): ('E' | 'O')[] {
  const win = new Array<'E' | 'O'>(g.n).fill('O');
  // 找最大优先级节点
  let maxP = -Infinity,
    maxV = 0;
  for (let v = 0; v < g.n; v++) {
    hooks.onNode?.(v, g.owner[v]!, g.prio[v]!);
    if (g.prio[v]! > maxP) {
      maxP = g.prio[v]!;
      maxV = v;
    }
  }
  const winner: 'E' | 'O' = maxP % 2 === 0 ? 'E' : 'O';
  win[maxV] = winner;
  // 简化传播: 能强制到 maxV 的同方节点也算赢
  const reach = new Set<number>([maxV]);
  for (let iter = 0; iter < g.n; iter++) {
    for (let v = 0; v < g.n; v++) {
      if (reach.has(v)) continue;
      if (g.owner[v] === winner && g.succ[v]!.some((s) => reach.has(s))) {
        reach.add(v);
        win[v] = winner;
      }
      if (g.owner[v] !== winner && g.succ[v]!.every((s) => reach.has(s))) {
        reach.add(v);
        win[v] = winner;
      }
    }
  }
  for (let v = 0; v < g.n; v++) hooks.onWinner?.(v, win[v]!);
  return win;
}
