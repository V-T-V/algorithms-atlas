export interface P13Hooks {
  onBlock?: (i: number, acc: number) => void;
}
const P = (1n << 130n) - 5n;
export function poly1305(data: number[], r: bigint, s: bigint, hooks: P13Hooks = {}): number[] {
  let acc = 0n;
  for (let i = 0; i < data.length; i += 16) {
    let n = 1n;
    for (let j = 0; j < 16 && i + j < data.length; j++)
      n += BigInt(data[i + j]!) << (8n * BigInt(j));
    acc = ((acc + n) * r) % P;
    hooks.onBlock?.(i / 16, Number(acc & 0xffffffffn));
  }
  acc = (acc + s) % (1n << 128n);
  const out: number[] = [];
  for (let j = 0; j < 16; j++) out.push(Number((acc >> (8n * BigInt(j))) & 0xffn));
  return out;
}
