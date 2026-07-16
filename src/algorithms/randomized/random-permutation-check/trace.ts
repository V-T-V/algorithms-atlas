// =============================================================================
// 随机排列生成与校验 · 录制帧序列
// 用 setArray 展示排列生成过程（含指针 i、j），用 setAux 展示校验结论。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  fisherYatesShuffle,
  verifyByCounting,
  verifyByFingerprint,
  makeRng,
  type PermutationHooks,
} from './impl.ts';

export const DEFAULT_INPUT = {
  n: 6,
  seed: 42,
};

interface BuildTraceInput {
  n?: number;
  seed?: number;
}

export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const n = input.n ?? DEFAULT_INPUT.n;
  const seed = input.seed ?? DEFAULT_INPUT.seed;

  const rec = new TraceRecorder();
  let arr: number[] = Array.from({ length: n }, (_, i) => i);

  const render = (
    note: { zh: string; en: string },
    i: number,
    j: number,
    roleMap: Record<number, BarRole> = {},
  ) => {
    const roles: BarRole[] = arr.map((_, idx) => roleMap[idx] ?? ('sorted' as BarRole));
    rec
      .begin(note)
      .setArray(arr, roles, [
        { index: i, label: 'i' },
        { index: j, label: 'j' },
      ])
      .setAux([{ label: '操作', value: note.zh, role: 'pivot' as BarRole }])
      .commit();
  };

  // 初始帧
  rec
    .begin({
      zh: `初始排列 [0..${n - 1}]，准备 Fisher-Yates 洗牌`,
      en: `Initial permutation [0..${n - 1}], ready for Fisher-Yates shuffle`,
    })
    .setArray(
      arr,
      arr.map(() => 'default' as BarRole),
      [],
    )
    .commit();

  // 生成
  const genHooks: PermutationHooks = {
    onSwap: (i, j, a) => {
      arr = [...a];
      const roles: Record<number, BarRole> = {};
      roles[i] = 'swap';
      roles[j] = 'compare';
      render(
        {
          zh: `i=${i}, j=${j}：交换 arr[${i}]=${arr[i]} 与 arr[${j}]=${arr[j]}`,
          en: `i=${i}, j=${j}: swap arr[${i}]=${arr[i]} and arr[${j}]=${arr[j]}`,
        },
        i,
        j,
        roles,
      );
    },
  };
  arr = fisherYatesShuffle(n, makeRng(seed), genHooks);

  // 校验
  const countValid = verifyByCounting(arr);
  const fpValid = verifyByFingerprint(arr);

  rec
    .begin({
      zh: `校验：计数法=${countValid ? '合法' : '非法'}，指纹法=${fpValid ? '合法' : '非法'}`,
      en: `Verify: counting=${countValid ? 'valid' : 'invalid'}, fingerprint=${fpValid ? 'valid' : 'invalid'}`,
    })
    .setArray(
      arr,
      arr.map(() => 'final' as BarRole),
      [],
    )
    .setAux([
      {
        label: '计数法',
        value: countValid ? '合法排列' : '非法',
        role: (countValid ? 'final' : 'warn') as BarRole,
      },
      {
        label: '指纹法',
        value: fpValid ? '合法排列' : '非法',
        role: (fpValid ? 'final' : 'warn') as BarRole,
      },
    ])
    .commit();

  // 终态
  rec
    .begin({
      zh: `完成：生成 ${n} 元随机排列，两种校验均通过`,
      en: `Done: generated a ${n}-element random permutation, both verifications passed`,
    })
    .setArray(
      arr,
      arr.map(() => 'final' as BarRole),
      [],
    )
    .setAux([
      { label: '排列', value: arr.join(', '), role: 'final' as BarRole },
      { label: '元素数', value: String(n), role: 'default' as BarRole },
    ])
    .commit();

  return rec.build();
}
