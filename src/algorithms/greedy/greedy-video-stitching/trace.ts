// 视频拼接 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyVideoStitching, type GreedyVideoStitchingHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  clips: [
    [0, 2],
    [4, 6],
    [8, 10],
    [1, 9],
    [1, 5],
    [5, 9],
  ] as ReadonlyArray<readonly [number, number]>,
  T: 10,
};

export function buildTrace(
  input: { clips: ReadonlyArray<readonly [number, number]>; T: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { clips, T } = input;

  rec
    .begin({
      zh: `${clips.length} 片段，目标 [0,${T}]`,
      en: `${clips.length} clips, target [0,${T}]`,
    })
    .setBars(clips.map((c) => ({ value: c[1] - c[0], role: 'default' as BarRole })))
    .commit();

  const hooks: GreedyVideoStitchingHooks = {
    onPick: (clipIndex) => {
      rec
        .begin({ zh: `加入片段 ${clipIndex}`, en: `Add clip ${clipIndex}` })
        .setBars([{ value: clipIndex, role: 'final' as BarRole }])
        .commit();
    },
  };

  const result = greedyVideoStitching(clips, T, hooks);

  rec
    .begin({
      zh: `完成：${result === -1 ? '无法覆盖' : result + ' 段'}`,
      en: `Done: ${result === -1 ? 'impossible' : result + ' clips'}`,
    })
    .setAux([{ label: '片段数', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
