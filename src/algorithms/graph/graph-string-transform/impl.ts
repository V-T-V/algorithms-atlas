// =============================================================================
// 字符串变换 · 纯算法实现（双向 BFS）
// =============================================================================

export interface StringTransformHooks {
  onExpand?: (word: string, dist: number) => void;
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

export function ladderLengthBi(
  beginWord: string,
  endWord: string,
  wordList: string[],
  hooks: StringTransformHooks = {},
): number {
  const dict = new Set(wordList);
  if (!dict.has(endWord)) {
    hooks.onResult?.(0);
    return 0;
  }
  let front = new Set<string>([beginWord]);
  let back = new Set<string>([endWord]);
  const visited = new Set<string>([beginWord, endWord]);
  let dist = 1;
  while (front.size > 0 && back.size > 0) {
    if (front.size > back.size) [front, back] = [back, front];
    const next = new Set<string>();
    for (const word of front) {
      for (const nb of neighbors(word, dict)) {
        if (back.has(nb)) {
          hooks.onResult?.(dist + 1);
          return dist + 1;
        }
        if (!visited.has(nb)) {
          visited.add(nb);
          next.add(nb);
          hooks.onExpand?.(nb, dist + 1);
        }
      }
    }
    front = next;
    dist++;
  }
  hooks.onResult?.(0);
  return 0;
}
