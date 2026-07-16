export interface PpHooks {
  onCut?: (s: string) => void;
  onResult?: (parts: string[]) => void;
}
function isPal(s: string, l: number, r: number): boolean {
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++;
    r--;
  }
  return true;
}
export function partition(s: string, hooks: PpHooks = {}): string[][] {
  const out: string[][] = [];
  const cur: string[] = [];
  const go = (start: number) => {
    if (start === s.length) {
      out.push([...cur]);
      hooks.onResult?.([...cur]);
      return;
    }
    for (let end = start; end < s.length; end++) {
      if (isPal(s, start, end)) {
        const sub = s.slice(start, end + 1);
        cur.push(sub);
        hooks.onCut?.(sub);
        go(end + 1);
        cur.pop();
      }
    }
  };
  go(0);
  return out;
}
