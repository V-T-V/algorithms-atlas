export interface RrtHooks {
  onSample?: (x: number, y: number) => void;
  onExtend?: (from: number, to: number) => void;
  onGoal?: (node: number) => void;
}
export interface RrtProblem {
  start: [number, number];
  goal: [number, number];
  sample: () => [number, number];
  step: number;
  threshold: number;
}
export function rrtSearch(p: RrtProblem, maxIter: number, hooks: RrtHooks = {}): number[] {
  const nodes: Array<[number, number]> = [p.start];
  const parent: number[] = [-1];
  for (let it = 0; it < maxIter; it++) {
    const s = p.sample();
    hooks.onSample?.(s[0], s[1]);
    let ni = 0;
    let nd = Infinity;
    for (let i = 0; i < nodes.length; i++) {
      const d = Math.hypot(nodes[i]![0] - s[0], nodes[i]![1] - s[1]);
      if (d < nd) {
        nd = d;
        ni = i;
      }
    }
    const from = nodes[ni]!;
    const ang = Math.atan2(s[1] - from[1], s[0] - from[0]);
    const nx = from[0] + p.step * Math.cos(ang);
    const ny = from[1] + p.step * Math.sin(ang);
    nodes.push([nx, ny]);
    parent.push(ni);
    hooks.onExtend?.(ni, nodes.length - 1);
    if (Math.hypot(nx - p.goal[0], ny - p.goal[1]) <= p.threshold) {
      hooks.onGoal?.(nodes.length - 1);
      break;
    }
  }
  // 最近节点回溯路径
  let gi = 0;
  let gd = Infinity;
  for (let i = 0; i < nodes.length; i++) {
    const d = Math.hypot(nodes[i]![0] - p.goal[0], nodes[i]![1] - p.goal[1]);
    if (d < gd) {
      gd = d;
      gi = i;
    }
  }
  const path: number[] = [];
  let c: number | undefined = gi;
  while (c !== undefined && c >= 0) {
    path.unshift(c);
    c = parent[c];
  }
  return path;
}
