// =============================================================================
// 环上领导者选举（LCR）· 录制帧序列
// 用 setAux 展示各进程候选状态、已选领导者；用 setGraph 展示环结构与消息流。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { electLeader, type LeaderElectionHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 7, 1, 5, 9, 2];

interface TraceOptions {
  ids: number[];
}

/** 在单位圆上为 n 个进程生成坐标。 */
function ringPositions(n: number): Array<{ x: number; y: number }> {
  const pos: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
    pos.push({ x: 0.5 + 0.4 * Math.cos(ang), y: 0.5 + 0.4 * Math.sin(ang) });
  }
  return pos;
}

export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const ids = opts.ids ?? DEFAULT_INPUT;
  const rec = new TraceRecorder();
  const n = ids.length;
  const pos = ringPositions(n);

  const knownLeader = new Array<number>(n).fill(-1);
  let leader = -1;
  let messageCount = 0;
  const activeMsg: Array<{ from: number; to: number }> = [];

  const render = (note: { zh: string; en: string }): void => {
    const nodes = ids.map((id, i) => ({
      id: `p${i}`,
      label: `P${i}(${id})`,
      x: pos[i]!.x,
      y: pos[i]!.y,
      role: (leader === i ? 'final' : knownLeader[i]! >= 0 ? 'sorted' : 'default') as BarRole,
    }));
    const edges: Array<{
      from: string;
      to: string;
      directed: boolean;
      role?: BarRole;
      weight?: number;
    }> = [];
    for (let i = 0; i < n; i++) {
      const to = (i + 1) % n;
      const isActive = activeMsg.some((m) => m.from === i && m.to === to);
      edges.push({
        from: `p${i}`,
        to: `p${to}`,
        directed: true,
        role: isActive ? 'swap' : 'default',
      });
    }
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        ...ids.map((id, i) => ({
          label: `P${i} (${id})`,
          value: knownLeader[i]! >= 0 ? `领导:P${knownLeader[i]}` : leader === i ? '当选' : '候选',
          role: (leader === i ? 'final' : knownLeader[i]! >= 0 ? 'sorted' : 'default') as BarRole,
        })),
        { label: '消息数', value: String(messageCount), role: 'compare' as BarRole },
      ])
      .commit();
    activeMsg.length = 0;
  };

  render({
    zh: `初始化：${n} 个进程成环，id=[${ids.join(',')}]`,
    en: `Init: ${n} processes in a ring, id=[${ids.join(',')}]`,
  });

  const hooks: LeaderElectionHooks = {
    onSend: (from, to) => {
      activeMsg.push({ from, to });
      messageCount++;
    },
    onSwallow: (proc, c) => {
      rec
        .begin({
          zh: `P${proc} 吞并候选 ${c}（< 自己）`,
          en: `P${proc} swallows candidate ${c} (< self)`,
        })
        .setAux([
          ...ids.map((id, i) => ({
            label: `P${i}`,
            value: i === proc ? `吞并 ${c}` : String(id),
            role: (i === proc ? 'warn' : 'default') as BarRole,
          })),
        ])
        .commit();
    },
    onElect: (proc) => {
      leader = proc;
      knownLeader[proc] = proc;
      render({
        zh: `P${proc} 收到自己的 id 绕回 → 当选领导者`,
        en: `P${proc} receives its own id back → elected leader`,
      });
    },
    onLearnLeader: (proc) => {
      knownLeader[proc] = leader;
      render({
        zh: `P${proc} 得知领导者是 P${leader}`,
        en: `P${proc} learns leader is P${leader}`,
      });
    },
  };

  electLeader(ids, hooks);

  rec
    .begin({
      zh: `完成：领导者 = P${leader}(id=${ids[leader]})，共 ${messageCount} 条消息`,
      en: `Done: leader = P${leader}(id=${ids[leader]}), ${messageCount} messages total`,
    })
    .setGraph(
      ids.map((id, i) => ({
        id: `p${i}`,
        label: `P${i}(${id})`,
        x: pos[i]!.x,
        y: pos[i]!.y,
        role: (i === leader ? 'final' : 'sorted') as BarRole,
      })),
      Array.from({ length: n }, (_, i) => ({
        from: `p${i}`,
        to: `p${(i + 1) % n}`,
        directed: true,
      })),
    )
    .setAux([
      { label: '领导者', value: `P${leader}(id=${ids[leader]})`, role: 'final' as BarRole },
      { label: '消息总数', value: String(messageCount), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
