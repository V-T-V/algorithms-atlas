export interface SlHooks {
  onMove?: (pos: number) => void;
  onResult?: (moves: number) => void;
}
export function snakesAndLadders(board: number[][], hooks: SlHooks = {}): number {
  const n = board.length;
  const target = n * n;
  const getPos = (sq: number): number => {
    const r = n - 1 - Math.floor((sq - 1) / n);
    let c = (sq - 1) % n;
    if ((n - 1 - r) % 2 === 1) c = n - 1 - c;
    return board[r]![c]!;
  };
  const visited = new Array<boolean>(target + 1).fill(false);
  const q: Array<[number, number]> = [[1, 0]];
  visited[1] = true;
  while (q.length) {
    const [sq, moves] = q.shift()!;
    for (let d = 1; d <= 6; d++) {
      let next = sq + d;
      if (next > target) continue;
      const tele = getPos(next);
      if (tele !== -1) next = tele;
      if (next === target) {
        hooks.onMove?.(next);
        hooks.onResult?.(moves + 1);
        return moves + 1;
      }
      if (!visited[next]) {
        visited[next] = true;
        hooks.onMove?.(next);
        q.push([next, moves + 1]);
      }
    }
  }
  hooks.onResult?.(-1);
  return -1;
}
