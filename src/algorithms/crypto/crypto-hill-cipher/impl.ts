// =============================================================================
// 希尔密码 · 纯算法实现（2×2）
// 密钥矩阵 [[a,b],[c,d]]，行列式 det = ad-bc 必须与 26 互素。
// =============================================================================
const M = 26;
const A_UPPER = 65;

function modInverse(a: number, m: number): number | null {
  let [old_r, r] = [((a % m) + m) % m, m];
  let [old_t, t] = [1, 0];
  while (r !== 0) {
    const q = Math.floor(old_r / r);
    [old_r, r] = [r, old_r - q * r];
    [old_t, t] = [t, old_t - q * t];
  }
  if (Math.abs(old_r) !== 1) return null;
  return ((old_t % m) + m) % m;
}

export interface HillHooks {
  onPair?: (i: number, plain: [number, number], cipher: [number, number]) => void;
}

export function isHillKeyValid(a: number, b: number, c: number, d: number): boolean {
  const det = a * d - b * c;
  return modInverse(det, M) !== null;
}

export function hillEncrypt(
  text: string,
  key: readonly [number, number, number, number],
  hooks: HillHooks = {},
): string {
  const [a, b, c, d] = key;
  if (!isHillKeyValid(a, b, c, d)) throw new Error(`密钥矩阵行列式与 ${M} 不互素`);
  // 收集字母
  const vals: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const code = text[i]!.toUpperCase().charCodeAt(0);
    if (code >= A_UPPER && code < A_UPPER + M) vals.push(code - A_UPPER);
  }
  if (vals.length % 2 === 1) vals.push(23); // X
  let out = '';
  for (let i = 0; i < vals.length; i += 2) {
    const x = vals[i]!;
    const y = vals[i + 1]!;
    const ex = (((a * x + b * y) % M) + M) % M;
    const ey = (((c * x + d * y) % M) + M) % M;
    out += String.fromCharCode(A_UPPER + ex) + String.fromCharCode(A_UPPER + ey);
    hooks.onPair?.(i, [x, y], [ex, ey]);
  }
  return out;
}

export function hillDecrypt(
  text: string,
  key: readonly [number, number, number, number],
  hooks: HillHooks = {},
): string {
  const [a, b, c, d] = key;
  const det = a * d - b * c;
  const detInv = modInverse(det, M);
  if (detInv === null) throw new Error(`密钥矩阵行列式与 ${M} 不互素`);
  // 逆矩阵 = detInv * [[d,-b],[-c,a]] mod 26
  const invKey = [
    (((detInv * d) % M) + M) % M,
    (((detInv * -b) % M) + M) % M,
    (((detInv * -c) % M) + M) % M,
    (((detInv * a) % M) + M) % M,
  ] as const;
  return hillEncrypt(text, invKey, hooks);
}
