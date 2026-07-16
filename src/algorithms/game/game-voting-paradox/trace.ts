import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { condorcetParadox } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  // 经典循环: 1/3 选民 A>B>C, 1/3 B>C>A, 1/3 C>A>B
  const R = [
    [0, 1, 2],
    [0, 1, 2],
    [1, 2, 0],
    [1, 2, 0],
    [2, 0, 1],
    [2, 0, 1],
  ];
  rec.begin({ zh: '孔多塞：3 类选民各 2 票', en: 'Condorcet: 3 voter types, 2 each' }).commit();
  const r = condorcetParadox(R, 3, {
    onPair: (a, b) =>
      rec
        .begin({ zh: `${a} 击败 ${b}`, en: `${a} beats ${b}` })
        .setAux([{ label: 'winner', value: String(a), role: 'final' as BarRole }])
        .commit(),
    onCycle: (c) =>
      rec
        .begin({ zh: c ? '检测到循环偏好！' : '无循环', en: c ? 'Cycle detected!' : 'No cycle' })
        .setAux([
          {
            label: '循环',
            value: c ? 'YES' : 'NO',
            role: c ? ('warn' as BarRole) : ('final' as BarRole),
          },
        ])
        .commit(),
  });
  void r;
  return rec.build();
}
