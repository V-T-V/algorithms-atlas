// =============================================================================
// 地标最短路（ALT）· 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  landmarkShortestPath,
  precomputeLandmarks,
  type LandmarkHooks,
  type WeightedGraphInput,
} from './impl.ts';

export const DEFAULT_INPUT: WeightedGraphInput = {
  nodes: ['S', 'A', 'B', 'C', 'D', 'T'],
  edges: [
    { from: 'S', to: 'A', weight: 4 },
    { from: 'S', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'B', to: 'C', weight: 8 },
    { from: 'B', to: 'D', weight: 10 },
    { from: 'C', to: 'D', weight: 2 },
    { from: 'C', to: 'T', weight: 6 },
    { from: 'D', to: 'T', weight: 3 },
  ],
};
const POS: Record<string, { x: number; y: number }> = {
  S: { x: 0.1, y: 0.5 },
  A: { x: 0.35, y: 0.2 },
  B: { x: 0.35, y: 0.8 },
  C: { x: 0.6, y: 0.2 },
  D: { x: 0.6, y: 0.8 },
  T: { x: 0.9, y: 0.5 },
};
export const DEFAULT_LANDMARKS = ['S', 'T'];
export const DEFAULT_SOURCE = 'S';
export const DEFAULT_TARGET = 'T';

export function buildTrace(
  input: WeightedGraphInput = DEFAULT_INPUT,
  landmarks: readonly string[] = DEFAULT_LANDMARKS,
  source = DEFAULT_SOURCE,
  target = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const closed = new Set<string>();
  const open = new Set<string>([source]);
  let popping: string | null = null;
  let ans = Infinity;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = input.nodes.map((id) => {
      let role: BarRole = 'default';
      if (closed.has(id)) role = 'final';
      if (open.has(id)) role = 'frontier';
      if (id === popping) role = 'pivot';
      if (id === source || id === target) role = 'compare';
      if (landmarks.includes(id)) role = 'swap';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
    const edges: GraphEdge[] = input.edges.map((e) => ({
      from: e.from,
      to: e.to,
      weight: e.weight,
    }));
    rec.begin(note).setGraph(nodes, edges).commit();
  };

  render({
    zh: `地标=[${landmarks.join(',')}] ${source}→${target}`,
    en: `Landmarks ${source}->${target}`,
  });

  const pre = precomputeLandmarks(input, landmarks, {
    onLandmark: (ell) => render({ zh: `预处理地标 ${ell}`, en: `Precompute landmark ${ell}` }),
  });

  const hooks: LandmarkHooks = {
    onPop: (node, g, f) => {
      popping = node;
      closed.add(node);
      open.delete(node);
      render({
        zh: `弹出 ${node}: g=${g} f=${f.toFixed(1)}`,
        en: `Pop ${node}: g=${g} f=${f.toFixed(1)}`,
      });
    },
    onDone: (found, dist) => {
      ans = found ? dist : Infinity;
      popping = null;
      render({ zh: found ? `距离=${dist}` : '不可达', en: found ? `dist=${dist}` : 'unreachable' });
    },
  };

  landmarkShortestPath(input, pre, source, target, hooks);

  rec
    .begin({
      zh: Number.isFinite(ans) ? `完成：${ans}` : '不可达',
      en: Number.isFinite(ans) ? `Done: ${ans}` : 'unreachable',
    })
    .setAux([{ label: '最短距离', value: Number.isFinite(ans) ? String(ans) : '∞', role: 'final' }])
    .commit();

  return rec.build();
}
