// 转义序列解析 · 纯算法实现

export type EscapeState = 'normal' | 'escape' | 'hex1' | 'hex2' | 'u1' | 'u2' | 'u3' | 'u4';

/** 事件钩子。 */
export interface EscapeHooks {
  /** 状态转换。 */
  onTransition?: (from: EscapeState, to: EscapeState, char: string) => void;
  /** 输出一个实际字符（给出来源：literal 或 escape 类型）。 */
  onChar?: (char: string, source: 'literal' | 'escape') => void;
  /** 遇到非法转义。 */
  onInvalid?: (seq: string) => void;
  /** 完成。 */
  onResult?: (output: string) => void;
}

const SIMPLE: Record<string, string> = {
  n: '\n',
  t: '\t',
  r: '\r',
  '\\': '\\',
  '"': '"',
  "'": "'",
  '0': '\0',
  b: '\b',
  f: '\f',
  v: '\v',
  '/': '/',
};

function hexValue(c: string): number {
  if (c >= '0' && c <= '9') return c.charCodeAt(0) - 48;
  if (c >= 'a' && c <= 'f') return c.charCodeAt(0) - 87;
  if (c >= 'A' && c <= 'F') return c.charCodeAt(0) - 55;
  return -1;
}

/**
 * 解析含转义序列的字符串。
 *
 * @param input 含转义的字符串（如字面量内部内容）
 * @param hooks 可选事件钩子
 * @returns 实际字符序列
 */
export function parseEscapes(input: string, hooks: EscapeHooks = {}): string {
  let out = '';
  let state: EscapeState = 'normal';
  let buf = '';

  const emit = (ch: string, source: 'literal' | 'escape'): void => {
    out += ch;
    hooks.onChar?.(ch, source);
  };

  for (let i = 0; i < input.length; i++) {
    const c = input[i]!;
    const prev: EscapeState = state;

    switch (state) {
      case 'normal': {
        if (c === '\\') {
          state = 'escape';
        } else {
          emit(c, 'literal');
        }
        break;
      }
      case 'escape': {
        if (c in SIMPLE) {
          emit(SIMPLE[c]!, 'escape');
          state = 'normal';
        } else if (c === 'x') {
          buf = '';
          state = 'hex1';
        } else if (c === 'u') {
          buf = '';
          state = 'u1';
        } else {
          // 未知转义：容忍为字面 + 警告
          hooks.onInvalid?.(`\\${c}`);
          emit(c, 'literal');
          state = 'normal';
        }
        break;
      }
      case 'hex1':
      case 'hex2': {
        const v = hexValue(c);
        if (v < 0) {
          hooks.onInvalid?.(`\\x${buf}${c}`);
          state = 'normal';
          break;
        }
        buf += c;
        state = state === 'hex1' ? 'hex2' : 'normal';
        if (state === 'normal') {
          emit(String.fromCharCode(parseInt(buf, 16)), 'escape');
        }
        break;
      }
      case 'u1':
      case 'u2':
      case 'u3':
      case 'u4': {
        const v = hexValue(c);
        if (v < 0) {
          hooks.onInvalid?.(`\\u${buf}${c}`);
          state = 'normal';
          break;
        }
        buf += c;
        if (state === 'u4') {
          emit(String.fromCharCode(parseInt(buf, 16)), 'escape');
          state = 'normal';
        } else {
          state = (state === 'u1' ? 'u2' : state === 'u2' ? 'u3' : 'u4') as EscapeState;
        }
        break;
      }
    }
    if (state !== prev) hooks.onTransition?.(prev, state, c);
  }
  if (state !== 'normal') hooks.onInvalid?.(`未完成的转义: \\${buf}`);
  hooks.onResult?.(out);
  return out;
}
