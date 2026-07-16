// =============================================================================
// IDA* 迭代加深 A* · 纯算法实现
// 在「状态空间树」上演示：状态为整数 id，邻居由 next(state) 给出，
// 启发 h(state)、目标 isGoal(state)、代价 cost(a,b)（默认每步 1）。
// =============================================================================

export type State = number;

export interface IdaStarSpace {
  start: State;
  isGoal: (s: State) => boolean;
  next: (s: State) => State[];
  h: (s: State) => number;
  cost?: (a: State, b: State) => number;
}

export interface IdaStarHooks {
  onBound?: (bound: number) => void;
  onVisit?: (s: State, g: number, f: number) => void;
  onPrune?: (s: State, f: number) => void;
  onDone?: (found: boolean, cost: number, path: State[]) => void;
}

export interface IdaStarResult {
  found: boolean;
  cost: number;
  path: State[];
}

export function idaStar(space: IdaStarSpace, hooks: IdaStarHooks = {}): IdaStarResult {
  const cost = space.cost ?? ((_a: State, b: State) => (b === space.start ? 0 : 1));
  let bound = space.h(space.start);
  const path: State[] = [space.start];
  let bestGoal: { g: number; path: State[] } | null = null;
  hooks.onBound?.(bound);

  const dfs = (g: number): number => {
    const node = path[path.length - 1]!;
    const f = g + space.h(node);
    if (f > bound) {
      hooks.onPrune?.(node, f);
      return f;
    }
    hooks.onVisit?.(node, g, f);
    if (space.isGoal(node)) {
      // 记录当前 bound 内找到的目标，继续寻找更优（更小 g）
      if (bestGoal === null || g < bestGoal.g) bestGoal = { g, path: [...path] };
      return -1;
    }
    let minNext = Infinity;
    for (const nb of space.next(node)) {
      if (path.includes(nb)) continue; // 避免环
      path.push(nb);
      const t = dfs(g + cost(node, nb));
      if (t !== -1 && t < minNext) minNext = t;
      path.pop();
    }
    return minNext;
  };

  for (let iter = 0; iter < 1000; iter++) {
    bestGoal = null;
    const t = dfs(0);
    const goal = bestGoal as { g: number; path: State[] } | null;
    if (goal !== null) {
      hooks.onDone?.(true, goal.g, goal.path);
      return { found: true, cost: goal.g, path: goal.path };
    }
    if (t === Infinity) {
      hooks.onDone?.(false, Infinity, []);
      return { found: false, cost: Infinity, path: [] };
    }
    bound = t;
    hooks.onBound?.(bound);
  }
  hooks.onDone?.(false, Infinity, []);
  return { found: false, cost: Infinity, path: [] };
}
