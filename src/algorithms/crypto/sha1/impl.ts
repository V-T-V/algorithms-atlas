// =============================================================================
// SHA-1哈希（SHA-1）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 32 位无符号左循环移位。 */
function rotl(x: number, c: number): number {
  x = x >>> 0;
  return (((x << c) | (x >>> (32 - c))) & 0xffffffff) >>> 0;
}
const u32 = (x: number): number => x >>> 0;

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface Sha1Hooks {
  /** 第 t 步（0~79）处理后的累加器快照。 */
  onStep?: (t: number, h: number[]) => void;
}

export interface Sha1Result {
  /** 20 字节（160 位）摘要。 */
  digest: number[];
}

/**
 * SHA-1：分组 512 位、80 步压缩，输出 160 位摘要。
 * @param input 消息字节
 * @param hooks 可选的事件钩子
 */
export function sha1(input: number[], hooks: Sha1Hooks = {}): Sha1Result {
  // 1. 填充：补 0x80，补 0x00 至长度 ≡ 56 mod 64，末 8 字节为大端比特长度
  const msg = [...input];
  const bitLen = msg.length * 8;
  msg.push(0x80);
  while (msg.length % 64 !== 56) msg.push(0x00);
  // 大端长度（这里假设 bitLen < 2^32）
  msg.push(
    ...[
      0,
      0,
      0,
      0,
      (bitLen >>> 24) & 0xff,
      (bitLen >>> 16) & 0xff,
      (bitLen >>> 8) & 0xff,
      bitLen & 0xff,
    ],
  );

  let [h0, h1, h2, h3, h4] = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  for (let off = 0; off < msg.length; off += 64) {
    const w: number[] = new Array<number>(80);
    for (let i = 0; i < 16; i++) {
      w[i] = u32(
        (msg[off + i * 4]! << 24) |
          (msg[off + i * 4 + 1]! << 16) |
          (msg[off + i * 4 + 2]! << 8) |
          msg[off + i * 4 + 3]!,
      );
    }
    for (let i = 16; i < 80; i++) {
      w[i] = rotl(w[i - 3]! ^ w[i - 8]! ^ w[i - 14]! ^ w[i - 16]!, 1);
    }

    let [a, b, c, d, e] = [h0, h1, h2, h3, h4];
    for (let t = 0; t < 80; t++) {
      let f: number;
      let k: number;
      if (t < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (t < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (t < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }
      const tmp = u32(u32(u32(rotl(a, 5) + (f >>> 0)) + e) + k + w[t]!);
      e = d;
      d = c;
      c = rotl(b, 30);
      b = a;
      a = tmp;
      hooks.onStep?.(t, [a, b, c, d, e]);
    }
    h0 = u32(h0 + a);
    h1 = u32(h1 + b);
    h2 = u32(h2 + c);
    h3 = u32(h3 + d);
    h4 = u32(h4 + e);
  }

  const digest: number[] = [];
  for (const v of [h0, h1, h2, h3, h4]) {
    digest.push((v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff);
  }
  return { digest };
}
