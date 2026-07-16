// =============================================================================
// 打开转盘锁 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { openLock, type OpenLockHooks } from './impl.ts';

export const DEFAULT_DEADENDS = ['0201', '0101', '0102', '1212', '2002'];
export const DEFAULT_TARGET = '0202';

export function buildTrace(
  deadends: string[] = DEFAULT_DEADENDS,
  target: string = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  let ans = 0;

  const snap = (note: { zh: string; en: string }, state: string, dist: number): void => {
    const digits = state.split('').map(Number);
    const roles: BarRole[] = digits.map((d) => (d === 0 ? 'default' : 'frontier'));
    rec
      .begin(note)
      .setBars(digits.map((d, i) => ({ value: d, role: roles[i]!, label: `${i}` })))
      .setAux([
        { label: '当前状态', value: state, role: 'compare' },
        { label: '步数', value: String(dist), role: 'frontier' },
        { label: '目标', value: target, role: 'pivot' },
        { label: '死锁', value: deadends.join(', ') || '∅', role: 'warn' },
      ])
      .commit();
  };

  snap({ zh: `从 0000 到 ${target}`, en: `From 0000 to ${target}` }, '0000', 0);

  const hooks: OpenLockHooks = {
    onVisit: (state, dist) =>
      snap({ zh: `访问 ${state}（${dist} 步）`, en: `Visit ${state} (${dist})` }, state, dist),
    onResult: (t) => {
      ans = t;
    },
  };

  const result = openLock(deadends, target, hooks);

  rec
    .begin({
      zh: result < 0 ? '无法打开' : `完成：${result} 步`,
      en: result < 0 ? 'Cannot open' : `Done: ${result} steps`,
    })
    .setBars(target.split('').map((c) => ({ value: Number(c), role: 'final' as BarRole })))
    .setAux([{ label: '步数 / steps', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
