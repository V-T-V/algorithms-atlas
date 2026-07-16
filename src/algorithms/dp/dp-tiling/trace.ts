// =============================================================================
// 铺砖 DP · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tilingDomino2xN, type TilingHooks } from './impl.ts';

export const DEFAULT_INPUT = 8;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;
  const dp: number[] = new Array<number>(Math.max(n + 1, 1)).fill(-1);
  let cur = -1;
  let result = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (let i = 0; i <= n; i++) {
      if (i === cur) roles[i] = 'compare';
      else if (dp[i]! >= 0) roles[i] = 'frontier';
    }
    const values = Array.from({ length: n + 1 }, (_, i) => Math.max(dp[i]!, 0));
    const labels: Record<number, string> = {};
    for (let i = 0; i <= n; i++) labels[i] = `n=${i}\n${dp[i]! < 0 ? '·' : dp[i]}`;
    rec
      .begin(note)
      .setBars(rec.barsFrom(values, roles, labels))
      .setAux([
        { label: 'dp', value: dp.map((v) => (v < 0 ? '·' : v)).join(' '), role: 'compare' },
        { label: '答案', value: result ? String(result) : '（计算中）', role: 'final' },
      ])
      .commit();
  };

  snap({ zh: `2×${n} 通道`, en: `2×${n} corridor` });

  const hooks: TilingHooks = {
    onStep: (i, val) => {
      dp[i] = val;
      cur = i;
      snap({ zh: `dp[${i}] = ${val}`, en: `dp[${i}] = ${val}` });
    },
    onResult: (w) => {
      result = w;
      cur = -1;
    },
  };

  tilingDomino2xN(n, hooks);

  rec
    .begin({ zh: `完成：${result} 种铺法`, en: `Done: ${result} tilings` })
    .setBars(
      rec.barsFrom(
        dp.map((v) => Math.max(v, 0)),
        { [n]: 'final' as BarRole },
      ),
    )
    .setAux([{ label: '答案', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
