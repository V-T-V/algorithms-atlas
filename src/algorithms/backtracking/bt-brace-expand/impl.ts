export interface BeHooks {
  onPick?: (ch: string) => void;
  onResult?: (w: string) => void;
}
export function expand(s: string, hooks: BeHooks = {}): string[] {
  const groups: string[][] = [];
  let i = 0;
  while (i < s.length) {
    if (s[i] === '{') {
      i++;
      const opts: string[] = [];
      while (s[i] !== '}') {
        if (s[i] !== ',') opts.push(s[i]!);
        i++;
      }
      i++;
      groups.push(opts.sort());
    } else {
      groups.push([s[i]!]);
      i++;
    }
  }
  const out: string[] = [];
  const cur: string[] = [];
  const go = (idx: number) => {
    if (idx === groups.length) {
      out.push(cur.join(''));
      hooks.onResult?.(cur.join(''));
      return;
    }
    for (const ch of groups[idx]!) {
      cur.push(ch);
      hooks.onPick?.(ch);
      go(idx + 1);
      cur.pop();
    }
  };
  go(0);
  return out;
}
