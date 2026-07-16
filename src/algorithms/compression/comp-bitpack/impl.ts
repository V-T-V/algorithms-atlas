export interface BpHooks {
  onWrite?: (val: number, bits: string) => void;
  onFlush?: (bytes: number) => void;
}
export function bitPack(
  values: number[],
  width: number,
  hooks: BpHooks = {},
): { bytes: number[]; stream: string } {
  let stream = '';
  for (const v of values) {
    hooks.onWrite?.(v, v.toString(2).padStart(width, '0'));
    stream += v.toString(2).padStart(width, '0');
  }
  while (stream.length % 8 !== 0) stream += '0';
  const bytes: number[] = [];
  for (let i = 0; i < stream.length; i += 8) bytes.push(parseInt(stream.slice(i, i + 8), 2));
  hooks.onFlush?.(bytes.length);
  return { bytes, stream };
}
export function bitUnpack(bytes: number[], width: number, count: number): number[] {
  const stream = bytes.map((b) => b.toString(2).padStart(8, '0')).join('');
  const out: number[] = [];
  for (let i = 0; i < count; i++) out.push(parseInt(stream.slice(i * width, (i + 1) * width), 2));
  return out;
}
