// =============================================================================
// DH密钥交换（Diffie-Hellman）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 模幂：base^exp mod m（平方-乘，避免大数溢出）。 */
function modPow(base: number, exp: number, m: number): number {
  let result = 1;
  let b = base % m;
  let e = exp;
  while (e > 0) {
    if (e & 1) result = (result * b) % m;
    b = (b * b) % m;
    e = Math.floor(e / 2);
  }
  return result;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface DiffieHellmanHooks {
  onPublic?: (who: 'Alice' | 'Bob', pub: number) => void;
  onShared?: (who: 'Alice' | 'Bob', shared: number) => void;
}

export interface DiffieHellmanResult {
  /** 公共参数 p（素数）、g（生成元）。 */
  p: number;
  g: number;
  /** Alice 公钥 A = g^a mod p。 */
  alicePublic: number;
  /** Bob 公钥 B = g^b mod p。 */
  bobPublic: number;
  /** 双方算出的共享秘密 s = B^a = A^b mod p。 */
  sharedSecret: number;
}

/**
 * Diffie-Hellman 密钥交换：双方在不安全信道上协商出共享秘密。
 *
 * 步骤：
 * 1. 公开素数 p 与生成元 g
 * 2. Alice 选私钥 a，公布 A = g^a mod p
 * 3. Bob 选私钥 b，公布 B = g^b mod p
 * 4. Alice 算 s = B^a mod p；Bob 算 s = A^b mod p → 相等
 *
 * @param p 公开素数
 * @param g 公开生成元
 * @param a Alice 私钥
 * @param b Bob 私钥
 * @param hooks 可选的事件钩子
 */
export function diffieHellman(
  p: number = 23,
  g: number = 5,
  a: number = 6,
  b: number = 15,
  hooks: DiffieHellmanHooks = {},
): DiffieHellmanResult {
  const alicePublic = modPow(g, a, p);
  hooks.onPublic?.('Alice', alicePublic);
  const bobPublic = modPow(g, b, p);
  hooks.onPublic?.('Bob', bobPublic);

  const aliceShared = modPow(bobPublic, a, p);
  hooks.onShared?.('Alice', aliceShared);
  const bobShared = modPow(alicePublic, b, p);
  hooks.onShared?.('Bob', bobShared);

  // 契约：两者必然相等
  if (aliceShared !== bobShared) throw new Error('共享秘密不一致（参数非法）');
  return { p, g, alicePublic, bobPublic, sharedSecret: aliceShared };
}
