// =============================================================================
// 单词接龙 II · 纯算法实现（分层 BFS + 回溯）
// =============================================================================

export interface WordLadder2Hooks {
  onLayer?: (layer: number, words: string[]) => void;
  onFound?: (paths: string[][]) => void;
  onDone?: (paths: string[][]) => void;
}

const diffByOne = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      d++;
      if (d > 1) return false;
    }
  }
  return d === 1;
};

export function wordLadder2(
  beginWord: string,
  endWord: string,
  wordList: readonly string[],
  hooks: WordLadder2Hooks = {},
): string[][] {
  const dict = new Set(wordList);
  if (!dict.has(endWord)) {
    hooks.onDone?.([]);
    return [];
  }
  const parents = new Map<string, Set<string>>(); // child -> set of parents (前一层的词)
  // 已确定最短层的词：一旦被某层「收编」，后续层不可再把它当作邻居（避免环/更长路径）
  const done = new Set<string>([beginWord]);
  let frontier = new Set<string>([beginWord]);
  let found = false;
  let layer = 0;

  while (frontier.size > 0 && !found) {
    layer++;
    const next = new Set<string>();
    // 本层临时收录，待全部处理后再合并到 done（允许同层多路径）
    const layerSeen = new Set<string>();
    for (const w of frontier) {
      for (const cand of dict) {
        if (!diffByOne(w, cand)) continue;
        if (done.has(cand)) continue; // 已在更早层，跳过
        if (!parents.has(cand)) parents.set(cand, new Set());
        parents.get(cand)!.add(w);
        layerSeen.add(cand);
        next.add(cand);
        if (cand === endWord) found = true;
      }
    }
    hooks.onLayer?.(layer, [...next]);
    for (const w of layerSeen) done.add(w);
    frontier = next;
  }

  if (!found) {
    hooks.onDone?.([]);
    return [];
  }

  // 回溯：path 为 cur 之后（朝 endWord）的词序列；到 beginWord 时拼完整路径
  const paths: string[][] = [];
  const build = (path: string[], cur: string): void => {
    if (cur === beginWord) {
      paths.push([beginWord, ...path]);
      return;
    }
    const ps = parents.get(cur);
    if (!ps) return;
    for (const p of ps) build([cur, ...path], p);
  };
  build([], endWord);
  hooks.onFound?.(paths);
  hooks.onDone?.(paths);
  return paths;
}
