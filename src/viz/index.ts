// =============================================================================
// viz 统一入口 · renderFrame
// 按帧中存在的字段，选择合适的可视化原语渲染。
// 优先级：graph > tree > array2d > bars > array > map > aux
// （一帧通常只用一种；多种共存时按优先级取主视图，其余信息走 note。）
// =============================================================================

import type { Frame } from '../types.ts';
import { renderBars, hasBars } from './Bars.ts';
import { renderArrayView, hasArray } from './ArrayView.ts';
import { renderArray2D, hasGrid } from './Array2D.ts';
import { renderGraph, hasGraph } from './Graph.ts';
import { renderTree, hasTree } from './Tree.ts';
import { renderAux, hasAux, renderMap, hasMap } from './Steps.ts';

export function renderFrame(host: HTMLElement, f: Frame | undefined): void {
  if (!f) {
    host.replaceChildren();
    return;
  }
  if (hasGraph(f)) return renderGraph(host, f.graph);
  if (hasTree(f)) return renderTree(host, f.tree);
  if (hasGrid(f)) return renderArray2D(host, f.array2d);
  if (hasBars(f)) return renderBars(host, f.bars);
  if (hasArray(f)) return renderArrayView(host, f.array);
  if (hasMap(f)) return renderMap(host, f.map);
  if (hasAux(f)) return renderAux(host, f.aux);
  host.replaceChildren();
}
