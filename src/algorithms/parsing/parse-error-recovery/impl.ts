// Panic-mode 错误恢复 · 纯算法实现
export interface RecoveryHooks {
  onError?: (tk: string, pos: number) => void;
  onSkip?: (tk: string, pos: number) => void;
  onSync?: (tk: string, pos: number) => void;
}
export interface RecoveryResult {
  tokens: string[];
  errors: number[];
}
const SYNC = new Set([';', ')', '}', ']']);

export function panicRecover(
  tokens: readonly string[],
  valid: Set<string>,
  hooks: RecoveryHooks = {},
): RecoveryResult {
  const out: string[] = [];
  const errors: number[] = [];
  let i = 0;
  while (i < tokens.length) {
    const tk = tokens[i]!;
    if (SYNC.has(tk) || valid.has(tk)) {
      out.push(tk);
      if (SYNC.has(tk)) hooks.onSync?.(tk, i);
      i++;
      continue;
    }
    errors.push(i);
    hooks.onError?.(tk, i);
    i++;
    while (i < tokens.length && !SYNC.has(tokens[i]!) && !valid.has(tokens[i]!)) {
      hooks.onSkip?.(tokens[i]!, i);
      i++;
    }
  }
  return { tokens: out, errors };
}
