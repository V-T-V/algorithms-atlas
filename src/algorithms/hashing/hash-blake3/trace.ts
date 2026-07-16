import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { blake3, type Blake3Hooks } from './impl.ts';

export const DEFAULT_INPUT = 'hello';
function hex16(n: bigint): string {
  return n.toString(16).padStart(16, '0');
}

export function buildTrace(input: string | readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const bytes = typeof input === 'string' ? Array.from(new TextEncoder().encode(input)) : input;
  const disp = typeof input === 'string' ? `"${input}"` : `[${input.join(',')}]`;
  rec
    .begin({
      zh: `输入 ${disp}（${bytes.length} 字节），BLAKE3-256`,
      en: `Input ${disp} (${bytes.length} bytes), BLAKE3-256`,
    })
    .setAux([{ label: '字节', value: String(bytes.length), role: 'pivot' as BarRole }])
    .commit();
  const blocks: number[] = [];
  const hooks: Blake3Hooks = { onBlock: (i) => blocks.push(i) };
  const result = blake3(input, hooks);
  for (const i of blocks) {
    rec
      .begin({
        zh: `压缩块 #${i}（链式 Merkle 树模式）`,
        en: `Compress block #${i} (chained Merkle tree)`,
      })
      .setAux([{ label: '块', value: String(i), role: 'compare' as BarRole }])
      .commit();
  }
  const hex = result.map(hex16).join('');
  rec
    .begin({ zh: `最终 256 位`, en: `Final 256-bit` })
    .setAux([{ label: 'hash', value: hex, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
