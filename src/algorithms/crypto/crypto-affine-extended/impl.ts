// =============================================================================
// 扩展仿射密码 · 纯算法实现
// E(x) = (a*x + b) mod 26，D(y) = aInv*(y - b) mod 26
// =============================================================================
const M = 26;
const A_UPPER = 65;
const A_LOWER = 97;

/** 扩展欧几里得求 a 在模 m 下的逆元，不存在返回 null。 */
function modInverse(a: number, m: number): number | null {
  let [old_r, r] = [a % m, m];
  let [old_t, t] = [1, 0];
  while (r !== 0) {
    const q = Math.floor(old_r / r);
    [old_r, r] = [r, old_r - q * r];
    [old_t, t] = [t, old_t - q * t];
  }
  if (old_r !== 1 && old_r !== -1) return null; // 不互素
  return ((old_t % m) + m) % m;
}

export interface AffineExtHooks {
  onChar?: (i: number, original: string, mapped: string) => void;
}

/** 校验密钥 (a,b) 合法性：a 必须与 26 互素。 */
export function isValidAffineKey(a: number): boolean {
  return modInverse(a, M) !== null;
}

export function affineEncrypt(
  text: string,
  a: number,
  b: number,
  hooks: AffineExtHooks = {},
): string {
  const aInv = modInverse(a, M);
  if (aInv === null) throw new Error(`a=${a} 与 26 不互素，非合法密钥`);
  void aInv;
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const code = ch.charCodeAt(0);
    let mapped = ch;
    if (code >= A_UPPER && code < A_UPPER + M) {
      mapped = String.fromCharCode(A_UPPER + ((((a * (code - A_UPPER) + b) % M) + M) % M));
    } else if (code >= A_LOWER && code < A_LOWER + M) {
      mapped = String.fromCharCode(A_LOWER + ((((a * (code - A_LOWER) + b) % M) + M) % M));
    }
    out += mapped;
    hooks.onChar?.(i, ch, mapped);
  }
  return out;
}

export function affineDecrypt(
  text: string,
  a: number,
  b: number,
  hooks: AffineExtHooks = {},
): string {
  const aInv = modInverse(a, M);
  if (aInv === null) throw new Error(`a=${a} 与 26 不互素，非合法密钥`);
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const code = ch.charCodeAt(0);
    let mapped = ch;
    if (code >= A_UPPER && code < A_UPPER + M) {
      mapped = String.fromCharCode(A_UPPER + ((((aInv * (code - A_UPPER - b)) % M) + M) % M));
    } else if (code >= A_LOWER && code < A_LOWER + M) {
      mapped = String.fromCharCode(A_LOWER + ((((aInv * (code - A_LOWER - b)) % M) + M) % M));
    }
    out += mapped;
    hooks.onChar?.(i, ch, mapped);
  }
  return out;
}
