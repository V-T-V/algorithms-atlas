import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ringLeaderElection } from './impl.ts';

export const DEFAULT_IDS = [3, 1, 4, 1, 5, 9, 2, 6];
export const DEFAULT_INITIATOR = 0;

export function buildTrace(opts: { ids?: number[]; initiator?: number } = {}): Frame[] {
  const ids = opts.ids ?? DEFAULT_IDS;
  const initiator = opts.initiator ?? DEFAULT_INITIATOR;
  const rec = new TraceRecorder();
  let currentPos = initiator;
  let msg = ids[initiator]!;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        ids.map((id, i) => ({
          value: id,
          role: (i === currentPos
            ? 'pivot'
            : id === Math.max(...ids)
              ? 'final'
              : 'default') as BarRole,
          label: `P${i}:${id}`,
        })),
      )
      .setAux([
        { label: '当前位置', value: `P${currentPos}`, role: 'pivot' as BarRole },
        { label: '消息 id', value: String(msg), role: 'compare' as BarRole },
      ])
      .commit();
  };

  snap({ zh: `P${initiator} 发起选举`, en: `P${initiator} starts election` });

  const leader = ringLeaderElection(ids, initiator, {
    onForward: (from, to, id) => {
      currentPos = to;
      msg = id;
      snap({ zh: `P${from}→P${to} 转发 id=${id}`, en: `P${from}→P${to} forward id=${id}` });
    },
    onSwallow: (at) => {
      currentPos = at;
      snap({ zh: `P${at} 吞掉（id 更小）`, en: `P${at} swallows (smaller id)` });
    },
    onElected: (l) => {
      snap({ zh: `领导者当选: id=${l}`, en: `Leader elected: id=${l}` });
    },
  });

  rec
    .begin({ zh: `完成：领导者 id=${leader}`, en: `Done: leader id=${leader}` })
    .setBars(
      ids.map((id) => ({
        value: id,
        role: (id === leader ? 'final' : 'default') as BarRole,
        label: String(id),
      })),
    )
    .setAux([{ label: '领导者', value: String(leader), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
