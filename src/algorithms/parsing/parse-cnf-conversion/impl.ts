// CFG → Chomsky Normal Form · 纯算法实现
export interface Rule {
  head: string;
  syms: string[];
}
export function isNonTerminal(s: string): boolean {
  return /^[A-Z]/.test(s);
}

export function toCnf(rules: Rule[]): Rule[] {
  let out: Rule[] = [];
  let counter = 0;
  const fresh = (): string => `N${counter++}`;
  // 二元化
  for (const r of rules) {
    if (r.syms.length <= 2) {
      out.push(r);
      continue;
    }
    let prev = r.syms[0]!;
    for (let i = 1; i < r.syms.length - 1; i++) {
      const name = fresh();
      out.push({ head: i === 1 ? r.head : prev, syms: [i === 1 ? r.syms[0]! : prev, name] });
      prev = name;
    }
    out.push({ head: prev, syms: [r.syms[r.syms.length - 2]!, r.syms[r.syms.length - 1]!] });
  }
  // 终结符打包（仅在二元规则中替换终结符）
  const termWrap = new Map<string, string>();
  let tc = 0;
  out = out.map((r) => {
    if (r.syms.length === 2) {
      return {
        head: r.head,
        syms: r.syms.map((s) => {
          if (!isNonTerminal(s)) {
            let name = termWrap.get(s);
            if (!name) {
              name = `T${tc++}`;
              termWrap.set(s, name);
            }
            return name;
          }
          return s;
        }),
      };
    }
    return r;
  });
  for (const [t, name] of termWrap) out.push({ head: name, syms: [t] });
  return out;
}
