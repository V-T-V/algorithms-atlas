// =============================================================================
// 快速幂（Fast Exponentiation / 模幂）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface FastPowerHooks {
  /** 观察指数的某一位（0/1），base = 当前底数的平方累积值。 */
  onBit?: (bit: 0 | 1, base: number, exp: number) => void;
  /** 把 base 自乘（平方）一次。 */
  onSquare?: (base: number) => void;
  /** 当前位为 1，把 result 乘上 base。 */
  onMultiply?: (result: number, base: number) => void;
}

/**
 * 快速幂：计算 `base^exp`，可选对 `mod` 取模。迭代「二进制拆指数」版。
 *
 * 思想：把指数 `exp` 写成二进制，按位从低到高扫描——\n
 *   - 每位都让 `base` 自乘（平方），表示「base 的幂次翻倍」\n
 *   - 当该位为 `1` 时，把当前 `base` 乘入 `result`\n
 * 最终 `result = base^exp`（对 mod 取模则每步取模防溢出）。\n
 *
 * 例：`a¹³ = a^(1101₂) = a⁸ · a⁴ · a¹`，只需约 `log₂(13)≈4` 次乘法。\n
 *
 * @param base 底数（整数）
 * @param exp 非负指数
 * @param mod 可选模数；给出则结果落在 `[0, mod)`。省略则返回精确整数（注意大数）
 * @param hooks 可选事件钩子
 * @returns `base^exp` 或 `base^exp mod mod`。
 */
export function fastPower(
  base: number,
  exp: number,
  mod?: number,
  hooks: FastPowerHooks = {},
): number {
  if (exp < 0) throw new RangeError('fastPower: exp must be non-negative');
  const modVal = mod === undefined ? null : Math.abs(mod);

  // 取模路径用 BigInt 运算，保证「底数·结果」中间值精确不溢出（>2^53 仍正确）。
  // 对外 API 仍是 number；hook 也只收 number。
  if (modVal !== null) {
    const m = BigInt(modVal);
    let bb = ((BigInt(base) % m) + m) % m; // 规范化底数到 [0, mod)
    let rr = 1n % m;
    let e = exp;
    while (e > 0) {
      const bit = (e & 1) as 0 | 1;
      const bbNum = Number(bb);
      hooks.onBit?.(bit, bbNum, e);
      if (bit === 1) {
        rr = (rr * bb) % m;
        hooks.onMultiply?.(Number(rr), bbNum);
      }
      e = Math.floor(e / 2);
      if (e > 0) {
        bb = (bb * bb) % m;
        hooks.onSquare?.(Number(bb));
      }
    }
    return Number(rr);
  }

  // 无取模：精确整数路径（注意大数会指数级增长）
  let b = base;
  let e = exp;
  let result = 1;
  while (e > 0) {
    const bit = (e & 1) as 0 | 1;
    hooks.onBit?.(bit, b, e);
    if (bit === 1) {
      result = result * b;
      hooks.onMultiply?.(result, b);
    }
    e = Math.floor(e / 2); // 移到下一位
    if (e > 0) {
      b = b * b;
      hooks.onSquare?.(b);
    }
  }
  return result;
}

/**
 * 递归版快速幂（便于教学对照）。同样支持取模。
 */
export function fastPowerRecursive(base: number, exp: number, mod?: number): number {
  if (exp < 0) throw new RangeError('fastPowerRecursive: exp must be non-negative');
  const m = mod === undefined ? null : Math.abs(mod);
  const mul = (x: number, y: number): number =>
    m !== null ? ((((x % m) + m) % m) * ((y % m) + m)) % m : x * y;

  const half = (b: number, e: number): number => {
    if (e === 0) return m !== null ? 1 % m : 1;
    const t = half(b, Math.floor(e / 2));
    let r = mul(t, t);
    if (e % 2 === 1) r = mul(r, b);
    return r;
  };

  const normBase = m !== null ? ((base % m) + m) % m : base;
  return half(normBase, exp);
}
