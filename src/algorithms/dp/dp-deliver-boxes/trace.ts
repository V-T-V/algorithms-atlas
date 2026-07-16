// =============================================================================
// 运送盒子 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { deliverBoxes, type DeliverBoxesHooks } from './impl.ts';

export const DEFAULT_PORTS = [1, 2, 1, 2, 3];
export const DEFAULT_MAX_BOXES = 3;
export const DEFAULT_MAX_PORTS = 2;

export function buildTrace(
  ports: readonly number[] = DEFAULT_PORTS,
  maxBoxes: number = DEFAULT_MAX_BOXES,
  maxPorts: number = DEFAULT_MAX_PORTS,
): Frame[] {
  const rec = new TraceRecorder();
  const n = ports.length;
  const dp: number[] = new Array<number>(n + 1).fill(-1);
  let cur = -1;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = ports.map((_, i) =>
      i === cur - 1 ? 'compare' : i < cur ? 'frontier' : 'default',
    );
    rec
      .begin(note)
      .setBars(ports.map((p, i) => ({ value: p, role: roles[i]! })))
      .setAux([
        { label: 'dp', value: dp.map((v) => (v < 0 ? '·' : v)).join(' '), role: 'frontier' },
        { label: '约束', value: `boxes≤${maxBoxes}, ports≤${maxPorts}`, role: 'pivot' },
      ])
      .commit();
  };

  snap({ zh: `ports=[${ports.join(', ')}]`, en: `ports=[${ports.join(', ')}]` });

  const hooks: DeliverBoxesHooks = {
    onFill: (i, val) => {
      dp[i] = val;
      cur = i;
      snap({ zh: `dp[${i}] = ${val}`, en: `dp[${i}] = ${val}` });
    },
    onResult: (t) => {
      ans = t;
      cur = -1;
      snap({ zh: `最少行程 = ${t}`, en: `Min trips = ${t}` });
    },
  };

  deliverBoxes(ports, maxBoxes, maxPorts, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setBars(ports.map((p) => ({ value: p, role: 'final' as BarRole })))
    .setAux([{ label: '行程 / trips', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
