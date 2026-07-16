// 瓷砖可能性 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btTilesPossibilities, type BtTilesPossibilitiesHooks } from './impl.ts';

export const DEFAULT_INPUT = 'AAB';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const codes = Array.from(input).map((c) => c.charCodeAt(0));

  rec
    .begin({ zh: `瓷砖「${input}」可组成的序列数`, en: `Sequences from tiles "${input}"` })
    .setArray(
      codes,
      codes.map(() => 'default' as BarRole),
      [],
    )
    .commit();

  const hooks: BtTilesPossibilitiesHooks = {
    onCount: (total) => {
      rec
        .begin({ zh: `累计 ${total} 个序列`, en: `${total} sequences so far` })
        .setBars([{ value: total, role: 'pivot' as BarRole }])
        .setAux([{ label: 'count', value: String(total), role: 'final' }])
        .commit();
    },
  };

  const result = btTilesPossibilities(input, hooks);

  rec
    .begin({ zh: `完成：共 ${result} 个`, en: `Done: ${result} sequences` })
    .setBars([{ value: result, role: 'final' as BarRole }])
    .setAux([{ label: '总数', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
