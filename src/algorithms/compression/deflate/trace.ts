// DEFLATE · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { deflate, type DeflateHooks } from './impl.ts';

export interface DeflateInput {
  data: number[];
}

export const DEFAULT_INPUT: DeflateInput = {
  data: Array.from('ABRACADABRA').map((c) => c.charCodeAt(0)),
};

/** 录制演示帧序列。 */
export function buildTrace(input: DeflateInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { data } = input;
  const decoded = data.map((b) => String.fromCharCode(b)).join('');

  rec
    .begin({ zh: `输入「${decoded}」`, en: `Input "${decoded}"` })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();

  const hooks: DeflateHooks = {
    onMatch: (_pos, length, distance) => {
      rec
        .begin({
          zh: `匹配：长度 ${length}，距离 ${distance}`,
          en: `Match: len ${length}, dist ${distance}`,
        })
        .setAux([
          { label: '长度', value: String(length), role: 'swap' as BarRole },
          { label: '距离', value: String(distance), role: 'compare' as BarRole },
        ])
        .commit();
    },
    onLiteral: (_pos, ch) => {
      rec
        .begin({
          zh: `字面量 '${String.fromCharCode(ch)}'`,
          en: `Literal '${String.fromCharCode(ch)}'`,
        })
        .setBars([{ value: ch, role: 'compare' as BarRole }])
        .commit();
    },
  };
  const { tokens } = deflate(data, 32, 3, hooks);

  rec
    .begin({ zh: `完成：${tokens.length} 个 token`, en: `Done: ${tokens.length} tokens` })
    .setMap([{ key: 'token 数', value: String(tokens.length), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
