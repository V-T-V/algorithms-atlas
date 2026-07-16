// =============================================================================
// IDA* · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { idaStar, type IdaStarHooks, type IdaStarSpace, type State } from './impl.ts';

// 演示：在一条「带分叉的线性」状态空间上寻 6。
// 状态 i 的邻居：i+1，以及某些 i 可跳到较大值（产生不同 h）。
// 构造为：next(i) 返回 [i+1]，h(i)=|6-i|。start=0, goal=6。
export const DEFAULT_SPACE: IdaStarSpace = {
  start: 0,
  isGoal: (s: State) => s === 6,
  next: (s: State) => (s < 6 ? [s + 1] : []),
  h: (s: State) => Math.abs(6 - s),
};

export function buildTrace(space: IdaStarSpace = DEFAULT_SPACE): Frame[] {
  const rec = new TraceRecorder();
  const visited: State[] = [];
  let curBound = 0;

  rec
    .begin({ zh: `start=${space.start} goal 由 isGoal 判定`, en: `start=${space.start}` })
    .setAux([{ label: '初始 bound', value: String(space.h(space.start)), role: 'pivot' }])
    .commit();

  const hooks: IdaStarHooks = {
    onBound: (b) => {
      curBound = b;
      rec
        .begin({ zh: `新一轮 bound=${b}`, en: `New bound=${b}` })
        .setAux([{ label: 'bound', value: String(b), role: 'pivot' }])
        .commit();
    },
    onVisit: (s, g, f) => {
      visited.push(s);
      rec
        .begin({
          zh: `访问 ${s}: g=${g} f=${f}（bound=${curBound}）`,
          en: `Visit ${s}: g=${g} f=${f} (bound=${curBound})`,
        })
        .setBars(visited.map((v) => ({ value: v, role: 'frontier' as const })))
        .setAux([
          { label: '访问序列', value: visited.map((v) => `${v}`).join('→'), role: 'pivot' },
          { label: 'bound', value: String(curBound), role: 'compare' },
        ])
        .commit();
    },
    onPrune: (s, f) => {
      rec
        .begin({
          zh: `剪枝 ${s}: f=${f} > bound=${curBound}`,
          en: `Prune ${s}: f=${f} > bound=${curBound}`,
        })
        .setAux([{ label: '越界 f', value: String(f), role: 'warn' }])
        .commit();
    },
    onDone: (found, cost, path) => {
      rec
        .begin({
          zh: found ? `找到，代价=${cost}` : '无解',
          en: found ? `Found, cost=${cost}` : 'No solution',
        })
        .setBars(path.map((v) => ({ value: v, role: 'final' as const })))
        .setAux([{ label: '路径', value: path.map((v) => `${v}`).join('→') || '-', role: 'final' }])
        .commit();
    },
  };

  idaStar(space, hooks);

  return rec.build();
}
