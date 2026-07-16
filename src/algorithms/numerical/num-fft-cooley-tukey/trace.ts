// FFT（Cooley-Tukey）· 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fft, fftReal, type Complex } from './impl.ts';

export const DEFAULT_INPUT = {
  // 8 点：[1,1,1,1,0,0,0,0]（方波的 DFT）
  input: [1, 1, 1, 1, 0, 0, 0, 0],
};

export function buildTrace(input: { input: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { input: real } = input;

  rec
    .begin({
      zh: `FFT：${real.length} 点实数输入`,
      en: `FFT: ${real.length}-point real input`,
    })
    .setAux([{ label: '输入长度', value: String(real.length), role: 'pivot' }])
    .commit();

  const complex: Complex[] = real.map((v) => ({ re: v, im: 0 }));
  const spectrum = fft(complex);

  // 显示前几个频率分量
  for (let k = 0; k < spectrum.length; k++) {
    const mag = Math.hypot(spectrum[k]!.re, spectrum[k]!.im);
    rec
      .begin({
        zh: `X[${k}] = ${spectrum[k]!.re.toFixed(4)} + ${spectrum[k]!.im.toFixed(4)}i  |·|=${mag.toFixed(4)}`,
        en: `X[${k}] = ${spectrum[k]!.re.toFixed(4)} + ${spectrum[k]!.im.toFixed(4)}i  |·|=${mag.toFixed(4)}`,
      })
      .setAux([
        { label: '频率', value: String(k), role: 'pivot' },
        { label: '实部', value: spectrum[k]!.re.toFixed(4), role: 'compare' },
        { label: '虚部', value: spectrum[k]!.im.toFixed(4), role: 'compare' },
        { label: '幅度', value: mag.toFixed(4), role: 'final' },
      ])
      .commit();
  }

  // 验证逆变换恢复原信号
  const inv = fft(spectrum, true);
  rec
    .begin({
      zh: `逆 FFT 后实部：[${inv.map((c) => c.re.toFixed(3)).join(', ')}]`,
      en: `Inverse FFT real parts: [${inv.map((c) => c.re.toFixed(3)).join(', ')}]`,
    })
    .setAux([{ label: '恢复', value: inv.map((c) => c.re.toFixed(3)).join(', '), role: 'final' }])
    .commit();

  void fftReal;
  return rec.build();
}
