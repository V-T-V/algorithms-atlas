// 正则转后缀 · 纯算法实现
export const PREC: Record<string, number> = { '|': 1, '.': 2, '*': 3 };

function isLiteral(c: string): boolean {
  return /[a-zA-Z0-9]/.test(c);
}

export function insertConcat(re: string): string {
  const out: string[] = [];
  for (let i = 0; i < re.length; i++) {
    out.push(re[i]!);
    const a = re[i]!;
    const b = re[i + 1];
    if (!b) continue;
    const aEnd = isLiteral(a) || a === '*' || a === ')';
    const bStart = isLiteral(b) || b === '(';
    if (aEnd && bStart) out.push('.');
  }
  return out.join('');
}

export function regexToPostfix(re: string): string {
  const s = insertConcat(re);
  const out: string[] = [];
  const op: string[] = [];
  for (const c of s) {
    if (isLiteral(c)) {
      out.push(c);
      continue;
    }
    if (c === '(') {
      op.push(c);
      continue;
    }
    if (c === ')') {
      while (op.length && op[op.length - 1] !== '(') out.push(op.pop()!);
      op.pop();
      continue;
    }
    while (op.length && op[op.length - 1] !== '(' && PREC[op[op.length - 1]!]! >= PREC[c]!)
      out.push(op.pop()!);
    op.push(c);
  }
  while (op.length) out.push(op.pop()!);
  return out.join('');
}
