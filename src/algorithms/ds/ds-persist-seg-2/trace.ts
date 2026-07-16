// =============================================================================
// 可持久化线段树 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { PersistSeg2 } from './impl.ts';

export const DEFAULT_INPUT = [
  { pos: 1, val: 5 },
  { pos: 3, val: 7 },
  { pos: 0, val: 2 },
  { pos: 2, val: 9 },
];

export function buildTrace(input: { pos: number; val: number }[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const M = 5;
  const pst = new PersistSeg2(M);

  const snapshot = (version: number): number[] => {
    const arr: number[] = [];
    for (let i = 0; i < M; i++)
      arr.push(pst.prefix(version, i) - (i > 0 ? pst.prefix(version, i - 1) : 0));
    return arr;
  };

  let lastVersion = 0;
  for (const { pos, val } of input) {
    lastVersion = pst.update(pos, val);
    const snap = snapshot(lastVersion);
    rec
      .begin({
        zh: `v${lastVersion}: arr[${pos}] = ${val}`,
        en: `v${lastVersion}: arr[${pos}] = ${val}`,
      })
      .setBars(snap.map((x, i) => ({ value: x, role: i === pos ? 'swap' : 'default' })))
      .setAux([
        { label: 'version', value: String(lastVersion), role: 'frontier' },
        { label: 'nodes', value: String(pst.nodeCount), role: 'pivot' },
      ])
      .commit();
  }

  // 演示历史版本查询
  const v0sum = pst.prefix(0, M - 1);
  const vLastSum = pst.prefix(lastVersion, M - 1);
  rec
    .begin({
      zh: `v0 全和=${v0sum}, v${lastVersion} 全和=${vLastSum}`,
      en: `v0 sum=${v0sum}, v${lastVersion} sum=${vLastSum}`,
    })
    .setAux([
      { label: 'v0 sum', value: String(v0sum), role: 'warn' },
      { label: `v${lastVersion} sum`, value: String(vLastSum), role: 'final' },
    ])
    .commit();

  return rec.build();
}
