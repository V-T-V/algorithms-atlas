// =============================================================================
// 分布式快照（Chandy-Lamport）· 录制帧序列
// 用 setAux 展示各进程记录状态、通道快照；用 setGraph 展示拓扑与 marker 流。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { runSnapshot, type SnapshotHooks, type SnapshotStep } from './impl.ts';

/** 默认演示：2 进程 P0<->P1，P0 发起。 */
export function defaultInput(): {
  nProc: number;
  edges: Array<[number, number]>;
  initiator: number;
  steps: SnapshotStep[];
} {
  return {
    nProc: 2,
    edges: [
      [0, 1],
      [1, 0],
    ],
    initiator: 0,
    steps: [
      { type: 'marker', from: 0, to: 1 }, // P0 发起，marker 到 P1
      { type: 'message', from: 0, to: 1, payload: 7 }, // 被 P1 记入通道 0->1 快照
      { type: 'marker', from: 1, to: 0 }, // P1 记录状态后回 marker
      { type: 'message', from: 1, to: 0, payload: 3 }, // 被 P0 记入通道 1->0 快照
    ],
  };
}

interface TraceOptions {
  nProc: number;
  edges: Array<[number, number]>;
  initiator: number;
  steps: SnapshotStep[];
}

export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const def = defaultInput();
  const nProc = opts.nProc ?? def.nProc;
  const edges = opts.edges ?? def.edges;
  const initiator = opts.initiator ?? def.initiator;
  const steps = opts.steps ?? def.steps;
  const rec = new TraceRecorder();

  const recordedProcess = new Array<boolean>(nProc).fill(false);
  const completed = new Array<boolean>(nProc).fill(false);
  const channelState = new Map<string, number[]>();
  for (const [f, t] of edges) channelState.set(`${f}->${t}`, []);
  let activeEdge: string | null = null;

  const nodePos = (i: number): { x: number; y: number } => {
    if (nProc === 2) return i === 0 ? { x: 0.25, y: 0.5 } : { x: 0.75, y: 0.5 };
    const ang = (i / nProc) * Math.PI * 2 - Math.PI / 2;
    return { x: 0.5 + 0.4 * Math.cos(ang), y: 0.5 + 0.4 * Math.sin(ang) };
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    const nodes = Array.from({ length: nProc }, (_, i) => ({
      id: `p${i}`,
      label: `P${i}${recordedProcess[i] ? '✓' : ''}`,
      x: nodePos(i).x,
      y: nodePos(i).y,
      role: (completed[i] ? 'final' : recordedProcess[i] ? 'swap' : 'default') as BarRole,
    }));
    const eList: Array<{
      from: string;
      to: string;
      directed: boolean;
      role?: BarRole;
      weight?: number;
    }> = edges.map(([f, t]) => ({
      from: `p${f}`,
      to: `p${t}`,
      directed: true,
      role: (activeEdge === `${f}->${t}` ? 'swap' : 'default') as BarRole,
    }));
    rec
      .begin(note)
      .setGraph(nodes, eList)
      .setAux([
        ...Array.from({ length: nProc }, (_, i) => ({
          label: `P${i} 状态`,
          value: recordedProcess[i] ? '已记录' : '未记录',
          role: (completed[i] ? 'final' : recordedProcess[i] ? 'swap' : 'default') as BarRole,
        })),
        ...edges.map(([f, t]) => ({
          label: `通道 ${f}->${t}`,
          value: `[${(channelState.get(`${f}->${t}`) ?? []).join(',')}]`,
          role: 'compare' as BarRole,
        })),
      ])
      .commit();
    activeEdge = null;
  };

  snapshot({
    zh: `初始化：${nProc} 进程，P${initiator} 发起快照`,
    en: `Init: ${nProc} processes, P${initiator} initiates snapshot`,
  });

  const hooks: SnapshotHooks = {
    onRecordState: (p) => {
      recordedProcess[p] = true;
      snapshot({
        zh: `P${p} 记录自身状态并向出向通道发 marker`,
        en: `P${p} records its state and sends markers outward`,
      });
    },
    onMarker: (f, t) => {
      activeEdge = `${f}->${t}`;
      snapshot({ zh: `marker: ${f}->${t}`, en: `marker: ${f}->${t}` });
    },
    onMessage: (f, t, payload, recorded) => {
      activeEdge = `${f}->${t}`;
      if (recorded) channelState.get(`${f}->${t}`)!.push(payload);
      snapshot({
        zh: `消息 ${f}->${t}: ${payload}${recorded ? ' (记入通道快照)' : ''}`,
        en: `message ${f}->${t}: ${payload}${recorded ? ' (recorded into channel)' : ''}`,
      });
    },
    onComplete: (p) => {
      completed[p] = true;
      snapshot({ zh: `P${p} 完成快照`, en: `P${p} completes snapshot` });
    },
  };

  runSnapshot(nProc, edges, initiator, steps, hooks);

  rec
    .begin({
      zh: '完成：全局快照 = 各进程状态 + 各通道状态',
      en: 'Done: global snapshot = process states + channel states',
    })
    .setGraph(
      Array.from({ length: nProc }, (_, i) => ({
        id: `p${i}`,
        label: `P${i}`,
        x: nodePos(i).x,
        y: nodePos(i).y,
        role: 'final' as BarRole,
      })),
      edges.map(([f, t]) => ({
        from: `p${f}`,
        to: `p${t}`,
        directed: true,
        role: 'final' as BarRole,
      })),
    )
    .setAux([
      ...edges.map(([f, t]) => ({
        label: `通道 ${f}->${t} 快照`,
        value: `[${(channelState.get(`${f}->${t}`) ?? []).join(',')}]`,
        role: 'final' as BarRole,
      })),
    ])
    .commit();

  return rec.build();
}
