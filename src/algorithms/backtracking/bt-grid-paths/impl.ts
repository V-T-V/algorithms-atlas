export interface Gp2Hooks {
  onStep?: (r: number, c: number) => void;
  onResult?: (path: string) => void;
}
export function gridPaths(R: number, C: number, hooks: Gp2Hooks = {}): string[] {
  const out: string[] = [];
  const cur: string[] = [];
  const go = (r: number, c: number) => {
    if (r === R - 1 && c === C - 1) {
      out.push(cur.join(''));
      hooks.onResult?.(cur.join(''));
      return;
    }
    if (c + 1 < C) {
      cur.push('R');
      hooks.onStep?.(r, c + 1);
      go(r, c + 1);
      cur.pop();
    }
    if (r + 1 < R) {
      cur.push('D');
      hooks.onStep?.(r + 1, c);
      go(r + 1, c);
      cur.pop();
    }
  };
  go(0, 0);
  return out;
}
