// BWT · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bwt, type BwtHooks } from './impl.ts';

export interface BwtInput {
  text: string;
}

export const DEFAULT_INPUT: BwtInput = { text: 'BANANA' };

/** 录制演示帧序列。 */
export function buildTrace(input: BwtInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text } = input;

  rec
    .begin({ zh: `输入「${text}」`, en: `Input "${text}"` })
    .setAux([{ label: '文本', value: text, role: 'default' as BarRole }])
    .commit();

  const hooks: BwtHooks = {
    onSort: (rotations) => {
      rec
        .begin({
          zh: `生成并排序 ${rotations.length} 个轮转`,
          en: `Generate and sort ${rotations.length} rotations`,
        })
        .setGrid(rec.gridFrom(rotations.map((r) => r.split(''))))
        .commit();
    },
  };
  const { lastColumn, primary } = bwt(text, '', hooks);

  rec
    .begin({
      zh: `完成：最后一列「${lastColumn}」，主索引 ${primary}`,
      en: `Done: last column "${lastColumn}", primary ${primary}`,
    })
    .setMap([
      { key: '最后一列', value: lastColumn, role: 'final' as BarRole },
      { key: '主索引', value: String(primary), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
