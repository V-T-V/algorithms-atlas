// 单词搜索 · 实现

export interface WsHooks {
  onStep?: (r: number, c: number, index: number, path: Array<[number, number]>) => void;
  onFound?: (path: Array<[number, number]>) => void;
}

const DIRS: ReadonlyArray<readonly [number, number]> = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
] as const;

/** 判断单词是否存在；返回匹配路径（任一解）或 null。 */
export function exist(
  board: string[][],
  word: string,
  hooks: WsHooks = {},
): Array<[number, number]> | null {
  const rows = board.length;
  if (rows === 0) return null;
  const cols = board[0]!.length;
  const path: Array<[number, number]> = [];

  const dfs = (r: number, c: number, idx: number): boolean => {
    if (idx === word.length) return true;
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    if (board[r]![c] !== word[idx]) return false;
    const saved = board[r]![c]!;
    board[r]![c] = '#'; // 标记
    path.push([r, c]);
    hooks.onStep?.(r, c, idx, [...path]);
    for (const [dr, dc] of DIRS) {
      if (dfs(r + dr, c + dc, idx + 1)) return true;
    }
    board[r]![c] = saved; // 恢复
    path.pop();
    return false;
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) {
        hooks.onFound?.([...path]);
        return path;
      }
    }
  }
  return null;
}

/** 不修改原棋盘。 */
export function existCopy(
  board: string[][],
  word: string,
  hooks: WsHooks = {},
): Array<[number, number]> | null {
  const copy = board.map((row) => [...row]);
  return exist(copy, word, hooks);
}
