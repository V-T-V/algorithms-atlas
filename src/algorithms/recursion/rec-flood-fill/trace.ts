import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { floodFillCopy } from './impl.ts';

export const DEFAULT_IMAGE = [
  [1, 1, 1],
  [1, 1, 0],
  [1, 0, 1],
];
export const DEFAULT_SR = 1;
export const DEFAULT_SC = 1;
export const DEFAULT_NEW = 2;

export function buildTrace(
  opts: { image?: number[][]; sr?: number; sc?: number; newColor?: number } = {},
): Frame[] {
  const image = opts.image ?? DEFAULT_IMAGE;
  const sr = opts.sr ?? DEFAULT_SR;
  const sc = opts.sc ?? DEFAULT_SC;
  const newColor = opts.newColor ?? DEFAULT_NEW;
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `初始化 起点(${sr},${sc}) 新色${newColor}`,
      en: `Init start(${sr},${sc}) newColor${newColor}`,
    })
    .setGrid(image.map((row) => row.map((v) => ({ v, role: 'default' as BarRole }))))
    .setAux([{ label: '旧色', value: String(image[sr]?.[sc] ?? '?'), role: 'compare' as BarRole }])
    .commit();

  let filled: Array<[number, number]> = [];
  floodFillCopy(image, sr, sc, newColor, {
    onFill: (r, c, oldColor) => {
      filled = filled.concat([[r, c]]);
      rec
        .begin({
          zh: `填充 (${r},${c}) ${oldColor}→${newColor}`,
          en: `fill (${r},${c}) ${oldColor}→${newColor}`,
        })
        .setGrid(
          image.map((row, ri) =>
            row.map((v, ci) => ({
              v,
              role: (ri === r && ci === c
                ? 'swap'
                : filled.some(([fr, fc]) => fr === ri && fc === ci)
                  ? 'sorted'
                  : 'default') as BarRole,
            })),
          ),
        )
        .setAux([{ label: '位置', value: `(${r},${c})`, role: 'compare' as BarRole }])
        .commit();
    },
  });

  const result = floodFillCopy(image, sr, sc, newColor);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setGrid(
      result.map((row) =>
        row.map((v) => ({ v, role: (v === newColor ? 'final' : 'default') as BarRole })),
      ),
    )
    .setAux([{ label: '新色', value: String(newColor), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
