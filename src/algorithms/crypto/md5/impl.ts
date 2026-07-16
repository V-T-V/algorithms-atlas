// =============================================================================
// MD5哈希（MD5）· 纯算法实现（教学简化版）
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 注意：本实现为缩减轮数演示版，产出不是标准 MD5；用于演示 Merkle–Damgård
// 迭代与四组非线性函数 F/G/H/I 的压缩结构。
// =============================================================================

/** 32 位无符号左循环移位。 */
function rotl(x: number, c: number): number {
  x = x >>> 0;
  return (((x << c) | (x >>> (32 - c))) & 0xffffffff) >>> 0;
}
/** 转无符号 32 位。 */
const u32 = (x: number): number => x >>> 0;

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface Md5Hooks {
  /** 第 i 步（0~63）处理后的累加器快照。 */
  onStep?: (i: number, a: number, b: number, c: number, d: number) => void;
}

export interface Md5Result {
  /** 16 字节（128 位）摘要。 */
  digest: number[];
}

// MD5 非线性函数
const F = (x: number, y: number, z: number): number => (x & y) | (~x & z);
const G = (x: number, y: number, z: number): number => (x & z) | (y & ~z);
const H = (x: number, y: number, z: number): number => x ^ y ^ z;
const I = (x: number, y: number, z: number): number => y ^ (x | ~z);

// 每组的循环左移位数
const S = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14,
  20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6,
  10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
];
// 常量表 K[i] = floor(2^32 * |sin(i+1)|)
const K: readonly number[] = [
  0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
  0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
  0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
  0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
  0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
  0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
  0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
  0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391,
];

/**
 * MD5：对消息字节做 padding、分块、64 步压缩，输出 16 字节摘要。
 * @param input 消息字节
 * @param hooks 可选的事件钩子
 */
export function md5(input: number[], hooks: Md5Hooks = {}): Md5Result {
  // 1. 填充：补 0x80，再补 0x00 至长度 ≡ 56 mod 64，末 8 字节为比特长度
  const msg = [...input];
  const bitLen = msg.length * 8;
  msg.push(0x80);
  while (msg.length % 64 !== 56) msg.push(0x00);
  for (let s = 0; s < 8; s++) msg.push((bitLen >>> (8 * s)) & 0xff);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let off = 0; off < msg.length; off += 64) {
    const M: number[] = new Array<number>(16);
    for (let j = 0; j < 16; j++) {
      M[j] =
        ((msg[off + j * 4]! |
          (msg[off + j * 4 + 1]! << 8) |
          (msg[off + j * 4 + 2]! << 16) |
          (msg[off + j * 4 + 3]! << 24)) >>>
          0) >>>
        0;
    }
    let A = a0;
    let B = b0;
    let C = c0;
    let D = d0;
    for (let i = 0; i < 64; i++) {
      let f: number;
      let g: number;
      if (i < 16) {
        f = F(B, C, D);
        g = i;
      } else if (i < 32) {
        f = G(B, C, D);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = H(B, C, D);
        g = (3 * i + 5) % 16;
      } else {
        f = I(B, C, D);
        g = (7 * i) % 16;
      }
      f = u32(u32(u32(A + (f >>> 0)) + K[i]!) + M[g]!);
      A = D;
      D = C;
      C = B;
      B = u32(B + rotl(f, S[i]!));
      hooks.onStep?.(i, A, B, C, D);
    }
    a0 = u32(a0 + A);
    b0 = u32(b0 + B);
    c0 = u32(c0 + C);
    d0 = u32(d0 + D);
  }

  const digest: number[] = [];
  for (const v of [a0, b0, c0, d0]) {
    digest.push(v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff);
  }
  return { digest };
}
