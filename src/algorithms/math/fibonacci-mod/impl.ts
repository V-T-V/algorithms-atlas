// =============================================================================
// 斐波那契取模·矩阵快速幂
// [[1,1],[1,0]]^n = [[F(n+1), F(n)], [F(n), F(n-1)]]
// 用二进制快速幂，所有运算 mod m。支持 n 为 BigInt 以处理 1e18 等大指数。
// =============================================================================

export interface FibModHooks {
  onSquare?: (exp: bigint) => void;
  onMultiply?: (note: string) => void;
  onResult?: (value: number) => void;
}

export interface FibModResult {
  /** F(n) mod m。 */
  value: number;
}

type Mat = [[number, number], [number, number]];

function mul(a: Mat, b: Mat, m: number): Mat {
  const a00 = a[0]![0]!,
    a01 = a[0]![1]!,
    a10 = a[1]![0]!,
    a11 = a[1]![1]!;
  const b00 = b[0]![0]!,
    b01 = b[0]![1]!,
    b10 = b[1]![0]!,
    b11 = b[1]![1]!;
  return [
    [(a00 * b00 + a01 * b10) % m, (a00 * b01 + a01 * b11) % m],
    [(a10 * b00 + a11 * b10) % m, (a10 * b01 + a11 * b11) % m],
  ];
}

/** F(n) mod m。n 可为任意非负整数（用 BigInt 接收大指数）。 */
export function fibMod(n: bigint | number, m: number, hooks: FibModHooks = {}): FibModResult {
  if (m <= 0) throw new Error('模数 m 必须 > 0');
  const N = typeof n === 'number' ? BigInt(n) : n;
  if (N < 0n) throw new Error('n 不能为负');
  // 单位矩阵
  let result: Mat = [
    [1, 0],
    [0, 1],
  ];
  let base: Mat = [
    [1, 1],
    [1, 0],
  ];
  let exp = N;
  while (exp > 0n) {
    if (exp & 1n) {
      result = mul(result, base, m);
      hooks.onMultiply?.('result *= base');
    }
    base = mul(base, base, m);
    hooks.onSquare?.(exp);
    hooks.onMultiply?.('base *= base');
    exp >>= 1n;
  }
  // result = [[1,1],[1,0]]^N，F(N) = result[0][1] = result[1][0]
  const value = result[0]![1]!;
  hooks.onResult?.(value);
  return { value };
}
