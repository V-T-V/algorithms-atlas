// =============================================================================
// 课程表 II · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findOrder, type CourseSchedule2Hooks } from './impl.ts';

export const DEFAULT_N = 4;
export const DEFAULT_PRE: Array<[number, number]> = [
  [1, 0],
  [2, 0],
  [3, 1],
  [3, 2],
];

export function buildTrace(
  numCourses: number = DEFAULT_N,
  prerequisites: ReadonlyArray<[number, number]> = DEFAULT_PRE,
): Frame[] {
  const rec = new TraceRecorder();
  const order: number[] = [];
  let result: number[] = [];
  let feasible = false;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = Array.from({ length: numCourses }, (_, i) =>
      order.includes(i) ? 'final' : 'default',
    );
    rec
      .begin(note)
      .setBars(Array.from({ length: numCourses }, (_, i) => ({ value: i, role: roles[i]! })))
      .setAux([
        { label: '拓扑序', value: order.length ? order.join(' → ') : '∅', role: 'frontier' },
      ])
      .commit();
  };

  snap({
    zh: `${numCourses} 门课，${prerequisites.length} 条依赖`,
    en: `${numCourses} courses, ${prerequisites.length} deps`,
  });

  const hooks: CourseSchedule2Hooks = {
    onOutput: (c, pos) => {
      order.push(c);
      snap({ zh: `输出 ${c}（第 ${pos} 位）`, en: `Output ${c} (pos ${pos})` });
    },
    onResult: (ord, feas) => {
      result = ord;
      feasible = feas;
      snap({
        zh: feas ? `完成：${ord.join(' → ')}` : '存在环',
        en: feas ? `Done: ${ord.join(' → ')}` : 'Has cycle',
      });
    },
  };

  findOrder(numCourses, prerequisites, hooks);

  rec
    .begin({ zh: feasible ? '完成' : '不可行', en: feasible ? 'Done' : 'Infeasible' })
    .setBars(Array.from({ length: numCourses }, (_, i) => ({ value: i, role: 'final' as BarRole })))
    .setAux([{ label: '顺序 / order', value: result.join(' → '), role: 'final' }])
    .commit();

  return rec.build();
}
