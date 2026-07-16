import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { firstBadVersion2, type FirstBad2Hooks } from './impl.ts';

export const DEFAULT_INPUT = 10;
export const DEFAULT_BAD_AT = 4;

export function buildTrace(n: number = DEFAULT_INPUT, badAt: number = DEFAULT_BAD_AT): Frame[] {
  const rec = new TraceRecorder();
  const isBad = (v: number): boolean => v >= badAt;
  const versions = Array.from({ length: n }, (_, i) => i + 1);
  rec
    .begin({
      zh: `${n} 个版本，从第 ${badAt} 个起全部坏`,
      en: `${n} versions, all bad from #${badAt}`,
    })
    .setArray(
      versions,
      versions.map((v) => (isBad(v) ? 'warn' : 'default') as BarRole),
      [],
    )
    .commit();
  const hooks: FirstBad2Hooks = {
    onCheck: (mid) => {
      const roles = versions.map(
        (v) => (v === mid ? 'compare' : isBad(v) ? 'warn' : 'default') as BarRole,
      );
      rec
        .begin({
          zh: `检查版本 ${mid}：${isBad(mid) ? '坏' : '好'}`,
          en: `Check v${mid}: ${isBad(mid) ? 'bad' : 'good'}`,
        })
        .setArray(versions, roles, [{ index: mid - 1, label: 'mid' }])
        .commit();
    },
  };
  const r = firstBadVersion2(n, isBad, hooks);
  rec
    .begin({ zh: `首个坏版本：${r}`, en: `First bad version: ${r}` })
    .setArray(
      versions,
      versions.map((v) => (v === r ? 'final' : isBad(v) ? 'warn' : 'default') as BarRole),
      [{ index: r - 1, label: 'V' }],
    )
    .commit();
  return rec.build();
}
