import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateRcu } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: 'RCU', en: 'RCU' })
    .setAux([{ label: 'version', value: '1', role: 'compare' as BarRole }])
    .commit();
  simulateRcu(
    [
      { thread: 0, action: 'read-enter' },
      { thread: 1, action: 'update' }, // 旧版本待回收
      { thread: 1, action: 'synchronize' }, // 读者 T0 仍在
      { thread: 0, action: 'read-exit' },
      { thread: 1, action: 'synchronize' }, // 宽限期过，回收
    ],
    {
      onUpdate: (t, v) =>
        rec
          .begin({ zh: `T${t} 更新→v${v}`, en: `T${t} update→v${v}` })
          .setAux([{ label: 'version', value: String(v), role: 'final' as BarRole }])
          .commit(),
      onGracePeriod: (t, n) =>
        rec
          .begin({ zh: `T${t} 宽限期：回收${n}`, en: `T${t} grace: reclaim ${n}` })
          .setAux([
            { label: 'reclaim', value: String(n), role: n > 0 ? 'final' : ('warn' as BarRole) },
          ])
          .commit(),
    },
  );
  return rec.build();
}
