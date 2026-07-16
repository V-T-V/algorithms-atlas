// Trifid 三方阵密码 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { trifidEncrypt, buildTrifidFill, type TrifidHooks } from './impl.ts';

export const DEFAULT_INPUT = { text: 'TRIFID', keyword: '', period: 5 };

export function buildTrace(
  input: { text: string; keyword: string; period: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { text, keyword, period } = input;
  const fill = buildTrifidFill(keyword);

  rec
    .begin({ zh: `Trifid period=${period}`, en: `Trifid period=${period}` })
    .setAux([{ label: '27字符', value: fill, role: 'pivot' }])
    .commit();

  const hooks: TrifidHooks = {
    onPeriod: (pi, combined) => {
      rec
        .begin({ zh: `周期 ${pi}`, en: `Period ${pi}` })
        .setAux([{ label: '坐标串', value: combined.join(''), role: 'compare' }])
        .commit();
    },
  };

  const result = trifidEncrypt(text, keyword, period, hooks);

  rec
    .begin({ zh: `密文：${result}`, en: `Cipher: ${result}` })
    .setAux([{ label: '密文', value: result, role: 'final' }])
    .commit();

  return rec.build();
}
