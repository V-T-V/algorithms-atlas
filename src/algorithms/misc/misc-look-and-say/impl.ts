// 外观数列 · 实现
export interface LsHooks {
  onTerm?: (i: number, term: string) => void;
}
export function lookAndSay(start: string, k: number, hooks: LsHooks = {}): string[] {
  const terms = [start];
  for (let it = 0; it < k; it++) {
    let cur = '',
      i = 0;
    const s = terms[terms.length - 1]!;
    while (i < s.length) {
      let c = 1;
      while (i + c < s.length && s[i + c] === s[i]) c++;
      cur += String(c) + s[i];
      i += c;
    }
    terms.push(cur);
    hooks.onTerm?.(it + 1, cur);
  }
  return terms;
}
