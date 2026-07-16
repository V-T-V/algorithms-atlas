export interface WbHooks {
  onCut?: (w: string) => void;
  onResult?: (s: string) => void;
}
export function wordBreak(s: string, wordDict: string[], hooks: WbHooks = {}): string[] {
  const dict = new Set(wordDict);
  const out: string[] = [];
  const cur: string[] = [];
  const go = (start: number) => {
    if (start === s.length) {
      out.push(cur.join(' '));
      hooks.onResult?.(cur.join(' '));
      return;
    }
    for (let end = start + 1; end <= s.length; end++) {
      const w = s.slice(start, end);
      if (dict.has(w)) {
        cur.push(w);
        hooks.onCut?.(w);
        go(end);
        cur.pop();
      }
    }
  };
  go(0);
  return out;
}
