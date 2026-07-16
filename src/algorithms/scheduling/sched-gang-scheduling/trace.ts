import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { scheduleGangs, type Gang } from './impl.ts';

export const DEFAULT_GANGS: Gang[] = [
  { id: 'G1', threads: ['t1', 't2', 't3'], quantum: 3 },
  { id: 'G2', threads: ['t4', 't5'], quantum: 2 },
];
export const DEFAULT_NCORES = 3;

export function buildTrace(opts: { gangs?: Gang[]; nCores?: number } = {}): Frame[] {
  const gangs = opts.gangs ?? DEFAULT_GANGS;
  const nCores = opts.nCores ?? DEFAULT_NCORES;
  const rec = new TraceRecorder();

  const snap = (
    note: { zh: string; en: string },
    slot: { gangId: string; time: number; cores: string[] },
  ): void => {
    const coreBars = Array.from({ length: nCores }, (_, c) => ({
      value: 1,
      role: (c < slot.cores.length ? 'final' : 'default') as BarRole,
      label: c < slot.cores.length ? `${slot.cores[c]}` : '空',
    }));
    rec
      .begin(note)
      .setBars(coreBars)
      .setAux([
        { label: '时间', value: String(slot.time), role: 'compare' as BarRole },
        { label: 'Gang', value: slot.gangId, role: 'final' as BarRole },
      ])
      .commit();
  };

  rec
    .begin({ zh: `初始化 ${nCores} 核`, en: `Init ${nCores} cores` })
    .setAux([{ label: '说明', value: '每片调度一个 gang', role: 'compare' as BarRole }])
    .commit();

  const slots = scheduleGangs(gangs, nCores, {
    onDispatch: (gid, time, threads) =>
      snap(
        { zh: `${gid} 派发 t=${time}`, en: `${gid} dispatch t=${time}` },
        { gangId: gid, time, cores: threads },
      ),
  });

  rec
    .begin({ zh: `完成：${slots.length} 个时间片`, en: `Done: ${slots.length} slots` })
    .setAux([{ label: '总片数', value: String(slots.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
