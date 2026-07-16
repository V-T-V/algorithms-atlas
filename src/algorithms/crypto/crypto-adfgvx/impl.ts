// =============================================================================
// ADFGVX 密码 · 纯算法实现
// 方阵字符集 = A-Z + 0-9（36 个），按用户给定的 36 字符 polybiusKey 排布。
// 第一阶段：每字符 → 两字母（行/列，标签 A D F G V X）。
// 第二阶段：把分数化结果按 transpositionKey 做列置换。
// =============================================================================
const LABELS = ['A', 'D', 'F', 'G', 'V', 'X'] as const;
const DEFAULT_FILL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/** 规范化 polybiusKey 为长度 36 的字符集（大写字母+数字），去重补全。 */
export function buildAdfgvxFill(polybiusKey = ''): string {
  const seen = new Set<string>();
  const order: string[] = [];
  const allowed = (ch: string): boolean => /^[A-Z0-9]$/.test(ch);
  for (const ch of polybiusKey.toUpperCase()) {
    if (allowed(ch) && !seen.has(ch)) {
      seen.add(ch);
      order.push(ch);
    }
  }
  for (const ch of DEFAULT_FILL) {
    if (!seen.has(ch)) {
      seen.add(ch);
      order.push(ch);
    }
  }
  return order.join('');
}

export interface AdfgvxHooks {
  onFill?: (fill: string) => void;
  onFractionate?: (i: number, original: string, code: string) => void;
  onTransposed?: (cols: string[]) => void;
}

/** 列置换：把文本按 transpositionKey 的长度分列，再按 key 字母序重排各列并拼接。 */
function columnarTranspose(text: string, key: string): string {
  const k = key.length;
  const cols: string[] = Array.from({ length: k }, () => '');
  for (let i = 0; i < text.length; i++) {
    cols[i % k]! += text[i]!;
  }
  // 按 key 字母排序后的下标顺序输出各列
  const order = Array.from({ length: k }, (_, i) => i).sort((a, b) => {
    const ca = key[a]!.toUpperCase();
    const cb = key[b]!.toUpperCase();
    return ca < cb ? -1 : ca > cb ? 1 : a - b;
  });
  let out = '';
  for (const idx of order) out += cols[idx]!;
  return out;
}

export function adfgvxEncrypt(
  text: string,
  polybiusKey = '',
  transpositionKey = 'KEY',
  hooks: AdfgvxHooks = {},
): string {
  const fill = buildAdfgvxFill(polybiusKey);
  hooks.onFill?.(fill);
  const pos = new Map<string, string>();
  for (let i = 0; i < 36; i++) {
    const row = Math.floor(i / 6);
    const col = i % 6;
    pos.set(fill[i]!, LABELS[row]! + LABELS[col]!);
  }
  let fractioned = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!.toUpperCase();
    if (pos.has(ch)) {
      const code = pos.get(ch)!;
      fractioned += code;
      hooks.onFractionate?.(i, text[i]!, code);
    }
  }
  const result = columnarTranspose(fractioned, transpositionKey);
  return result;
}
