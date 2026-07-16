import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fasthash32, type FastHashHooks } from './impl.ts';

export const DEFAULT_INPUT = 'abcdefgh';
function hex8(n: number): string {
  return '0x' + (n >>> 0).toString(16).padStart(8, '0');
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
  const chunks: Array<{ i: number; m: number }> = [];
  const hooks: FastHashHooks = { onChunk: (i, m) => chunks.push({ i, m }) };
  const result = fasthash32(input, 0, hooks);
  for (const c of chunks) {
    rec
      .begin({ zh: `处理块 #${c.i}（消息字 ${c.m >>> 0}）`, en: `Chunk #${c.i} (m=${c.m >>> 0})` })
      .setAux([
        { label: '块', value: String(c.i), role: 'compare' as BarRole },
        { label: 'm', value: String(c.m >>> 0), role: 'frontier' as BarRole },
      ])
      .commit();
  }
  if (chunks.length === 0) {
    rec
      .begin({ zh: `输入 < 4 字节，走尾部路径`, en: `Input < 4 bytes, tail path` })
      .setAux([{ label: '路径', value: 'tail', role: 'compare' as BarRole }])
      .commit();
  }
  rec
    .begin({ zh: `最终 hash = ${hex8(result)}`, en: `Final hash = ${hex8(result)}` })
    .setAux([
      { label: 'hash', value: hex8(result), role: 'final' as BarRole },
      { label: '十进制', value: String(result), role: 'default' as BarRole },
    ])
    .commit();
  return rec.build();
}
