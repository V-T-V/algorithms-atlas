// ISBN-10 校验 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isValidIsbn10, type IsbnHooks } from './impl.ts';

export const DEFAULT_INPUT = '0-306-40615-2';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const isbn = input.replace(/[ s-]/g, '').toUpperCase();
  const labels = isbn.split('');
  const values = labels.map((ch) => (ch === 'X' ? 10 : Number(ch)));
  const contributions: number[] = new Array(values.length).fill(0);
  let runningSum = 0;
  let curIdx = -1;
  let finalValid = false;

  const render = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = values.map((_, i) =>
      i === curIdx ? 'compare' : i === values.length - 1 ? 'pivot' : 'sorted',
    );
    rec
      .begin(note)
      .setArray(
        [...values],
        roles,
        curIdx >= 0 ? [{ index: curIdx, label: `w=${10 - curIdx}` }] : [],
      )
      .setAux([
        { label: 'ISBN', value: `"${labels.join('')}"`, role: 'pivot' as BarRole },
        { label: '当前累加和', value: String(runningSum), role: 'swap' as BarRole },
        ...contributions.map((c, i) => ({
          label: `位 ${i + 1}`,
          value: `${labels[i]}×${10 - i}=${c}`,
          role: (i === curIdx ? 'compare' : 'sorted') as BarRole,
        })),
      ])
      .commit();
    curIdx = -1;
  };

  render({ zh: `校验 ISBN-10 "${labels.join('')}"`, en: `Validate ISBN-10 "${labels.join('')}"` });

  const hooks: IsbnHooks = {
    onDigit: (i, digit, weight, c) => {
      curIdx = i - 1;
      contributions[i - 1] = c;
      runningSum = contributions.reduce((s, x) => s + x, 0);
      render({
        zh: `位 ${i}：${digit} × ${weight} = ${c}`,
        en: `Pos ${i}: ${digit} × ${weight} = ${c}`,
      });
    },
    onSum: (s) => {
      runningSum = s;
      render({ zh: `总和 = ${s}，模 11 = ${s % 11}`, en: `Sum = ${s}, mod 11 = ${s % 11}` });
    },
    onResult: (valid) => {
      finalValid = valid;
    },
  };

  isValidIsbn10(input, hooks);

  rec
    .begin({
      zh: finalValid ? `合法 ✓（和 % 11 == 0）` : `非法 ✗`,
      en: finalValid ? `Valid ✓ (sum % 11 == 0)` : `Invalid ✗`,
    })
    .setArray(
      [...values],
      values.map(() => (finalValid ? 'final' : 'warn') as BarRole),
      [],
    )
    .setAux([
      {
        label: '结果',
        value: finalValid ? '合法 / valid' : '非法 / invalid',
        role: (finalValid ? 'final' : 'warn') as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
