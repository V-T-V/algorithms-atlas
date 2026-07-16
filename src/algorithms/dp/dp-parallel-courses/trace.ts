// =============================================================================
// 并行课程 · 录制帧序列
import type { BarRole, GraphEdge, GraphNode, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { parallelCourses, type ParallelCoursesHooks } from './impl.ts';

export const DEFAULT_N = 3;
export const DEFAULT_RELATIONS: Array<[number, number]> = [
  [1, 2],
  [2, 3],
];

const POS: Record<number, { x: number; y: number }> = {
  1: { x: 0.2, y: 0.5 },
  2: { x: 0.5, y: 0.5 },
  3: { x: 0.8, y: 0.5 },
};

export function buildTrace(
  n: number = DEFAULT_N,
  relations: ReadonlyArray<[number, number]> = DEFAULT_RELATIONS,
): Frame[] {
  const rec = new TraceRecorder();
  const dist = new Map<number, number>();
  for (let i = 1; i <= n; i++) dist.set(i, 1);
  const finished = new Set<number>();
  let curLayer: number[] = [];
  let ans = 0;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = [];
    for (let i = 1; i <= n; i++) {
      let role: BarRole = 'default';
      if (finished.has(i)) role = 'final';
      else if (curLayer.includes(i)) role = 'compare';
      const p = POS[i] ?? { x: 0.5, y: 0.5 };
      nodes.push({ id: `${i}`, label: `${i}(${dist.get(i)})`, x: p.x, y: p.y, role });
    }
    const edges: GraphEdge[] = relations.map(([u, v]) => ({
      from: `${u}`,
      to: `${v}`,
      directed: true,
      role: (finished.has(u) ? 'final' : 'default') as BarRole,
    }));
    rec.begin(note).setGraph(nodes, edges).commit();
  };

  render({
    zh: `${n} 门课，依赖 ${relations.length} 条`,
    en: `${n} courses, ${relations.length} deps`,
  });

  const hooks: ParallelCoursesHooks = {
    onLayer: (_r, layer) => {
      curLayer = layer;
      render({
        zh: `学期 ${_r}：修 ${layer.join(', ')}`,
        en: `Semester ${_r}: ${layer.join(', ')}`,
      });
      layer.forEach((x) => finished.add(x));
      render({ zh: `学期 ${_r} 完成`, en: `Semester ${_r} done` });
    },
    onResult: (s) => {
      ans = s;
      curLayer = [];
      render({ zh: `最少学期 = ${s}`, en: `Min semesters = ${s}` });
    },
  };

  parallelCourses(n, relations, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setGraph(
      Array.from({ length: n }, (_, i) => {
        const id = `${i + 1}`;
        const p = POS[i + 1] ?? { x: 0.5, y: 0.5 };
        return { id, label: id, x: p.x, y: p.y, role: 'final' as BarRole };
      }),
      relations.map(([u, v]) => ({
        from: `${u}`,
        to: `${v}`,
        directed: true,
        role: 'final' as BarRole,
      })),
    )
    .setAux([{ label: '学期数', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
