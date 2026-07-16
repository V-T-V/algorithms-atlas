// =============================================================================
// 仿射密码（Affine Cipher）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

const ALPHA_LEN = 26;
const A_UPPER = 65; // 'A'
const A_LOWER = 97; // 'a'

/** 把 n 规范化到 [0, m)（处理负数）。 */
function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

/** 扩展欧几里得：求 a 在模 m 下的乘法逆元，不存在返回 null。 */
function modInverse(a: number, m: number): number | null {
  let [old, cur] = [m, mod(a, m)];
  let [x0, x1] = [0, 1];
  while (cur !== 0) {
    const q = Math.floor(old / cur);
    [old, cur] = [cur, old - q * cur];
    [x0, x1] = [x1, x0 - q * x1];
  }
  if (old !== 1) return null; // 不互素
  return mod(x0, m);
}

/** 判断 a 与 26 是否互素（仿射密钥要求）。 */
export function isCoprimeWith26(a: number): boolean {
  return modInverse(a, ALPHA_LEN) !== null;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface AffineHooks {
  onChar?: (i: number, original: string) => void;
  onEncrypt?: (i: number, original: string, enc: string) => void;
  onSkip?: (i: number, ch: string) => void;
}

export interface AffineResult {
  text: string;
  chars: string[];
}

/**
 * 仿射密码：E(x) = (a*x + b) mod 26。
 * 仅作用于英文字母；非字母原样保留。
 * @param text 明文
 * @param a 乘数（须与 26 互素，否则抛错）
 * @param b 位移
 * @param hooks 可选的事件钩子
 */
export function affine(text: string, a: number, b: number, hooks: AffineHooks = {}): AffineResult {
  if (!isCoprimeWith26(a)) throw new Error(`a=${a} 与 26 不互素，不能作为仿射密钥`);
  const chars: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const code = ch.charCodeAt(0);
    hooks.onChar?.(i, ch);
    let enc: string;
    if (code >= A_UPPER && code < A_UPPER + ALPHA_LEN) {
      enc = String.fromCharCode(A_UPPER + mod(a * (code - A_UPPER) + b, ALPHA_LEN));
      chars.push(enc);
      hooks.onEncrypt?.(i, ch, enc);
    } else if (code >= A_LOWER && code < A_LOWER + ALPHA_LEN) {
      enc = String.fromCharCode(A_LOWER + mod(a * (code - A_LOWER) + b, ALPHA_LEN));
      chars.push(enc);
      hooks.onEncrypt?.(i, ch, enc);
    } else {
      chars.push(ch);
      hooks.onSkip?.(i, ch);
    }
  }
  return { text: chars.join(''), chars };
}

/** 仿射解密：D(y) = a^{-1} * (y - b) mod 26。 */
export function affineDecipher(
  text: string,
  a: number,
  b: number,
  hooks: AffineHooks = {},
): AffineResult {
  const aInv = modInverse(a, ALPHA_LEN);
  if (aInv === null) throw new Error(`a=${a} 与 26 不互素，无逆元`);
  const chars: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const code = ch.charCodeAt(0);
    hooks.onChar?.(i, ch);
    let dec: string;
    if (code >= A_UPPER && code < A_UPPER + ALPHA_LEN) {
      dec = String.fromCharCode(A_UPPER + mod(aInv * (code - A_UPPER - b), ALPHA_LEN));
      chars.push(dec);
      hooks.onEncrypt?.(i, ch, dec);
    } else if (code >= A_LOWER && code < A_LOWER + ALPHA_LEN) {
      dec = String.fromCharCode(A_LOWER + mod(aInv * (code - A_LOWER - b), ALPHA_LEN));
      chars.push(dec);
      hooks.onEncrypt?.(i, ch, dec);
    } else {
      chars.push(ch);
      hooks.onSkip?.(i, ch);
    }
  }
  return { text: chars.join(''), chars };
}
