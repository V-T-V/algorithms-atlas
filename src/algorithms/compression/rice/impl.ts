// =============================================================================
// Rice编码（Rice Coding）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// Rice = Golomb 在参数为 2 的幂时的特例，对几何分布数据（音频残差）效果好。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface RiceHooks {
  onEncode?: (value: number, bits: string) => void;
}

export interface RiceResult {
  /** 编码后的比特串。 */
  bits: string;
}

/** 把非负整数映射为 Golomb 顺序号（处理负数：zig-zag）。 */
function zigzag(n: number): number {
  return n < 0 ? -2 * n - 1 : 2 * n;
}

/**
 * Rice 编码：参数 m=2^k。商 q = n >> k 用一元码（q 个 1 加 0），
 * 余数 r = n & (m-1) 用 k 位二进制（低位优先）。
 * @param values 非负整数（或任意整数，自动 zig-zag）
 * @param k Rice 参数，m = 2^k
 * @param hooks 可选的事件钩子
 */
export function rice(values: number[], k = 4, hooks: RiceHooks = {}): RiceResult {
  if (k < 0) throw new Error('k 必须 >= 0');
  const m = 1 << k;
  let bits = '';
  for (const v of values) {
    const n = zigzag(v);
    const q = n >>> k;
    const r = n & (m - 1);
    // 一元码：q 个 1 后接 0
    let code = '1'.repeat(q) + '0';
    // 余数：k 位二进制
    code += r.toString(2).padStart(k, '0');
    bits += code;
    hooks.onEncode?.(v, code);
  }
  return { bits };
}

/** Rice 解码。 */
export function inverseRice(bits: string, count: number, k = 4): number[] {
  const m = 1 << k;
  const out: number[] = [];
  let pos = 0;
  while (out.length < count && pos < bits.length) {
    let q = 0;
    while (bits[pos] === '1') {
      q++;
      pos++;
    }
    pos++; // 跳过 0
    const rStr = bits.slice(pos, pos + k);
    const r = parseInt(rStr, 2) || 0;
    pos += k;
    const n = (q << k) | r;
    // 逆 zig-zag
    out.push(n % 2 === 1 ? -(n + 1) / 2 : n / 2);
    void m;
  }
  return out;
}
