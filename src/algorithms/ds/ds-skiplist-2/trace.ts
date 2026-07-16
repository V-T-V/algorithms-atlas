// =============================================================================
// 跳表 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { SkipList2, type SkipListHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 1, 7, 5, 9, 2, 8, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const list = new SkipList2();
  let maxLevel = 0;

  for (const v of input) {
    list.insert(v);
    maxLevel = list.maxLevel;
    rec
      .begin({
        zh: `插入 ${v}（当前层数=${list.maxLevel}）`,
        en: `Insert ${v} (levels=${list.maxLevel})`,
      })
      .setBars(list.toArray().map((x) => ({ value: x, role: 'frontier' })))
      .setAux([
        { label: 'size', value: String(list.maxSize), role: 'frontier' },
        { label: 'maxLevel', value: String(maxLevel), role: 'pivot' },
      ])
      .commit();
  }

  const arr = list.toArray();
  rec
    .begin({ zh: `跳表完成：[${arr.join(',')}]`, en: `Skip list: [${arr.join(',')}]` })
    .setBars(arr.map((x) => ({ value: x, role: 'final' })))
    .commit();

  void (undefined as unknown as SkipListHooks);
  return rec.build();
}
