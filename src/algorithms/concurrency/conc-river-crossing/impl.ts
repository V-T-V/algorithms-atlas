// 传教士与野人过河 · 实现（BFS）

export interface RcState {
  leftM: number;
  leftC: number;
  boat: 0 | 1; // 0 在左岸，1 在右岸
}

export interface RcMove {
  m: number;
  c: number;
}

const BOAT_CAP = 2;

export function isSafe(s: RcState, totalM: number, totalC: number): boolean {
  const rightM = totalM - s.leftM;
  const rightC = totalC - s.leftC;
  const ok = (m: number, c: number): boolean => m === 0 || m >= c;
  return ok(s.leftM, s.leftC) && ok(rightM, rightC);
}

export function nextMoves(
  s: RcState,
  totalM: number,
  totalC: number,
): Array<{ move: RcMove; state: RcState }> {
  const out: Array<{ move: RcMove; state: RcState }> = [];
  // 生成 1..BOAT_CAP 人组合
  for (let m = 0; m <= BOAT_CAP; m++) {
    for (let c = 0; c <= BOAT_CAP; c++) {
      if (m + c === 0 || m + c > BOAT_CAP) continue;
      if (s.boat === 0) {
        // 从左到右
        if (s.leftM >= m && s.leftC >= c) {
          const ns: RcState = { leftM: s.leftM - m, leftC: s.leftC - c, boat: 1 };
          if (isSafe(ns, totalM, totalC)) out.push({ move: { m, c }, state: ns });
        }
      } else {
        if (totalM - s.leftM >= m && totalC - s.leftC >= c) {
          const ns: RcState = { leftM: s.leftM + m, leftC: s.leftC + c, boat: 0 };
          if (isSafe(ns, totalM, totalC)) out.push({ move: { m, c }, state: ns });
        }
      }
    }
  }
  return out;
}

export interface RcSolution {
  path: Array<{ state: RcState; move: RcMove | null }>;
  steps: number;
}

export function solveRiverCrossing(totalM = 3, totalC = 3): RcSolution | null {
  const start: RcState = { leftM: totalM, leftC: totalC, boat: 0 };
  const goal: RcState = { leftM: 0, leftC: 0, boat: 1 };
  const key = (s: RcState): string => `${s.leftM},${s.leftC},${s.boat}`;
  const visited = new Set<string>([key(start)]);
  const queue: Array<{ state: RcState; path: Array<{ state: RcState; move: RcMove | null }> }> = [
    { state: start, path: [{ state: start, move: null }] },
  ];
  while (queue.length > 0) {
    const { state, path } = queue.shift()!;
    if (key(state) === key(goal)) return { path, steps: path.length - 1 };
    for (const { move, state: ns } of nextMoves(state, totalM, totalC)) {
      const k = key(ns);
      if (!visited.has(k)) {
        visited.add(k);
        queue.push({ state: ns, path: [...path, { state: ns, move }] });
      }
    }
  }
  return null;
}
