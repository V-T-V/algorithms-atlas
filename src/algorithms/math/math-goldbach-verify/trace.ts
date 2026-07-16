import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { goldbachVerify, type GoldbachHooks } from './impl.ts';

export const DEFAULT_N = 20;

export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  let validCount = 0;

  rec
    .begin({ zh: `验证 4..${n}`, en: `Verify 4..${n}` })
    .setAux([{ label: '阶段', value: '开始', role: 'frontier' }])
    .commit();

  const hooks: GoldbachHooks = {
    onCheck: (even, ok, repr) => {
      if (ok) validCount++;
      rec
        .begin({
          zh: `${even} = ${ok ? `${repr![0]}+${repr![1]}` : '失败'}`,
          en: `${even} = ${ok ? `${repr![0]}+${repr![1]}` : 'fail'}`,
        })
        .setBars([{ value: even, role: (ok ? 'final' : 'warn') as BarRole }])
        .setAux([
          { label: '偶数', value: String(even), role: 'frontier' },
          {
            label: '分解',
            value: ok ? `${repr![0]}+${repr![1]}` : '失败',
            role: ok ? 'final' : ('warn' as BarRole),
          },
        ])
        .commit();
    },
  };

  const { valid, representations } = goldbachVerify(n, hooks);

  rec
    .begin({
      zh: `共 ${representations.length} 个，全部成立=${valid}`,
      en: `${representations.length} evens, all=${valid}`,
    })
    .setAux([
      { label: '总成立', value: String(valid), role: valid ? 'final' : ('warn' as BarRole) },
    ])
    .commit();

  return rec.build();
}
