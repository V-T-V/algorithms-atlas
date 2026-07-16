// =============================================================================
// Collatz 步数 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { collatzSteps, type CollatzHooks } from './impl.ts';

export const DEFAULT_INPUT = 27; // 27 有 111 步，轨迹壮观

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const traj: number[] = [];
  let result = 0;

  const snap = (note: { zh: string; en: string }, highlightLast = true): void => {
    rec
      .begin(note)
      .setBars(
        traj.length > 0
          ? traj.map((v, i) => ({
              value: v,
              role: (highlightLast && i === traj.length - 1
                ? 'compare'
                : i === 0
                  ? 'frontier'
                  : 'default') as BarRole,
              label: String(v),
            }))
          : [],
      )
      .setAux([
        {
          label: '当前值',
          value: traj.length ? String(traj[traj.length - 1]) : '∅',
          role: 'compare',
        },
        { label: '步数', value: String(traj.length - 1), role: 'final' },
      ])
      .commit();
  };

  snap({ zh: `从 ${input} 开始迭代`, en: `Start from ${input}` });

  const hooks: CollatzHooks = {
    onStep: (cur) => {
      traj.push(cur);
      snap({
        zh: `→ ${cur}（第 ${traj.length - 1} 步）`,
        en: `-> ${cur} (step ${traj.length - 1})`,
      });
    },
    onResult: (steps, full) => {
      traj.length = 0;
      traj.push(...full);
      result = steps;
      snap({ zh: `到达 1，共 ${steps} 步`, en: `Reached 1 in ${steps} steps` }, false);
    },
  };

  collatzSteps(input, hooks);

  rec
    .begin({ zh: `完成：${result} 步`, en: `Done: ${result} steps` })
    .setBars(
      traj
        .slice(-Math.min(20, traj.length))
        .map((v) => ({ value: v, role: 'final' as BarRole, label: String(v) })),
    )
    .setAux([{ label: '总步数', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
