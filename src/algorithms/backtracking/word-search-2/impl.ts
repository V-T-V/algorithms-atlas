// =============================================================================
// 单词搜索 II（Word Search II）· 纯算法实现
// Trie + 回溯 DFS。从每个格子出发，沿 Trie 同步下降，剪掉非前缀路径。
// =============================================================================

/** Trie 节点。 */
export interface TrieNode {
  children: Map<string, TrieNode>;
  /** 命中该节点对应单词，否则 undefined。 */
  word: string | null;
}

export function createTrie(): TrieNode {
  return { children: new Map(), word: null };
}

export function insertWord(root: TrieNode, word: string): void {
  let node = root;
  for (const ch of word) {
    let child = node.children.get(ch);
    if (!child) {
      child = createTrie();
      node.children.set(ch, child);
    }
    node = child;
  }
  node.word = word;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface WordSearch2Hooks {
  /** 进入格子 (r,c) 开始/继续搜索。 */
  onVisit?: (r: number, c: number, path: string) => void;
  /** 剪枝：当前字符无 Trie 子节点。 */
  onPrune?: (r: number, c: number, ch: string) => void;
  /** 回溯：离开格子 (r,c)。 */
  onBacktrack?: (r: number, c: number) => void;
  /** 命中一个单词。 */
  onFound?: (word: string) => void;
}

const DIRS: ReadonlyArray<readonly [number, number]> = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

/**
 * 在字符网格上找出词典中所有出现的单词（Trie + 回溯）。
 *
 * @param board m×n 字符网格
 * @param words 词典
 * @param hooks 可选事件钩子
 * @returns 网格中出现过的所有单词（去重）
 */
export function wordSearch2(
  board: string[][],
  words: readonly string[],
  hooks: WordSearch2Hooks = {},
): string[] {
  if (board.length === 0 || words.length === 0) return [];
  const m = board.length;
  const n = board[0]!.length;

  const root = createTrie();
  for (const w of words) insertWord(root, w);

  const found = new Set<string>();
  const visited: boolean[][] = Array.from({ length: m }, () => new Array<boolean>(n).fill(false));
  const pathChars: string[] = [];

  const dfs = (r: number, c: number, node: TrieNode): void => {
    // 边界 / 已访问
    if (r < 0 || r >= m || c < 0 || c >= n) return;
    if (visited[r]![c]!) return;
    const ch = board[r]![c]!;
    const child = node.children.get(ch);
    if (!child) {
      hooks.onPrune?.(r, c, ch);
      return;
    }
    visited[r]![c] = true;
    pathChars.push(ch);
    hooks.onVisit?.(r, c, pathChars.join(''));

    if (child.word !== null && !found.has(child.word)) {
      found.add(child.word);
      hooks.onFound?.(child.word);
    }
    // 剪枝：若 child 已无子节点，无需继续（叶子）
    for (const [dr, dc] of DIRS) {
      if (child.children.size > 0) {
        dfs(r + dr, c + dc, child);
      }
    }

    pathChars.pop();
    visited[r]![c] = false;
    hooks.onBacktrack?.(r, c);
  };

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      dfs(i, j, root);
    }
  }

  return [...found];
}
