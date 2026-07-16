// =============================================================================
// SHA-3 / Keccak · 录制帧序列
// setAux 展示阶段（absorb / permute / squeeze）与中间状态摘要。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { keccakHash, type KeccakHooks } from './impl.ts';

export const DEFAULT_INPUT = 'abc';

function stateFingerprint(state: number[]): string {
  // 取前 4 lane 的低 16 位拼接
  return state
    .slice(0, 4)
    .map((v) => (v & 0xffff).toString(16).padStart(4, '0'))
    .join('');
}

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const state: number[] = new Array(25).fill(0);

  rec
    .begin({ zh: `输入「${input}」`, en: `Input "${input}"` })
    .setAux([
      { label: '说明', value: 'sponge: absorb → permute → squeeze', role: 'pivot' },
      { label: '状态指纹', value: stateFingerprint(state), role: 'final' },
    ])
    .commit();

  let permCount = 0;
  const aux = (
    label: string,
    value: string,
    role: BarRole = 'default',
  ): Array<{ label: string; value: string; role?: BarRole }> => [
    { label, value, role },
    { label: '置换轮数', value: String(permCount), role: 'pivot' as BarRole },
  ];

  const hooks: KeccakHooks = {
    onAbsorb: (blockIndex, lanes) => {
      for (let i = 0; i < lanes.length && i < state.length; i++) {
        state[i] = (state[i]! ^ lanes[i]!) >>> 0;
      }
      rec
        .begin({
          zh: `absorb 块 #${blockIndex}：异或进状态`,
          en: `absorb block #${blockIndex}: XOR into state`,
        })
        .setAux(aux('absorb', `block ${blockIndex}`, 'frontier' as BarRole))
        .commit();
    },
    onPermute: (roundIndex) => {
      // 只在第 0 轮和末轮出帧，避免帧过多
      if (roundIndex === 0 || roundIndex === 23) {
        rec
          .begin({
            zh: `置换 ${roundIndex === 0 ? '开始' : '完成'}（24 轮 Keccak-f）`,
            en: `Permutation ${roundIndex === 0 ? 'start' : 'end'} (24 rounds of Keccak-f)`,
          })
          .setAux(aux('permutation', `round ${roundIndex}`, 'compare' as BarRole))
          .commit();
      }
      if (roundIndex === 23) permCount++;
    },
    onSqueeze: (outIndex, word) => {
      if (outIndex % 8 === 0) {
        rec
          .begin({
            zh: `squeeze：输出字节 ${word.toString(16).padStart(2, '0')}`,
            en: `squeeze: byte ${word.toString(16).padStart(2, '0')}`,
          })
          .setAux(aux('squeeze', `byte[${outIndex}]`, 'final' as BarRole))
          .commit();
      }
    },
  };

  const digest = keccakHash(input, 32, hooks);

  rec
    .begin({ zh: `完成：256 位摘要`, en: `Done: 256-bit digest` })
    .setMap([
      { key: '输入', value: input, role: 'default' as BarRole },
      { key: '摘要 (hex)', value: digest, role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
