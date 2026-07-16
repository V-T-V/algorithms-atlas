// =============================================================================
// 课程表 · 录制帧序列
import type { BarRole, GraphEdge, GraphNode, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { canFinish, type CoursesScheduleHooks } from './impl.ts';

export const DEFAULT_N = 4;
export const DEFAULT_PRE: Array<[number, number]> = [
  [1, 0],
  [2, 1],
  [3, 2],
];

const posOf = (i: number, total: number): { x: number; y: number } => {
  const ang = -Math.PI / 2 + (i * 2 * Math.PI) / Math.max(total, 1);
  return { x: 0.5 + 0.32 * Math.cos(ang), y: 0.5 + 0.32 * Math.sin(ang) };
};

export function buildTrace(
  numCourses: number = DEFAULT_N,
  prerequisites: ReadonlyArray<[number, number]> = DEFAULT_PRE,
): Frame[] {
  const rec = new TraceRecorder();
  const taken = new Set<number>();
  const inDeg = new Map<number, number>();
  for (let i = 0; i < numCourses; i++) inDeg.set(i, 0);
  for (const [a] of prerequisites) inDeg.set(a, (inDeg.get(a) ?? 0) + 1);
  let cur = -1;
  let ok = false;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = Array.from({ length: numCourses }, (_, i) => {
      let role: BarRole = 'default';
      if (i === cur) role = 'compare';
      else if (taken.has(i)) role = 'final';
      const p = posOf(i, numCourses);
      return { id: `${i}`, label: `${i}(${inDeg.get(i) ?? 0})`, x: p.x, y: p.y, role };
    });
    const edges: GraphEdge[] = prerequisites.map(([a, b]) => ({
      from: `${b}`,
      to: `${a}`,
      directed: true,
      role: (taken.has(b) ? 'final' : 'default') as BarRole,
    }));
    rec.begin(note).setGraph(nodes, edges).commit();
  };

  render({
    zh: `${numCourses} 门课，${prerequisites.length} 条依赖`,
    en: `${numCourses} courses, ${prerequisites.length} deps`,
  });

  const hooks: CoursesScheduleHooks = {
    onTake: (c) => {
      cur = c;
      taken.add(c);
      // 更新入度显示（实际减在算法里完成，这里同步）
      render({ zh: `修课 ${c}`, en: `Take ${c}` });
    },
    onResult: (r) => {
      ok = r;
      cur = -1;
      render({ zh: r ? '可完成' : '存在环', en: r ? 'Feasible' : 'Has cycle' });
    },
  };

  const result = canFinish(numCourses, prerequisites, hooks);
  void ok;

  rec
    .begin({ zh: result ? '可完成' : '不可完成', en: result ? 'Feasible' : 'Infeasible' })
    .setAux([{ label: '结果', value: result ? 'true' : 'false', role: 'final' }])
    .commit();

  return rec.build();
}
