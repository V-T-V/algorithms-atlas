export interface RatHooks {
  onMove?: (r: number, c: number) => void;
  onResult?: (path: Array<[number, number]>) => void;
}
export function findMazePath(
  maze: number[][],
  hooks: RatHooks = {},
): Array<[number, number]> | null {
  const n = maze.length;
  const visited = Array.from({ length: n }, () => new Array(n).fill(false));
  const path: Array<[number, number]> = [];
  const go = (r: number, c: number): boolean => {
    if (r < 0 || r >= n || c < 0 || c >= n || maze[r]![c] === 1 || visited[r]![c]) return false;
    visited[r]![c] = true;
    path.push([r, c]);
    hooks.onMove?.(r, c);
    if (r === n - 1 && c === n - 1) return true;
    if (go(r + 1, c) || go(r, c + 1) || go(r - 1, c) || go(r, c - 1)) return true;
    path.pop();
    return false;
  };
  if (go(0, 0)) {
    hooks.onResult?.(path);
    return path;
  }
  return null;
}
