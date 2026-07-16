// CRC32 · 实现 (table-driven, IEEE 802.3)
export interface CrcHooks {
  onByte?: (i: number, byte: number, crc: number) => void;
  onConclude?: (crc: number) => void;
}
let table: number[] | null = null;
function buildTable(): number[] {
  if (table) return table;
  table = new Array<number>(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
}
export function crc32(data: string, hooks: CrcHooks = {}): number {
  const t = buildTable();
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ t[(crc ^ data.charCodeAt(i)) & 0xff]!;
    hooks.onByte?.(i, data.charCodeAt(i), (crc ^ 0xffffffff) >>> 0);
  }
  const out = (crc ^ 0xffffffff) >>> 0;
  hooks.onConclude?.(out);
  return out;
}
