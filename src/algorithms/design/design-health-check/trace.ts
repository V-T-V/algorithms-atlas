// Health Check · Trace · 同步模拟探针（避免 async check 与同步 buildTrace 冲突）
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';

type ProbeStatus = 'UP' | 'DOWN';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();

  const probe = (name: string, ok: boolean, detail?: string): ProbeStatus => {
    const status: ProbeStatus = ok ? 'UP' : 'DOWN';
    const text = ok ? status : `${status}:${detail ?? ''}`;
    rec
      .begin({ zh: `探针 ${name} → ${text}`, en: `probe ${name} → ${text}` })
      .setAux([
        {
          label: name,
          value: text,
          role: (ok ? 'final' : 'warn') as BarRole,
        },
      ])
      .commit();
    return status;
  };

  const aggregate = (results: ProbeStatus[]): void => {
    const anyDown = results.some((r) => r === 'DOWN');
    const overall: ProbeStatus = anyDown ? 'DOWN' : 'UP';
    rec
      .begin({ zh: `聚合结果 → ${overall}`, en: `aggregate → ${overall}` })
      .setAux([
        {
          label: 'overall',
          value: overall,
          role: (overall === 'UP' ? 'final' : 'warn') as BarRole,
        },
      ])
      .commit();
  };

  rec.begin({ zh: '健康检查模拟', en: 'Health Check' }).commit();
  const r1 = probe('db', true);
  const r2 = probe('cache', false, 'timeout');
  aggregate([r1, r2]);
  return rec.build();
}
