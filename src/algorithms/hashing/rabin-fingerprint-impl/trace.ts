// =============================================================================
// Rabin 指纹（多项式哈希）· 录制帧序列
// 在文本上滚动窗口搜索模式：setArray 高亮窗口，setAux 显示指纹演化。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rabinKarpSearch, DEFAULT_BASE, DEFAULT_PRIME, type RabinHooks } from './impl.ts';

export const DEFAULT_INPUT: { text: string; pattern: string } = {
  text: 'abracadabra',
  pattern: 'abra',
};

/** 录制演示帧序列。 */
export function buildTrace(input: { text: string; pattern: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, pattern } = input;
  const t = Array.from(new TextEncoder().encode(text));
  const m = Array.from(new TextEncoder().encode(pattern)).length;
  const roles: BarRole[] = t.map(() => 'default');

  rec
    .begin({
      zh: `文本 "${text}"（${t.length} 字节）中搜索模式 "${pattern}"（${m} 字节）。基 ${DEFAULT_BASE}，素数 P=${DEFAULT_PRIME}`,
      en: `Search pattern "${pattern}" (${m} bytes) in "${text}" (${t.length} bytes). base=${DEFAULT_BASE}, prime P=${DEFAULT_PRIME}`,
    })
    .setArray(t, [...roles], [])
    .setAux([
      { label: '基 base', value: String(DEFAULT_BASE), role: 'compare' as BarRole },
      { label: '素数 P', value: String(DEFAULT_PRIME), role: 'frontier' as BarRole },
      { label: '窗口宽 m', value: String(m), role: 'pivot' as BarRole },
    ])
    .commit();

  const render = (
    note: { zh: string; en: string },
    winStart: number,
    winHash: number,
    matched: boolean,
  ): void => {
    const r: BarRole[] = t.map((_, j) => {
      if (j >= winStart && j < winStart + m) return matched ? 'final' : 'frontier';
      return 'default';
    });
    rec
      .begin(note)
      .setArray(t, r, [
        { index: winStart, label: 'w' },
        { index: winStart + m - 1, label: 'e' },
      ])
      .setAux([
        {
          label: '窗口指纹',
          value: String(winHash),
          role: (matched ? 'final' : 'pivot') as BarRole,
        },
        { label: '窗口起始', value: String(winStart), role: 'frontier' as BarRole },
        {
          label: '状态',
          value: matched ? '命中 / match' : '滚动 / roll',
          role: (matched ? 'final' : 'compare') as BarRole,
        },
      ])
      .commit();
  };

  const hooks: RabinHooks = {
    onInit: (start, hash) => {
      render(
        {
          zh: `初始化首窗口 [0, ${m})，指纹 = ${hash}`,
          en: `Init first window [0, ${m}), hash = ${hash}`,
        },
        start,
        hash,
        false,
      );
    },
    onRoll: (i, outByte, inByte, hash) => {
      render(
        {
          zh: `滚动：移出 ${outByte}，移入 ${inByte} → 窗口 [${i + 1}, ${i + 1 + m})，指纹 = ${hash}`,
          en: `Roll: out ${outByte}, in ${inByte} → window [${i + 1}, ${i + 1 + m}), hash = ${hash}`,
        },
        i + 1,
        hash,
        false,
      );
    },
    onMatch: (start) => {
      render(
        {
          zh: `指纹相等，逐字节校验通过 → 命中于下标 ${start}`,
          en: `Hash equal, byte check passed → match at index ${start}`,
        },
        start,
        0,
        true,
      );
    },
  };

  const matches = rabinKarpSearch(text, pattern, DEFAULT_BASE, DEFAULT_PRIME, hooks);

  // 终态
  const matchRoles: BarRole[] = t.map(() => 'default');
  for (const start of matches) {
    for (let j = start; j < start + m && j < t.length; j++) {
      matchRoles[j] = 'final';
    }
  }
  rec
    .begin({
      zh: `完成。共命中 ${matches.length} 处：${matches.length ? matches.join(', ') : '无'}`,
      en: `Done. ${matches.length} match(es): ${matches.length ? matches.join(', ') : 'none'}`,
    })
    .setArray(t, matchRoles, [])
    .setAux([
      {
        label: '命中数',
        value: String(matches.length),
        role: 'final' as BarRole,
      },
      { label: '命中下标', value: matches.join(', ') || '—', role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
