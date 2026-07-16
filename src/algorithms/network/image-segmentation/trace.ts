// =============================================================================
// 图像分割 · 录制帧序列
// 用 setBars 显示像素值，setGrid 显示分割标签（Cell 用 {v, role}）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { imageSegmentation, type SegInput } from './impl.ts';

export const DEFAULT_INPUT: SegInput = {
  rows: 4,
  cols: 4,
  pixels: [
    // 亮块（前景）在左上，暗块（背景）在右下
    220, 230, 210, 60, 225, 215, 70, 55, 200, 65, 50, 40, 70, 55, 45, 35,
  ],
  fgSeeds: [0],
  bgSeeds: [15],
  sigma: 30,
  lambda: 2,
};

export function buildTrace(input: SegInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { rows, cols, pixels } = input;

  // 初始帧：用 setBars 显示像素
  const toPixelBars = () =>
    pixels.map((v) => ({
      value: v,
      role: 'default' as BarRole,
      label: String(v),
    }));

  // 初始网格：显示像素值
  const toPixelGrid = (labels?: number[]) =>
    Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => {
        const idx = r * cols + c;
        return {
          v: String(pixels[idx]!),
          role: (labels && labels[idx] === 1 ? 'final' : 'default') as BarRole,
        };
      }),
    );

  rec
    .begin({
      zh: `输入：${rows}×${cols} 像素图，共 ${pixels.length} 个像素`,
      en: `Input: ${rows}x${cols} pixel grid, ${pixels.length} pixels`,
    })
    .setBars(toPixelBars())
    .setGrid(toPixelGrid())
    .setAux([
      { label: '像素数', value: String(pixels.length), role: 'pivot' as BarRole },
      { label: 'σ', value: String(input.sigma ?? 30), role: 'frontier' as BarRole },
      { label: 'λ', value: String(input.lambda ?? 1), role: 'frontier' as BarRole },
    ])
    .commit();

  let foregroundCount = 0;
  let backgroundCount = 0;

  const result = imageSegmentation(input, {
    onBuildGraph: (nodeCount, source, sink, edgeCount) => {
      rec
        .begin({
          zh: `建图：${nodeCount} 节点（源=${source} 前景，汇=${sink} 背景），${edgeCount} 条边（含邻域边 + 终端边）`,
          en: `Build graph: ${nodeCount} nodes (src=${source} fg, sink=${sink} bg), ${edgeCount} edges`,
        })
        .setBars(toPixelBars())
        .setAux([
          { label: '节点数', value: String(nodeCount), role: 'pivot' as BarRole },
          { label: '边数', value: String(edgeCount), role: 'frontier' as BarRole },
        ])
        .commit();
    },
    onCut: (flow, foreground) => {
      foregroundCount = foreground.length;
      rec
        .begin({
          zh: `最小割完成（最大流=${flow.toFixed(3)}）：${foreground.length} 个前景像素`,
          en: `Min-cut done (max-flow=${flow.toFixed(3)}): ${foreground.length} foreground pixels`,
        })
        .setBars(toPixelBars())
        .setAux([
          { label: '最大流', value: flow.toFixed(3), role: 'final' as BarRole },
          { label: '前景数', value: String(foreground.length), role: 'final' as BarRole },
        ])
        .commit();
    },
    onDone: (_labels, fg, bg) => {
      foregroundCount = fg;
      backgroundCount = bg;
    },
  });

  // 最终帧：用 setGrid 展示分割结果
  const segGrid = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const idx = r * cols + c;
      const label = result[idx]!;
      return {
        v: label === 1 ? 'F' : 'B',
        role: (label === 1 ? 'final' : 'default') as BarRole,
      };
    }),
  );

  rec
    .begin({
      zh: `完成：前景 ${foregroundCount} / 背景 ${backgroundCount}（F=前景，B=背景）`,
      en: `Done: fg ${foregroundCount} / bg ${backgroundCount} (F=foreground, B=background)`,
    })
    .setBars(
      pixels.map((v, i) => ({
        value: v,
        role: (result[i]! === 1 ? 'final' : 'default') as BarRole,
        label: String(v),
      })),
    )
    .setGrid(segGrid)
    .setAux([
      { label: '前景像素', value: String(foregroundCount), role: 'final' as BarRole },
      { label: '背景像素', value: String(backgroundCount), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
