// =============================================================================
// 进制转换（Base Conversion）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

const DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** 解析阶段的事件钩子。 */
export interface ParseHooks {
  /** 处理第 i 位（左起 0-based）：字符 ch、位值 value、累加后的 decimal。 */
  onParse?: (i: number, ch: string, value: number, decimal: number) => void;
}

/** 生成阶段的事件钩子。 */
export interface GenerateHooks {
  /** 第 step 次（1-based）取余：余数 rem、对应字符 ch、剩余商 quotient。 */
  onGenerate?: (step: number, rem: number, ch: string, quotient: number) => void;
}

/** 合并钩子（转换全过程的解析与生成回调）。 */
export interface BaseConversionHooks extends ParseHooks, GenerateHooks {}

/** 把单个字符解析为 0..35 的位值（大写或小写均可）。 */
export function charToValue(ch: string): number {
  const c = ch.toUpperCase();
  const code = c.charCodeAt(0);
  if (code >= 48 && code <= 57) return code - 48; // '0'..'9'
  if (code >= 65 && code <= 90) return code - 55; // 'A'..'Z'
  return -1;
}

/**
 * 把任意进制（2~36）字符串解析为十进制非负整数。
 *
 * @param numStr 源进制字符串
 * @param base 源进制（2..36）
 * @param hooks 可选事件钩子
 * @returns 十进制整数值
 */
export function parseToDecimal(numStr: string, base: number, hooks: ParseHooks = {}): number {
  if (base < 2 || base > 36) {
    throw new Error(`进制必须在 2..36 / base must be in [2, 36], got ${base}`);
  }
  const cleaned = numStr.trim().toUpperCase();
  if (cleaned.length === 0) throw new Error('空字符串 / empty input');

  let decimal = 0;
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i]!;
    const value = charToValue(ch);
    if (value < 0 || value >= base) {
      throw new Error(`非法字符 '${ch}'（进制 ${base}）/ invalid digit '${ch}' for base ${base}`);
    }
    decimal = decimal * base + value;
    hooks.onParse?.(i, ch, value, decimal);
  }
  return decimal;
}

/**
 * 把十进制非负整数转换为目标进制（2~36）字符串。
 *
 * @param decimal 十进制非负整数
 * @param base 目标进制（2..36）
 * @param hooks 可选事件钩子
 * @returns 目标进制字符串
 */
export function generateFromDecimal(
  decimal: number,
  base: number,
  hooks: GenerateHooks = {},
): string {
  if (base < 2 || base > 36) {
    throw new Error(`进制必须在 2..36 / base must be in [2, 36], got ${base}`);
  }
  if (!Number.isInteger(decimal) || decimal < 0) {
    throw new Error(
      `decimal 必须是非负整数 / decimal must be a non-negative integer, got ${decimal}`,
    );
  }
  if (decimal === 0) {
    hooks.onGenerate?.(1, 0, '0', 0);
    return '0';
  }

  let quotient = decimal;
  const chars: string[] = [];
  let step = 0;
  while (quotient > 0) {
    const rem = quotient % base;
    const ch = DIGITS[rem]!;
    chars.unshift(ch);
    quotient = Math.floor(quotient / base);
    step++;
    hooks.onGenerate?.(step, rem, ch, quotient);
  }
  return chars.join('');
}

/**
 * 任意进制互转：把 numStr 从 fromBase 转为 toBase。
 *
 * @param numStr 源进制字符串
 * @param fromBase 源进制（2..36）
 * @param toBase 目标进制（2..36）
 * @param hooks 可选事件钩子
 * @returns 目标进制字符串
 */
export function convertBase(
  numStr: string,
  fromBase: number,
  toBase: number,
  hooks: BaseConversionHooks = {},
): string {
  const decimal = parseToDecimal(numStr, fromBase, { onParse: hooks.onParse });
  return generateFromDecimal(decimal, toBase, { onGenerate: hooks.onGenerate });
}
