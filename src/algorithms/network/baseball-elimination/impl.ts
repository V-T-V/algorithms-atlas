// =============================================================================
// 棒球淘汰（最大流）· 纯算法实现
// 1. 先做 trivial bound 检测（某队当前胜场已 > x 最大可能胜场）
// 2. 若 trivial 不淘汰，建最大流网络；最大流 == 所有剩余比赛和 -> 不淘汰
// =============================================================================

export interface BaseballTeam {
  /** 球队名称（仅用于展示）。 */
  name: string;
  /** 当前胜场。 */
  wins: number;
  /** 剩余比赛总场数（含对阵任意对手）。 */
  remaining: number;
}

export interface BaseballInput {
  teams: BaseballTeam[];
  /** games[i][j] = 球队 i 与球队 j 之间剩余比赛场数（对称，主对角线 0）。 */
  games: number[][];
}

export interface BaseballResult {
  /** 候选球队 x 的索引。 */
  teamIdx: number;
  /** 是否被淘汰。 */
  eliminated: boolean;
  /** 该队最大可能胜场 W = wins[x] + remaining[x]。 */
  maxWins: number;
  /** 若 trivial 淘汰，给出胜场 > W 的球队索引。 */
  trivialBy?: number;
  /** 若被淘汰（非平凡），给出反证子集（球队索引数组）。 */
  certificate?: number[];
  /** 最大流（用于展示）。 */
  maxFlow: number;
  /** 所有剩余比赛总和（容量上界）。 */
  totalGames: number;
}

export interface BaseballHooks {
  onTrivialCheck?: (teamIdx: number, maxWins: number, trivialBy: number | null) => void;
  onBuildNetwork?: (nodeCount: number, source: number, sink: number, edgeCount: number) => void;
  onAugment?: (totalFlow: number, totalGames: number) => void;
  onDone?: (result: BaseballResult) => void;
}

interface Arc {
  to: number;
  cap: number;
  rev: number;
}

const INF = 1e9;

/**
 * 判定单支球队是否被淘汰。
 *
 * @param input 联盟数据
 * @param teamIdx 候选球队索引
 * @param hooks 钩子
 */
export function baseballElimination(
  input: BaseballInput,
  teamIdx: number,
  hooks: BaseballHooks = {},
): BaseballResult {
  const { teams, games } = input;
  const n = teams.length;
  const x = teamIdx;
  const W = teams[x]!.wins + teams[x]!.remaining;

  // —— 1. Trivial 检测 ——
  let trivialBy: number | null = null;
  for (let i = 0; i < n; i++) {
    if (i === x) continue;
    if (teams[i]!.wins > W) {
      trivialBy = i;
      break;
    }
  }
  hooks.onTrivialCheck?.(x, W, trivialBy);

  if (trivialBy !== null) {
    const r: BaseballResult = {
      teamIdx: x,
      eliminated: true,
      maxWins: W,
      trivialBy,
      certificate: [trivialBy],
      maxFlow: 0,
      totalGames: 0,
    };
    hooks.onDone?.(r);
    return r;
  }

  // —— 2. 构造最大流网络 ——
  // 其他球队索引（不含 x）
  const otherIdx: number[] = [];
  for (let i = 0; i < n; i++) {
    if (i !== x) otherIdx.push(i);
  }
  const m = otherIdx.length;
  // 节点编号：
  //  - 源 s = 0
  //  - 队对 (i,j) 节点：1 .. numPairs
  //  - 球队节点：numPairs+1 .. numPairs+m
  //  - 汇 t = numPairs+1+m
  const pairs: Array<[number, number]> = [];
  for (let a = 0; a < m; a++) {
    for (let b = a + 1; b < m; b++) {
      pairs.push([a, b]);
    }
  }
  const numPairs = pairs.length;
  const s = 0;
  const teamNodeOffset = 1 + numPairs;
  const t = teamNodeOffset + m;
  const nodeCount = t + 1;

  const g: Arc[][] = Array.from({ length: nodeCount }, () => []);
  let edgeCount = 0;
  const addEdge = (u: number, v: number, cap: number): void => {
    g[u]!.push({ to: v, cap, rev: g[v]!.length });
    g[v]!.push({ to: u, cap: 0, rev: g[u]!.length - 1 });
    edgeCount++;
  };

  const teamNode = (localIdx: number): number => teamNodeOffset + localIdx;

  // s -> (a,b) 容量 games[otherIdx[a]][otherIdx[b]]
  let totalGames = 0;
  for (let pi = 0; pi < pairs.length; pi++) {
    const [a, b] = pairs[pi]!;
    const gi = games[otherIdx[a]!]![otherIdx[b]!]!;
    if (gi > 0) {
      addEdge(s, 1 + pi, gi);
      totalGames += gi;
    }
  }
  // (a,b) -> a, (a,b) -> b 容量 INF
  for (let pi = 0; pi < pairs.length; pi++) {
    const [a, b] = pairs[pi]!;
    addEdge(1 + pi, teamNode(a), INF);
    addEdge(1 + pi, teamNode(b), INF);
  }
  // team -> t 容量 W - wins[otherIdx[i]]
  for (let i = 0; i < m; i++) {
    const cap = W - teams[otherIdx[i]!]!.wins;
    if (cap > 0) addEdge(teamNode(i), t, cap);
  }

  hooks.onBuildNetwork?.(nodeCount, s, t, edgeCount);

  // —— Edmonds-Karp ——
  let maxFlow = 0;
  const bfsAugment = (): boolean => {
    const parent = new Array<number>(nodeCount).fill(-1);
    const parentArcIdx = new Array<number>(nodeCount).fill(-1);
    const visited = new Array<boolean>(nodeCount).fill(false);
    visited[s] = true;
    const queue: number[] = [s];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head]!;
      head++;
      const arcs = g[u]!;
      for (let i = 0; i < arcs.length; i++) {
        const a = arcs[i]!;
        if (a.cap > 0 && !visited[a.to]) {
          visited[a.to] = true;
          parent[a.to] = u;
          parentArcIdx[a.to] = i;
          if (a.to === t) {
            // 找瓶颈
            let bottleneck = Infinity;
            let cur = t;
            while (cur !== s) {
              const p = parent[cur]!;
              const arc = g[p]![parentArcIdx[cur]!]!;
              if (arc.cap < bottleneck) bottleneck = arc.cap;
              cur = p;
            }
            // 推进
            cur = t;
            while (cur !== s) {
              const p = parent[cur]!;
              const arc = g[p]![parentArcIdx[cur]!]!;
              arc.cap -= bottleneck;
              g[cur]![arc.rev]!.cap += bottleneck;
              cur = p;
            }
            maxFlow += bottleneck;
            return true;
          }
          queue.push(a.to);
        }
      }
    }
    return false;
  };

  while (bfsAugment()) {
    hooks.onAugment?.(maxFlow, totalGames);
  }

  // —— 判定 ——
  const eliminated = maxFlow < totalGames;

  // 寻找反证子集：在最小割中 t 侧的球队集合
  let certificate: number[] | undefined;
  if (eliminated) {
    // BFS from s 在残量图中
    const visited = new Array<boolean>(nodeCount).fill(false);
    visited[s] = true;
    const queue: number[] = [s];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head]!;
      head++;
      const arcs = g[u]!;
      for (let i = 0; i < arcs.length; i++) {
        const a = arcs[i]!;
        if (a.cap > 0 && !visited[a.to]) {
          visited[a.to] = true;
          queue.push(a.to);
        }
      }
    }
    // t 侧的球队节点（不在 s 侧）构成反证子集
    certificate = [];
    for (let i = 0; i < m; i++) {
      if (!visited[teamNode(i)]) certificate.push(otherIdx[i]!);
    }
  }

  const r: BaseballResult = {
    teamIdx: x,
    eliminated,
    maxWins: W,
    certificate,
    maxFlow,
    totalGames,
  };
  hooks.onDone?.(r);
  return r;
}

/** 检查所有球队，返回被淘汰的球队索引数组。 */
export function findAllEliminated(input: BaseballInput): number[] {
  const out: number[] = [];
  for (let i = 0; i < input.teams.length; i++) {
    const r = baseballElimination(input, i);
    if (r.eliminated) out.push(i);
  }
  return out;
}
