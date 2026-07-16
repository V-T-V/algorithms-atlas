import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { SkipList, type SkipListHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 1, 7, 5, 9, 2, 8];

// 用确定 RNG 让层数稳定可重现
function makeRng(): () => number {
  let state = 1;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const sl = new SkipList(makeRng());

  rec
    .begin({ zh: '空跳表', en: 'Empty skip list' })
    .setAux([{ label: '规模', value: '0', role: 'frontier' }])
    .commit();

  for (const v of input) {
    let lvl = 0;
    const hooks: SkipListHooks = {
      onInsert: (_value, l) => {
        lvl = l;
      },
    };
    sl.insert(v, hooks);
    const vals = sl.values();
    rec
      .begin({ zh: `插入 ${v} (level=${lvl})`, en: `Insert ${v} (level=${lvl})` })
      .setBars(vals.map((x) => ({ value: x, role: (x === v ? 'compare' : 'sorted') as BarRole })))
      .setAux([
        { label: '规模', value: String(sl.size), role: 'final' },
        { label: '最高层', value: String(sl.level), role: 'compare' },
      ])
      .commit();
  }

  rec
    .begin({ zh: `最终：${sl.size} 项`, en: `Final: ${sl.size} items` })
    .setBars(sl.values().map((x) => ({ value: x, role: 'sorted' as BarRole })))
    .setAux([
      { label: '规模', value: String(sl.size), role: 'final' },
      { label: '有序列表', value: `[${sl.values().join(',')}]`, role: 'sorted' },
    ])
    .commit();

  return rec.build();
}
