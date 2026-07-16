// =============================================================================
// ROT47 密码 · 纯算法实现
// 对 ASCII 33..126 区间做 +47 回绕旋转，其它字符原样保留。自反。
// =============================================================================
const LO = 33;
const HI = 126;
const RANGE = HI - LO + 1; // 94

export interface Rot47Hooks {
  onChar?: (i: number, original: string, shifted: string) => void;
}

export function rot47(text: string, hooks: Rot47Hooks = {}): string {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const code = ch.charCodeAt(0);
    let shifted = ch;
    if (code >= LO && code <= HI) {
      shifted = String.fromCharCode(LO + ((((code - LO + 47) % RANGE) + RANGE) % RANGE));
    }
    out += shifted;
    hooks.onChar?.(i, ch, shifted);
  }
  return out;
}
