// 有效数字 · 实现（确定性有限自动机）
export interface ValidNumberHooks {
  onState?: (i: number, state: string) => void;
  onConclude?: (valid: boolean) => void;
}
const TRANS: Record<string, Record<string, string>> = {
  start: { digit: 'int', sign: 'sign', dot: 'dot', space: 'start' },
  sign: { digit: 'int', dot: 'dot' },
  int: { digit: 'int', dot: 'frac', e: 'e', space: 'end' },
  dot: { digit: 'frac' },
  frac: { digit: 'frac', e: 'e', space: 'end' },
  e: { digit: 'exp', sign: 'esign' },
  esign: { digit: 'exp' },
  exp: { digit: 'exp', space: 'end' },
  end: { space: 'end' },
};
const ACCEPT = new Set(['int', 'frac', 'exp', 'end']);
export function miscValidNumber(s: string, hooks: ValidNumberHooks = {}): boolean {
  let state = 'start';
  for (let i = 0; i < s.length; i++) {
    const c = s[i]!;
    let cls: string;
    if (c >= '0' && c <= '9') cls = 'digit';
    else if (c === '+' || c === '-') cls = 'sign';
    else if (c === '.') cls = 'dot';
    else if (c === 'e' || c === 'E') cls = 'e';
    else if (c === ' ') cls = 'space';
    else {
      hooks.onConclude?.(false);
      return false;
    }
    // 在 e 状态下需要 'esign' 而非 'sign'
    if (state === 'e' && cls === 'sign') cls = 'esign';
    const next = TRANS[state]?.[cls];
    hooks.onState?.(i, state);
    if (!next) {
      hooks.onConclude?.(false);
      return false;
    }
    state = next;
  }
  const valid = ACCEPT.has(state);
  hooks.onConclude?.(valid);
  return valid;
}
