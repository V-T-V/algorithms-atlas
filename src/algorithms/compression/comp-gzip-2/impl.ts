// gzip v2 · 实现（CRC32 + 头/尾包装）
export interface GzipResult {
  header: number[];
  payloadSize: number;
  crc32: number;
  size: number;
}
export interface GzipHooks {
  onHeader?: (header: number[]) => void;
  onCrc?: (crc: number) => void;
}
const CRC_TABLE: number[] = (() => {
  const t: number[] = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t.push(c);
  }
  return t;
})();
export function crc32(data: number[]): number {
  let c = 0xffffffff;
  for (const b of data) c = CRC_TABLE[(c ^ b) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
export function gzipWrap(input: string, payloadSize: number, hooks: GzipHooks = {}): GzipResult {
  const codes = input.split('').map((c) => c.charCodeAt(0));
  const header = [0x1f, 0x8b, 0x08, 0x00, 0, 0, 0, 0, 0, 0x03]; // magic + DEFLATE + unix
  hooks.onHeader?.(header);
  const crc = crc32(codes);
  hooks.onCrc?.(crc);
  return { header, payloadSize, crc32: crc, size: codes.length };
}
