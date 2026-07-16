// =============================================================================
// Blowfish 密钥扩展 · 录制帧序列
// setAux 展示 P/S 大小与当前阶段；setMap 展示最终 P 摘要。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  blowfishKeySchedule,
  P_ARRAY_LEN,
  S_BOX_COUNT,
  S_BOX_LEN,
  type BlowfishHooks,
} from './impl.ts';

export const DEFAULT_INPUT = 'secretkey';

function fp(v: number): string {
  return (v >>> 0).toString(16).padStart(8, '0');
}

export function buildTrace(key: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `密钥「${key}」`, en: `Key "${key}"` })
    .setAux([
      { label: '说明', value: 'Blowfish 密钥扩展', role: 'pivot' as BarRole },
      { label: 'P 数组', value: `${P_ARRAY_LEN} 项`, role: 'frontier' as BarRole },
      { label: 'S 盒', value: `${S_BOX_COUNT} × ${S_BOX_LEN}`, role: 'frontier' as BarRole },
    ])
    .commit();

  // 阶段 1：初始化
  let pInitCount = 0;
  let sInitCount = 0;
  const hooks: BlowfishHooks = {
    onInitP: () => {
      pInitCount++;
    },
    onInitS: () => {
      sInitCount++;
    },
    onOverwriteP: (i, value) => {
      // 仅在第 0 和最后位出帧
      if (i === 0 || i === P_ARRAY_LEN - 1) {
        rec
          .begin({ zh: `覆盖 P[${i}] = ${fp(value)}`, en: `Overwrite P[${i}] = ${fp(value)}` })
          .setAux([
            { label: '阶段', value: '密钥扩展中', role: 'compare' as BarRole },
            { label: 'P[0]', value: fp(value), role: 'final' as BarRole },
          ])
          .commit();
      }
    },
    onEncryptStep: (round, l, r) => {
      if (round === 0 || round === 521) {
        rec
          .begin({
            zh: `加密步骤 #${round}：L=${fp(l)} R=${fp(r)}`,
            en: `Encrypt step #${round}: L=${fp(l)} R=${fp(r)}`,
          })
          .setAux([
            { label: '阶段', value: round < 9 ? '覆盖 P' : '覆盖 S 盒', role: 'pivot' as BarRole },
            { label: 'L', value: fp(l), role: 'compare' as BarRole },
            { label: 'R', value: fp(r), role: 'compare' as BarRole },
          ])
          .commit();
      }
    },
  };

  const state = blowfishKeySchedule(key, hooks);

  // 初始化阶段帧
  rec
    .begin({
      zh: `初始化完成：P ${pInitCount} 项，S ${sInitCount} 项`,
      en: `Init done: P ${pInitCount}, S ${sInitCount}`,
    })
    .setAux([
      { label: 'P 初始化', value: String(pInitCount), role: 'sorted' as BarRole },
      { label: 'S 初始化', value: String(sInitCount), role: 'sorted' as BarRole },
    ])
    .commit();

  // 终态
  rec
    .begin({ zh: `完成：密钥扩展结束`, en: `Done: key schedule finished` })
    .setMap([
      { key: '密钥', value: key, role: 'default' as BarRole },
      { key: 'P[0..3]', value: state.P.slice(0, 4).map(fp).join(' '), role: 'final' as BarRole },
      {
        key: 'S[0][0..3]',
        value: state.S[0]!.slice(0, 4).map(fp).join(' '),
        role: 'final' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
