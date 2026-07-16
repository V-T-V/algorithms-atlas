export interface GpHooks {
  onAdd?: (ch: string, open: number, close: number) => void;
  onResult?: (s: string) => void;
}
export function generateParenthesis(n: number, hooks: GpHooks = {}): string[] {
  const out: string[] = [];
  const cur: string[] = [];
  const go = (open: number, close: number) => {
    if (cur.length === n * 2) {
      out.push(cur.join(''));
      hooks.onResult?.(cur.join(''));
      return;
    }
    if (open < n) {
      cur.push('(');
      hooks.onAdd?.('(', open + 1, close);
      go(open + 1, close);
      cur.pop();
    }
    if (close < open) {
      cur.push(')');
      hooks.onAdd?.(')', open, close + 1);
      go(open, close + 1);
      cur.pop();
    }
  };
  go(0, 0);
  return out;
}
