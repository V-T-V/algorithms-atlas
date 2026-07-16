import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { murmur3_128, type Murmur128Hooks } from './impl.ts';

export const DEFAULT_INPUT = 'abcdefghijklmnopqrstuvwxyz0123456789abcd';
function hex16(n: bigint): string {
  return '0x' + n.toString(16).padStart(16, '0');
}

export function buildTrace(input: string | readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const bytes = typeof input === 'string' ? Array.from(new TextEncoder().encode(input)) : input;
  const disp = typeof input === 'string' ? `"${input}"` : `[${input.join(',')}]`;
  rec
    .begin({
      zh: `输入 ${disp}（${bytes.length} 字节）`,
      en: `Input ${disp} (${bytes.length} bytes)`,
    })
    .setAux([{ label: '字节', value: String(bytes.length), role: 'pivot' as BarRole }])
    .commit();
  const blocks: Array<{ i: number; h1: bigint; h2: bigint }> = [];
  const hooks: Murmur128Hooks = { onBlock: (i, h1, h2) => blocks.push({ i, h1, h2 }) };
  const { h1: r1, h2: r2 } = murmur3_128(input, 0n, hooks);
  for (const b of blocks) {
    rec
      .begin({
        zh: `处理块 #${b.i}，h1=${hex16(b.h1)}, h2=${hex16(b.h2)}`,
        en: `Block #${b.i}, h1=${hex16(b.h1)}, h2=${hex16(b.h2)}`,
      })
      .setAux([
        { label: '块', value: String(b.i), role: 'compare' as BarRole },
        { label: 'h1', value: hex16(b.h1), role: 'frontier' as BarRole },
        { label: 'h2', value: hex16(b.h2), role: 'sorted' as BarRole },
      ])
      .commit();
  }
  if (blocks.length === 0) {
    rec
      .begin({
        zh: `输入 < 一个块大小（16 字节），走尾部路径`,
        en: `Input < one block (16 bytes), tail path`,
      })
      .setAux([{ label: '路径', value: 'tail', role: 'compare' as BarRole }])
      .commit();
  }
  rec
    .begin({
      zh: `最终 hash = ${hex16(r1)} ${hex16(r2)}`,
      en: `Final hash = ${hex16(r1)} ${hex16(r2)}`,
    })
    .setAux([
      { label: 'h1', value: hex16(r1), role: 'final' as BarRole },
      { label: 'h2', value: hex16(r2), role: 'sorted' as BarRole },
    ])
    .commit();
  return rec.build();
}
