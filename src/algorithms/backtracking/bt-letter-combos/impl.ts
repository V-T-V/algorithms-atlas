const MAP: Record<string, string> = {
  '2': 'abc',
  '3': 'def',
  '4': 'ghi',
  '5': 'jkl',
  '6': 'mno',
  '7': 'pqrs',
  '8': 'tuv',
  '9': 'wxyz',
};
export interface LcHooks {
  onPick?: (ch: string, idx: number) => void;
  onResult?: (s: string) => void;
}
export function letterCombinations(digits: string, hooks: LcHooks = {}): string[] {
  if (!digits) return [];
  const out: string[] = [];
  const cur: string[] = [];
  const go = (i: number) => {
    if (i === digits.length) {
      out.push(cur.join(''));
      hooks.onResult?.(cur.join(''));
      return;
    }
    const letters = MAP[digits[i]!] ?? '';
    for (const ch of letters) {
      cur.push(ch);
      hooks.onPick?.(ch, i);
      go(i + 1);
      cur.pop();
    }
  };
  go(0);
  return out;
}
