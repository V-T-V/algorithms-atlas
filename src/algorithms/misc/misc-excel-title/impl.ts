// =============================================================================
// Excel 列号转换 · 纯算法实现
// =============================================================================

export interface ExcelHooks {
  onDigit?: (value: number, letter: string) => void;
}

/** 数字 → 列标题（168）。 */
export function convertToTitle(columnNumber: number, hooks: ExcelHooks = {}): string {
  if (columnNumber < 1) throw new Error(`n 必须 >= 1 / must be >= 1, got ${columnNumber}`);
  let n = columnNumber;
  let result = '';
  while (n > 0) {
    n--;
    const r = n % 26;
    const letter = String.fromCharCode(65 + r);
    result = letter + result;
    hooks.onDigit?.(r + 1, letter);
    n = Math.floor(n / 26);
  }
  return result;
}

/** 列标题 → 数字（171）。 */
export function titleToNumber(columnTitle: string, hooks: ExcelHooks = {}): number {
  let result = 0;
  for (const c of columnTitle.toUpperCase()) {
    const v = c.charCodeAt(0) - 64;
    if (v < 1 || v > 26) throw new Error(`非法字符 / invalid char: ${c}`);
    result = result * 26 + v;
    hooks.onDigit?.(v, c);
  }
  return result;
}
