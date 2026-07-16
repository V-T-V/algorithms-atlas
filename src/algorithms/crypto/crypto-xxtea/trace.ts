// XXTEA · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { xxteaEncrypt, type XxteaHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  v: [0x12345678, 0x9abcdef0, 0xdeadbeef, 0xcafebabe],
  key: [0x11111111, 0x22222222, 0x33333333, 0x44444444] as readonly [
    number,
    number,
    number,
    number,
  ],
};

export function buildTrace(
  input: {
    v: number[];
    key: readonly [number, number, number, number];
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { v, key } = input;

  rec
    .begin({ zh: `XXTEA 加密 ${v.length} 个字`, en: `XXTEA encrypt ${v.length} words` })
    .setAux([
      { label: '输入', value: v.map((x) => '0x' + x.toString(16)).join(','), role: 'pivot' },
    ])
    .commit();

  const hooks: XxteaHooks = {
    onRound: (round, vv) => {
      if (round < 2) {
        rec
          .begin({ zh: `第 ${round} 轮`, en: `Round ${round}` })
          .setAux([
            {
              label: '状态',
              value: vv.map((x) => '0x' + x.toString(16)).join(','),
              role: 'compare',
            },
          ])
          .commit();
      }
    },
  };

  const result = xxteaEncrypt([...v], key, hooks);

  rec
    .begin({ zh: `完成`, en: `Done` })
    .setAux([
      { label: '密文', value: result.map((x) => '0x' + x.toString(16)).join(','), role: 'final' },
    ])
    .commit();

  return rec.build();
}
