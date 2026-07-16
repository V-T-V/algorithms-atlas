// PPMd · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ppmd, type PpmdHooks } from './impl.ts';

export interface PpmdInput {
  symbols: number[];
  order: number;
}

export const DEFAULT_INPUT: PpmdInput = {
  symbols: Array.from('MISSISSIPPI').map((c) => c.charCodeAt(0)),
  order: 2,
};

/** 录制演示帧序列。 */
export function buildTrace(input: PpmdInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { symbols, order } = input;

  rec
    .begin({
      zh: `${symbols.length} 个符号，阶数 ${order}`,
      en: `${symbols.length} symbols, order ${order}`,
    })
    .setBars(symbols.map((v) => ({ value: v % 26, role: 'default' as BarRole })))
    .commit();

  const hooks: PpmdHooks = {
    onPredict: (ctx, sym, prob) => {
      rec
        .begin({
          zh: `上下文「${ctx}」预测 '${String.fromCharCode(sym)}' 概率 ${prob.toFixed(3)}`,
          en: `ctx "${ctx}" predicts '${String.fromCharCode(sym)}' p=${prob.toFixed(3)}`,
        })
        .setBars([{ value: Math.round(prob * 100), role: 'compare' as BarRole }])
        .commit();
    },
  };
  const { logLoss } = ppmd(symbols, order, 1, 256, hooks);

  rec
    .begin({
      zh: `完成：总信息量 ${logLoss.toFixed(1)} 位`,
      en: `Done: ${logLoss.toFixed(1)} bits total`,
    })
    .setMap([{ key: '负对数似然', value: logLoss.toFixed(1), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
