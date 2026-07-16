// ChaCha20 流密码 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { chacha20Core, chacha20Serialize, type ChaCha20Hooks } from './impl.ts';

export const DEFAULT_INPUT = [
  0x61707865, 0x3320646e, 0x79622d32, 0x6b206574, 0x03020100, 0x07060504, 0x0b0a0908, 0x0f0e0d0c,
  0x13121110, 0x17161514, 0x1b1a1918, 0x1f1e1d1c, 0x00000001, 0x00000000, 0x4a000000, 0x00000000,
];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `ChaCha20 核心块`, en: `ChaCha20 core block` })
    .setAux([{ label: '轮数', value: '20', role: 'pivot' }])
    .commit();

  const hooks: ChaCha20Hooks = {
    onRound: (round, state) => {
      rec
        .begin({ zh: `第 ${round} 双轮`, en: `Double-round ${round}` })
        .setAux([{ label: '状态首字', value: '0x' + state[0]!.toString(16), role: 'compare' }])
        .commit();
    },
  };

  const result = chacha20Core(input, hooks);
  const bytes = chacha20Serialize(result);

  rec
    .begin({ zh: `完成`, en: `Done` })
    .setAux([
      {
        label: '输出(前4字节)',
        value: Array.from(bytes.slice(0, 4))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join(''),
        role: 'final',
      },
    ])
    .commit();

  return rec.build();
}
