// 公平份额调度 · 录制帧序列
// 用 setBars 展示甘特段，用 setAux 展示各用户 CPU 占用。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fairShare, type FsHooks, type FsProcess, type FsUserShare } from './impl.ts';

export const DEFAULT_INPUT = {
  processes: [
    { id: 'A1', user: 'A', burst: 4 },
    { id: 'A2', user: 'A', burst: 4 },
    { id: 'B1', user: 'B', burst: 4 },
  ],
  shares: [
    { user: 'A', share: 1 },
    { user: 'B', share: 1 },
  ],
};

export function buildTrace(
  input: { processes: FsProcess[]; shares: FsUserShare[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const done: Array<{ id: string; start: number; finish: number; user: string }> = [];
  let curSeg: { id: string; start: number; finish: number; user: string } | null = null;
  let userCpu: Record<string, number> = {};
  for (const s of input.shares) userCpu[s.user] = 0;
  let time = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars = done.map((d) => ({
      value: d.finish - d.start,
      role: 'final' as BarRole,
      label: `${d.id}[${d.start}-${d.finish}]`,
    }));
    if (curSeg) {
      bars.push({
        value: curSeg.finish - curSeg.start,
        role: 'swap' as BarRole,
        label: `${curSeg.id}[${curSeg.start}-${curSeg.finish}]`,
      });
    }
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: 'time', value: `t=${time}`, role: 'pivot' as BarRole },
    ];
    for (const [u, c] of Object.entries(userCpu)) {
      aux.push({ label: `用户 ${u} CPU`, value: String(c), role: 'frontier' as BarRole });
    }
    rec.begin(note).setBars(bars).setAux(aux).commit();
    curSeg = null;
  };

  snapshot({ zh: `公平份额调度：A:1, B:1`, en: `Fair-share: A:1, B:1` });

  const hooks: FsHooks = {
    onPick: (p, _r, t) => {
      time = t;
      curSeg = { id: p.id, user: p.user, start: t, finish: t + 1 };
    },
    onComplete: () => {
      // 由 buildTrace 自行同步 done 列表
    },
  };

  const result = fairShare(input.processes, input.shares, hooks);
  userCpu = { ...result.userCpu };
  // 重建 done
  done.length = 0;
  for (const seg of result.segments) {
    done.push({ id: seg.id, start: seg.start, finish: seg.finish, user: seg.user });
  }
  curSeg = null;

  rec
    .begin({ zh: `调度完成`, en: `Scheduling complete` })
    .setBars(
      done.map((d) => ({
        value: d.finish - d.start,
        role: 'final' as BarRole,
        label: `${d.id}[${d.start}-${d.finish}]`,
      })),
    )
    .setAux([
      { label: '平均等待', value: result.avgWait.toFixed(2), role: 'frontier' as BarRole },
      { label: '平均周转', value: result.avgTurnaround.toFixed(2), role: 'frontier' as BarRole },
      ...Object.entries(result.userCpu).map(([u, c]) => ({
        label: `用户 ${u} CPU`,
        value: String(c),
        role: 'pivot' as BarRole,
      })),
    ])
    .commit();

  return rec.build();
}
