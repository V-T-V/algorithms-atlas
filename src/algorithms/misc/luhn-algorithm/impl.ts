// =============================================================================
// Luhn 算法（Luhn Algorithm / mod-10 checksum）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface LuhnHooks {
  /** 处理第 i 位（从左 0-based）：原始值 digit，加倍后 effective。doubled 表示是否被加倍。 */
  onDigit?: (i: number, digit: number, effective: number, doubled: boolean) => void;
  /** 所有位求和完成。 */
  onSum?: (sum: number) => void;
  /** 校验结论。 */
  onResult?: (valid: boolean) => void;
}

/**
 * 把字符串清洗为数字数组：去除空格/连字符，仅保留数字。
 * 若含非数字字符，返回 null。
 */
export function parseDigits(input: string): number[] | null {
  const cleaned = input.replace(/[ s-]/g, '');
  if (!/^ d*$/.test(cleaned)) return null;
  const out: number[] = [];
  for (const ch of cleaned) out.push(ch.charCodeAt(0) - 48);
  return out;
}

/**
 * Luhn 校验：判断数字序列是否通过模 10 校验。
 *
 * 从右至左扫描，每隔一位（从倒数第二位起）将数字加倍，
 * 结果 > 9 时减 9；最后总和能被 10 整除则有效。
 *
 * @param digits 数字数组（每位 0..9）或数字字符串
 * @param hooks 可选事件钩子
 * @returns 是否有效
 */
export function luhnCheck(digits: number[] | string, hooks: LuhnHooks = {}): boolean {
  const arr: number[] = Array.isArray(digits) ? digits : (parseDigits(digits) ?? []);
  if (arr.length === 0) {
    hooks.onResult?.(false);
    return false;
  }

  const len = arr.length;
  let sum = 0;
  for (let i = 0; i < len; i++) {
    const fromRight = len - 1 - i; // 距右端的位数（0 = 末位）
    const shouldDouble = fromRight % 2 === 1; // 倒数第二、四…位加倍
    const d = arr[i]!;
    let effective = d;
    if (shouldDouble) {
      effective = d * 2;
      if (effective > 9) effective -= 9;
    }
    sum += effective;
    hooks.onDigit?.(i, d, effective, shouldDouble);
  }
  hooks.onSum?.(sum);

  const valid = sum % 10 === 0;
  hooks.onResult?.(valid);
  return valid;
}
