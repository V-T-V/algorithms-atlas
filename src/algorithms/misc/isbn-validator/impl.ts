// ISBN-10 校验 · 纯算法实现

/** 事件钩子。 */
export interface IsbnHooks {
  /** 处理第 i 位（1-based），值 digit，权重 weight，贡献 contribution。 */
  onDigit?: (i: number, digit: number, weight: number, contribution: number) => void;
  /** 求和完成。 */
  onSum?: (sum: number) => void;
  /** 校验结论。 */
  onResult?: (valid: boolean) => void;
}

/** 把 ISBN 字符串清洗为字符数组：去除连字符/空格。返回 null 表示含非法字符。 */
export function parseIsbn(input: string): string[] | null {
  const cleaned = input.replace(/[ s-]/g, '').toUpperCase();
  if (!/^[0-9]{9}[0-9X]$/.test(cleaned)) return null;
  return cleaned.split('');
}

/** 把单个 ISBN 字符解析为数值（X → 10）。 */
function charToValue(ch: string): number {
  return ch === 'X' ? 10 : ch.charCodeAt(0) - 48;
}

/**
 * 校验 ISBN-10 是否合法。
 * @param isbn ISBN-10 字符串（可含连字符/空格）
 */
export function isValidIsbn10(isbn: string, hooks: IsbnHooks = {}): boolean {
  const chars = parseIsbn(isbn);
  if (chars === null) {
    hooks.onResult?.(false);
    return false;
  }
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    const digit = charToValue(chars[i]!);
    const weight = 10 - i; // 10,9,...,1
    const contribution = digit * weight;
    sum += contribution;
    hooks.onDigit?.(i + 1, digit, weight, contribution);
  }
  hooks.onSum?.(sum);
  const valid = sum % 11 === 0;
  hooks.onResult?.(valid);
  return valid;
}

/**
 * 由前 9 位数字计算 ISBN-10 校验位字符。
 * @param first9 长度 9 的数字字符串
 * @returns 校验位字符（'0'..'9' 或 'X'）
 */
export function computeCheckDigit(first9: string): string {
  if (!/^[0-9]{9}$/.test(first9)) throw new RangeError('first9 must be 9 digits');
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const digit = first9[i]!.charCodeAt(0) - 48;
    sum += digit * (10 - i);
  }
  const check = (11 - (sum % 11)) % 11;
  return check === 10 ? 'X' : String(check);
}
