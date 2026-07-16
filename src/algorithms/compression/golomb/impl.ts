// =============================================================================
// Golomb编码（Golomb Coding）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 对几何分布的非负整数最优（参数 m = ceil(-1/log(1-p))）。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface GolombHooks {
  onEncode?: (value: number, bits: string) => void;
}

export interface GolombResult {
  /** 编码后的比特串。 */
  bits: string;
}

/**
 * Golomb 编码（参数 m）：商 q = n / m 用一元码，余数 r = n % m 用截断二进制。
 * @param values 非负整数
 * @param m Golomb 参数
 * @param hooks 可选的事件钩子
 */
export function golomb(values: number[], m = 10, hooks: GolombHooks = {}): GolombResult {
  if (m < 1) throw new Error('m 必须 >= 1');
  const b = Math.floor(Math.log2(m));
  const cutoff = (1 << (b + 1)) - m; // 截断二进制分界
  let bits = '';
  for (const v of values) {
    if (v < 0) throw new Error('Golomb 仅编码非负整数');
    const q = Math.floor(v / m);
    const r = v % m;
    let code = '1'.repeat(q) + '0'; // 一元码
    // 截断二进制：r < cutoff 用 b 位；否则用 b+1 位
    if (r < cutoff) {
      code += r.toString(2).padStart(b, '0');
    } else {
      code += (r + cutoff).toString(2).padStart(b + 1, '0');
    }
    bits += code;
    hooks.onEncode?.(v, code);
  }
  return { bits };
}
