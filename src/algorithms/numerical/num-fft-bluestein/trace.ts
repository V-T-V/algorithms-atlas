// FFT（Bluestein）· 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bluesteinDFT, type Complex } from './impl.ts';

export const DEFAULT_INPUT = {
  // 任意长度（非 2 的幂），例如 5
  input: [0, 1, 2, 3, 4],
};

export function buildTrace(input: { input: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { input: real } = input;
  const N = real.length;

  rec
    .begin({
      zh: `Bluestein DFT：${N} 点（非 2 的幂也可）`,
      en: `Bluestein DFT: ${N}-point (non-power-of-2 ok)`,
    })
    .setAux([{ label: '输入长度', value: String(N), role: 'pivot' }])
    .commit();

  const complex: Complex[] = real.map((v) => ({ re: v, im: 0 }));
  const X = bluesteinDFT(complex);

  for (let k = 0; k < N; k++) {
    const mag = Math.hypot(X[k]!.re, X[k]!.im);
    rec
      .begin({
        zh: `X[${k}] = ${X[k]!.re.toFixed(4)} + ${X[k]!.im.toFixed(4)}i  |·|=${mag.toFixed(4)}`,
        en: `X[${k}] = ${X[k]!.re.toFixed(4)} + ${X[k]!.im.toFixed(4)}i  |·|=${mag.toFixed(4)}`,
      })
      .setAux([
        { label: '频率', value: String(k), role: 'pivot' },
        { label: '幅度', value: mag.toFixed(4), role: 'final' },
      ])
      .commit();
  }

  const inv = bluesteinDFT(X, true);
  rec
    .begin({
      zh: `逆变换实部：[${inv.map((c) => c.re.toFixed(3)).join(', ')}]`,
      en: `Inverse real parts: [${inv.map((c) => c.re.toFixed(3)).join(', ')}]`,
    })
    .setAux([{ label: '恢复', value: inv.map((c) => c.re.toFixed(3)).join(', '), role: 'final' }])
    .commit();

  return rec.build();
}
