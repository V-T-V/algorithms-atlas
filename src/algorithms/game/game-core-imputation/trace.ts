import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { coreImputation } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  // 手套博弈: 左手套玩家[0,1], 右[2]. v(S)=min(|L∩S|,|R∩S|) (对数)
  const v = (S: number[]) => {
    const L = S.filter((p) => p < 2).length,
      R = S.filter((p) => p === 2).length;
    return Math.min(L, R);
  };
  rec.begin({ zh: '核心验证: 手套博弈', en: 'Core check: glove game' }).commit();
  const inCore = coreImputation(v, [0, 0, 1], 3, {
    onConclude: (ok) =>
      rec
        .begin({ zh: ok ? '在核心内' : '不在核心', en: ok ? 'In core' : 'Not in core' })
        .setAux([
          {
            label: '核心',
            value: ok ? 'YES' : 'NO',
            role: ok ? ('final' as BarRole) : ('warn' as BarRole),
          },
        ])
        .commit(),
  });
  void inCore;
  return rec.build();
}
