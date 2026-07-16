export interface WlHooks {
  onVisit?: (w: string, dist: number) => void;
  onResult?: (len: number) => void;
}
export function ladderLength(
  beginWord: string,
  endWord: string,
  wordList: string[],
  hooks: WlHooks = {},
): number {
  const dict = new Set(wordList);
  if (!dict.has(endWord)) {
    hooks.onResult?.(0);
    return 0;
  }
  const visited = new Set<string>([beginWord]);
  const q: Array<[string, number]> = [[beginWord, 1]];
  while (q.length) {
    const [w, d] = q.shift()!;
    for (let i = 0; i < w.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const ch = String.fromCharCode(c);
        if (ch === w[i]) continue;
        const nw = w.slice(0, i) + ch + w.slice(i + 1);
        if (nw === endWord) {
          hooks.onVisit?.(nw, d + 1);
          hooks.onResult?.(d + 1);
          return d + 1;
        }
        if (dict.has(nw) && !visited.has(nw)) {
          visited.add(nw);
          hooks.onVisit?.(nw, d + 1);
          q.push([nw, d + 1]);
        }
      }
    }
  }
  hooks.onResult?.(0);
  return 0;
}
