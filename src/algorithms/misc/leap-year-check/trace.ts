// =============================================================================
// 闰年判定 · 录制帧序列
// 展示三步判定（%4 → %100 → %400）的逐步推理。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isLeapYear, type LeapYearHooks } from './impl.ts';

export const DEFAULT_INPUT: { years: number[] } = {
  years: [1900, 2000, 2023, 2024],
};

/** 录制演示帧序列。 */
export function buildTrace(input: { years: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { years } = input;

  rec
    .begin({
      zh: `判定 ${years.length} 个年份是否为闰年：${years.join(', ')}`,
      en: `Check ${years.length} years for leap status: ${years.join(', ')}`,
    })
    .setAux([
      { label: '规则', value: '%4 && (!%100 || %400)', role: 'compare' as BarRole },
      { label: '年份数', value: String(years.length), role: 'pivot' as BarRole },
    ])
    .commit();

  const results: Array<{ year: number; isLeap: boolean }> = [];

  for (const year of years) {
    const hooks: LeapYearHooks = {
      onCheck: (y, by4, by100, by400, isLeap) => {
        // 三步逐帧
        rec
          .begin({
            zh: `${y}：%4=${by4 ? '是' : '否'} → ${by4 ? '继续' : '不是闰年'}`,
            en: `${y}: %4=${by4 ? 'yes' : 'no'} → ${by4 ? 'continue' : 'not leap'}`,
          })
          .setAux([
            { label: '年份', value: String(y), role: 'pivot' as BarRole },
            {
              label: '%4 === 0',
              value: by4 ? '是' : '否',
              role: (by4 ? 'final' : 'warn') as BarRole,
            },
            { label: '步骤', value: '1/3', role: 'compare' as BarRole },
          ])
          .commit();

        if (by4) {
          rec
            .begin({
              zh: `${y}：%100=${by100 ? '是' : '否'} → ${!by100 ? '是闰年（不被 100 整除）' : '继续看 %400'}`,
              en: `${y}: %100=${by100 ? 'yes' : 'no'} → ${!by100 ? 'leap (not divisible by 100)' : 'check %400'}`,
            })
            .setAux([
              { label: '年份', value: String(y), role: 'pivot' as BarRole },
              { label: '%4 === 0', value: '是', role: 'final' as BarRole },
              {
                label: '%100 === 0',
                value: by100 ? '是' : '否',
                role: (by100 ? 'compare' : 'final') as BarRole,
              },
              { label: '步骤', value: '2/3', role: 'compare' as BarRole },
            ])
            .commit();
        }
        if (by4 && by100) {
          rec
            .begin({
              zh: `${y}：%400=${by400 ? '是' : '否'} → ${by400 ? '是闰年（被 400 整除）' : '不是闰年'}`,
              en: `${y}: %400=${by400 ? 'yes' : 'no'} → ${by400 ? 'leap (divisible by 400)' : 'not leap'}`,
            })
            .setAux([
              { label: '年份', value: String(y), role: 'pivot' as BarRole },
              { label: '%4 === 0', value: '是', role: 'final' as BarRole },
              { label: '%100 === 0', value: '是', role: 'compare' as BarRole },
              {
                label: '%400 === 0',
                value: by400 ? '是' : '否',
                role: (by400 ? 'final' : 'warn') as BarRole,
              },
              { label: '步骤', value: '3/3', role: 'compare' as BarRole },
            ])
            .commit();
        }

        // 结论
        rec
          .begin({
            zh: `${y} ${isLeap ? '是闰年' : '不是闰年'}`,
            en: `${y} ${isLeap ? 'is a leap year' : 'is NOT a leap year'}`,
          })
          .setAux([
            { label: '年份', value: String(y), role: 'pivot' as BarRole },
            {
              label: '结论',
              value: isLeap ? '闰年 / leap' : '平年 / common',
              role: (isLeap ? 'final' : 'warn') as BarRole,
            },
          ])
          .commit();
        results.push({ year: y, isLeap });
      },
    };
    isLeapYear(year, hooks);
  }

  // 终态汇总
  rec
    .begin({
      zh: `完成。闰年：${
        results
          .filter((r) => r.isLeap)
          .map((r) => r.year)
          .join(', ') || '无'
      }`,
      en: `Done. Leap years: ${
        results
          .filter((r) => r.isLeap)
          .map((r) => r.year)
          .join(', ') || 'none'
      }`,
    })
    .setBars(
      years.map((y) => ({
        value: y,
        role: (results.find((r) => r.year === y)?.isLeap ? 'final' : 'warn') as BarRole,
        label: String(y),
      })),
    )
    .setAux([
      {
        label: '闰年数',
        value: String(results.filter((r) => r.isLeap).length),
        role: 'final' as BarRole,
      },
      { label: '总年数', value: String(years.length), role: 'default' as BarRole },
    ])
    .commit();

  return rec.build();
}
