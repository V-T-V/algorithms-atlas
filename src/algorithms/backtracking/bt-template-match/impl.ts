export interface TmHooks {
  onMap?: (ch: string, sub: string) => void;
  onResult?: (ok: boolean) => void;
}
export function wordPatternMatch(pattern: string, s: string, hooks: TmHooks = {}): boolean {
  const ch2str = new Map<string, string>();
  const str2ch = new Map<string, string>();
  const go = (pi: number, si: number): boolean => {
    if (pi === pattern.length && si === s.length) return true;
    if (pi === pattern.length || si === s.length) return false;
    const ch = pattern[pi]!;
    if (ch2str.has(ch)) {
      const sub = ch2str.get(ch)!;
      if (!s.startsWith(sub, si)) return false;
      return go(pi + 1, si + sub.length);
    }
    for (let end = si + 1; end <= s.length; end++) {
      const sub = s.slice(si, end);
      if (str2ch.has(sub)) continue;
      ch2str.set(ch, sub);
      str2ch.set(sub, ch);
      hooks.onMap?.(ch, sub);
      if (go(pi + 1, end)) return true;
      ch2str.delete(ch);
      str2ch.delete(sub);
    }
    return false;
  };
  const ok = go(0, 0);
  hooks.onResult?.(ok);
  return ok;
}
