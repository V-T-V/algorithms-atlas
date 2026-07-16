// FastHash 32 位 · 实现
export interface FastHashHooks {
  onChunk?: (i: number, m: number) => void;
}

function mix32(m: number): number {
  m = Math.imul(m, 0x9e3779b1) >>> 0;
  m = ((m << 19) | (m >>> 13)) >>> 0;
  return m;
}

export function fasthash32(
  data: string | readonly number[],
  seed: number = 0,
  hooks: FastHashHooks = {},
): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let m = seed ^ Math.imul(bytes.length, 0x9e3779b1);
  let i = 0;
  for (; i + 4 <= bytes.length; i += 4) {
    let k =
      (bytes[i]! | (bytes[i + 1]! << 8) | (bytes[i + 2]! << 16) | (bytes[i + 3]! << 24)) >>> 0;
    k = mix32(k);
    m = (m + k) >>> 0;
    m = mix32(m);
    hooks.onChunk?.(i, m);
  }
  // tail
  if (i < bytes.length) {
    let k = 0;
    let shift = 0;
    for (; i < bytes.length; i++, shift += 8) k |= bytes[i]! << shift;
    k = mix32(k);
    m = (m + k) >>> 0;
    m = mix32(m);
  }
  m ^= m >>> 16;
  m = Math.imul(m, 0x85ebca6b);
  m ^= m >>> 13;
  m = Math.imul(m, 0xc2b2ae35);
  m ^= m >>> 16;
  return m >>> 0;
}
