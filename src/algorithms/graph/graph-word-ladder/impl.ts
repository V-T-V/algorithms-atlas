// =============================================================================
// 单词接龙 · 纯算法实现（单源 BFS）
// =============================================================================

export interface WordLadderHooks {
  onVisit?: (word: string, dist: number) => void;
  onResult?: (length: number) => void;
}

function neighbors(word: string, dict: Set<string>): string[] {
  const res: string[] = [];
  const arr = word.split('');
  for (let i = 0; i < arr.length; i++) {
    const saved = arr[i]!;
    for (let c = 97; c <= 122; c++) {
      const ch = String.fromCharCode(c);
      if (ch === saved) continue;
      arr[i] = ch;
      const cand = arr.join('');
      if (dict.has(cand)) res.push(cand);
    }
    arr[i] = saved;
  }
  return res;
}

export function ladderLength(
  beginWord: string,
  endWord: string,
  wordList: string[],
  hooks: WordLadderHooks = {},
): number {
  const dict = new Set(wordList);
  if (!dict.has(endWord)) {
    hooks.onResult?.(0);
    return 0;
  }
  const visited = new Set<string>([beginWord]);
  const queue: Array<[string, number]> = [[beginWord, 1]];
  while (queue.length > 0) {
    const [word, dist] = queue.shift()!;
    for (const nb of neighbors(word, dict)) {
      if (visited.has(nb)) continue;
      if (nb === endWord) {
        hooks.onVisit?.(nb, dist + 1);
        hooks.onResult?.(dist + 1);
        return dist + 1;
      }
      visited.add(nb);
      hooks.onVisit?.(nb, dist + 1);
      queue.push([nb, dist + 1]);
    }
  }
  hooks.onResult?.(0);
  return 0;
}
