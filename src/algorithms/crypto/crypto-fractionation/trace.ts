// 分馏密码（Morbit）· 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fractionationEncrypt, type FractionationHooks } from './impl.ts';

export const DEFAULT_INPUT = 'HELLO';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `分馏加密 "${input}"`, en: `Fractionation on "${input}"` })
    .setAux([{ label: '说明', value: '字母→摩尔斯→两两配对→数字', role: 'pivot' }])
    .commit();

  const hooks: FractionationHooks = {
    onMorse: (morse) => {
      rec
        .begin({ zh: '摩尔斯电码', en: 'Morse code' })
        .setAux([{ label: '电码', value: morse, role: 'compare' }])
        .commit();
    },
    onPair: (i, pair, code) => {
      rec
        .begin({ zh: `${pair} → ${code}`, en: `${pair} → ${code}` })
        .setAux([
          { label: '对', value: pair, role: 'compare' },
          { label: '数字', value: code, role: 'final' },
        ])
        .commit();
    },
  };

  const result = fractionationEncrypt(input, hooks);

  rec
    .begin({ zh: `密文：${result}`, en: `Cipher: ${result}` })
    .setAux([{ label: '密文', value: result, role: 'final' }])
    .commit();

  return rec.build();
}
