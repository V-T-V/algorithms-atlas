// 外观数列 · 实现
export interface CountAndSayHooks {
  onIter?: (n: number, term: string) => void;
  onConclude?: (result: string) => void;
}
export function miscCountAndSay(n: number, hooks: CountAndSayHooks = {}): string {
  if (n <= 0) throw new Error('n 必须 >= 1 / n must be >= 1');
  let term = '1';
  for (let i = 1; i < n; i++) {
    let next = '';
    let j = 0;
    while (j < term.length) {
      const d = term[j]!;
      let cnt = 0;
      while (j < term.length && term[j] === d) {
        cnt++;
        j++;
      }
      next += String(cnt) + d;
    }
    term = next;
    hooks.onIter?.(i + 1, term);
  }
  hooks.onConclude?.(term);
  return term;
}
