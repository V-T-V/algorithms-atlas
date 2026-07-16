// 带下界最大流 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  maxFlowWithLowerBound,
  type LowerBoundFlowInput,
  type LowerBoundFlowHooks,
} from './impl.ts';

export const DEFAULT_INPUT: LowerBoundFlowInput = {
  n: 4,
  edges: [
    { from: 0, to: 1, low: 1, cap: 3 },
    { from: 0, to: 2, low: 1, cap: 2 },
    { from: 1, to: 3, low: 1, cap: 3 },
    { from: 2, to: 3, low: 1, cap: 2 },
  ],
  s: 0,
  t: 3,
};

export function buildTrace(input: LowerBoundFlowInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const edgesDesc = input.edges.map((e) => `${e.from}→${e.to}[${e.low},${e.cap}]`).join(', ');

  rec
    .begin({ zh: `带下界的流网络：${edgesDesc}`, en: `Lower-bounded flow network: ${edgesDesc}` })
    .setAux([{ label: '方法', value: '超级源汇法', role: 'pivot' }])
    .commit();

  const hooks: LowerBoundFlowHooks = {
    onFeasible: (ok) => {
      rec
        .begin({
          zh: `可行性判定：${ok ? '可行' : '不可行'}`,
          en: `Feasibility: ${ok ? 'yes' : 'no'}`,
        })
        .setAux([{ label: '可行', value: String(ok), role: (ok ? 'frontier' : 'warn') as BarRole }])
        .commit();
    },
    onAugment: (_path, flow, total) => {
      rec
        .begin({
          zh: `增广 +${flow}，当前总流量 ${total}`,
          en: `Augment +${flow}, total flow ${total}`,
        })
        .setAux([{ label: '本次', value: String(flow), role: 'frontier' as BarRole }])
        .commit();
    },
    onResult: (maxFlow) => {
      rec
        .begin({
          zh: `最大流（满足下界）= ${maxFlow}`,
          en: `Max flow (with lower bounds) = ${maxFlow}`,
        })
        .setAux([{ label: '最大流', value: String(maxFlow), role: 'final' as BarRole }])
        .commit();
    },
  };

  maxFlowWithLowerBound(input, hooks);
  return rec.build();
}
