// =============================================================================
// Pearson 哈希 · 纯算法实现
// 256 字节置换表 + 逐字节 (h = T[h ^ b])。零 DOM 依赖，可独立单测。
// =============================================================================

/**
 * 标准 256 字节置换表（伪随机但固定的 0..255 排列）。
 * 这是 Pearson 论文风格的一张常用表；任意固定置换均可。
 */
export const PEARSON_TABLE: readonly number[] = [
  98,
  6,
  85,
  150,
  36,
  23,
  112,
  164,
  135,
  207,
  169,
  5,
  26,
  64,
  165,
  219, // 0-15
  61,
  20,
  68,
  89,
  130,
  63,
  52,
  102,
  24,
  229,
  132,
  245,
  80,
  216,
  195,
  115, // 16-31
  90,
  188,
  194,
  78,
  227,
  199,
  48,
  251,
  75,
  249,
  197,
  253,
  88,
  151,
  14,
  233, // 32-47
  191,
  17,
  108,
  211,
  95,
  105,
  119,
  215,
  173,
  66,
  244,
  99,
  158,
  142,
  32,
  9, // 48-63
  222,
  149,
  210,
  254,
  178,
  143,
  139,
  119,
  148,
  162,
  182,
  195,
  145,
  4,
  100,
  67, // 64-79 (table is a permutation; entries below fixed distinct)
  196,
  215,
  238,
  130,
  87,
  222,
  119,
  78,
  203,
  168,
  12,
  199,
  84,
  110,
  1,
  232,
  67,
  144,
  17,
  191,
  221,
  81,
  165,
  25,
  186,
  103,
  220,
  12,
  23,
  200,
  177,
  162,
  33,
  194,
  165,
  247,
  138,
  96,
  219,
  33,
  132,
  206,
  172,
  117,
  8,
  1,
  90,
  198,
  42,
  230,
  199,
  175,
  156,
  198,
  99,
  156,
  235,
  119,
  44,
  207,
  105,
  26,
  191,
  158,
  220,
  173,
  137,
  140,
  230,
  25,
  56,
  14,
  4,
  193,
  195,
  149,
  137,
  215,
  230,
  8,
  98,
  138,
  153,
  29,
  89,
  217,
  251,
  236,
  62,
  76,
  210,
  8,
  14,
  181,
  67,
  184,
  213,
  192,
  0,
  240,
  38,
  73,
  188,
  196,
  93,
  222,
  184,
  175,
  130,
  174,
  6,
  197,
  226,
  22,
  145,
  187,
  171,
  156,
  28,
  211,
  80,
  169,
  175,
  240,
  18,
  109,
  107,
  169,
  26,
  132,
  211,
  51,
  32,
  132,
  99,
  39,
  86,
  168,
  159,
  245,
  14,
  193,
  233,
  197,
  83,
  55,
  240,
  224,
  11,
  100,
  233,
  178,
  240,
  14,
  163,
  207,
  159,
  199,
  105,
  199,
  191,
  169,
  79,
  213,
  194,
  231,
  174,
  168,
  88,
  105,
  197,
  222,
  25,
  87,
  188,
  156,
  240,
  9,
  158,
  252,
  175,
  25,
  213,
  195,
  230,
  18,
  231,
  39,
  188,
  71,
  178,
  109,
];
// 注意：上表为「教学用固定排列」。为保证是合法置换（每个 0..255 恰出现一次），
// 提供 canonicalize 将其转换为合法置换（缺失项补齐、重复项移除）。

/** 事件钩子。 */
export interface PearsonHooks {
  /** 处理一个字节 b 后，当前 h 值（h = T[h ^ b]）。 */
  onByte?: (byteIndex: number, b: number, prevH: number, h: number) => void;
  /** 8 位主哈希完成。 */
  onResult?: (h: number) => void;
}

/** 把任意固定表归一化为合法的 0..255 置换（去重 + 补缺）。 */
export function canonicalizeTable(raw: readonly number[]): number[] {
  const present = new Set<number>();
  const out: number[] = [];
  for (const v of raw) {
    const x = v & 0xff;
    if (!present.has(x)) {
      present.add(x);
      out.push(x);
    }
  }
  // 补上缺失的 0..255
  for (let i = 0; i < 256; i++) {
    if (!present.has(i)) out.push(i);
  }
  return out.slice(0, 256);
}

/** 缓存后的合法置换表。 */
const TABLE: number[] = canonicalizeTable(PEARSON_TABLE);

/** 取合法置换表副本。 */
export function getTable(): number[] {
  return [...TABLE];
}

/** 把输入归一化为字节数组。 */
function toBytes(data: string | number[]): number[] {
  if (typeof data === 'string') {
    return Array.from(new TextEncoder().encode(data));
  }
  return data;
}

/**
 * 8 位 Pearson 哈希。
 * @param data 输入（字符串按 UTF-8 取字节）
 * @param seed 起始 h 值（默认 0）
 * @param hooks 可选事件钩子
 * @returns 0..255 的哈希值
 */
export function pearson8(
  data: string | number[],
  seed: number = 0,
  hooks: PearsonHooks = {},
): number {
  const bytes = toBytes(data);
  let h = seed & 0xff;
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i]! & 0xff;
    const prevH = h;
    h = TABLE[(h ^ b) & 0xff]!;
    hooks.onByte?.(i, b, prevH, h);
  }
  hooks.onResult?.(h);
  return h & 0xff;
}

/**
 * 多字节 Pearson 哈希：用不同初值运行 width 次，拼接为 width 字节。
 * @param data 输入
 * @param width 字节数（决定输出位宽 = width*8）
 * @param hooks 可选事件钩子（每次 8 位运算触发）
 * @returns width 字节的哈希数组
 */
export function pearsonMulti(
  data: string | number[],
  width: number = 4,
  hooks: PearsonHooks = {},
): number[] {
  const out: number[] = [];
  for (let w = 0; w < width; w++) {
    out.push(pearson8(data, w, hooks));
  }
  return out;
}
