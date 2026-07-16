import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { xxh3_64, type XXH3Hooks } from './impl.ts';

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
  const blocks: Array<{ i: number; acc: bigint }> = [];
  const hooks: XXH3Hooks = { onBlock: (i, acc) => blocks.push({ i, acc }) };
  const result = xxh3_64(input, 0n, hooks);
  for (const b of blocks) {
    rec
      .begin({
        zh: `处理块 #${b.i}，累加器 = ${hex16(b.acc)}`,
        en: `Block #${b.i}, acc = ${hex16(b.acc)}`,
      })
      .setAux([
        { label: '块', value: String(b.i), role: 'compare' as BarRole },
        { label: 'acc', value: hex16(b.acc), role: 'frontier' as BarRole },
      ])
      .commit();
  }
  if (blocks.length === 0) {
    rec
      .begin({ zh: `输入 < 一个块大小，直接混合`, en: `Input < one block, direct mix` })
      .setAux([{ label: '路径', value: 'short', role: 'compare' as BarRole }])
      .commit();
  }
  rec
    .begin({ zh: `最终 hash = ${hex16(result)}`, en: `Final hash = ${hex16(result)}` })
    .setAux([
      { label: 'hash', value: hex16(result), role: 'final' as BarRole },
      { label: '十进制', value: result.toString(), role: 'default' as BarRole },
    ])
    .commit();
  return rec.build();
}
