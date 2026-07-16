// =============================================================================
// 统计仪表盘
// 纯 CSS/SVG 绘制的算法数据看板：总数、分类分布、复杂度分布、收藏统计。
// =============================================================================

import type { AlgorithmMeta } from '../types.ts';
import { CATEGORIES, getCategory } from '../taxonomy.ts';
import { getFavorites } from '../core/storage.ts';

export function renderDashboard(host: HTMLElement, metas: readonly AlgorithmMeta[]): void {
  const total = metas.length;
  const favCount = getFavorites().length;

  // 分类分布（取 Top 12）
  const catCounts = new Map<string, number>();
  for (const m of metas) {
    catCounts.set(m.categoryId, (catCounts.get(m.categoryId) ?? 0) + 1);
  }
  const topCats = [...catCounts.entries()].sort((a, b) => b[1]! - a[1]!).slice(0, 12);
  const maxCat = topCats[0]?.[1] ?? 1;

  // 复杂度分布
  const complexityBuckets = [
    { label: 'O(1)', count: 0, match: /^O\(1\)/ },
    { label: 'O(log n)', count: 0, match: /^O\(log/ },
    { label: 'O(n)', count: 0, match: /^O\(n\)/ },
    { label: 'O(n log n)', count: 0, match: /^O\(n log/ },
    { label: 'O(n²)', count: 0, match: /^O\(n[²^]/ },
    { label: '其他', count: 0, match: /.*/ },
  ];
  for (const m of metas) {
    const t = m.complexity.time;
    for (const b of complexityBuckets) {
      if (b.match.test(t)) {
        b.count++;
        break;
      }
    }
  }
  const maxComplexity = Math.max(...complexityBuckets.map((b) => b.count), 1);

  const root = document.createElement('div');
  root.className = 'dashboard';

  // 总数 + 收藏
  const statsRow = document.createElement('div');
  statsRow.className = 'dashboard__stats';
  statsRow.innerHTML = `
    <div class="dashboard__stat">
      <span class="dashboard__stat-num">${total}</span>
      <span class="dashboard__stat-label">算法总数</span>
    </div>
    <div class="dashboard__stat">
      <span class="dashboard__stat-num">${CATEGORIES.length}</span>
      <span class="dashboard__stat-label">分类</span>
    </div>
    <div class="dashboard__stat">
      <span class="dashboard__stat-num">${favCount}</span>
      <span class="dashboard__stat-label">已收藏</span>
    </div>
  `;
  root.append(statsRow);

  // 分类分布柱状图
  const catSection = document.createElement('div');
  catSection.className = 'dashboard__section';
  const catTitle = document.createElement('div');
  catTitle.className = 'dashboard__section-title';
  catTitle.textContent = '分类分布（Top 12）';
  catSection.append(catTitle);
  for (const [catId, count] of topCats) {
    const cat = getCategory(catId);
    const row = document.createElement('div');
    row.className = 'dashboard__bar-row';
    const label = document.createElement('span');
    label.className = 'dashboard__bar-label';
    label.textContent = `${cat?.icon ?? ''} ${cat?.name.zh ?? catId}`;
    const barWrap = document.createElement('div');
    barWrap.className = 'dashboard__bar-wrap';
    const bar = document.createElement('div');
    bar.className = 'dashboard__bar';
    bar.style.width = `${(count! / maxCat) * 100}%`;
    if (cat) bar.style.background = `var(${cat.theme})`;
    const num = document.createElement('span');
    num.className = 'dashboard__bar-num';
    num.textContent = String(count);
    barWrap.append(bar);
    row.append(label, barWrap, num);
    catSection.append(row);
  }
  root.append(catSection);

  // 复杂度分布柱状图
  const compSection = document.createElement('div');
  compSection.className = 'dashboard__section';
  const compTitle = document.createElement('div');
  compTitle.className = 'dashboard__section-title';
  compTitle.textContent = '时间复杂度分布';
  compSection.append(compTitle);
  for (const b of complexityBuckets) {
    if (b.count === 0 && b.label === '其他') continue;
    const row = document.createElement('div');
    row.className = 'dashboard__bar-row';
    const label = document.createElement('span');
    label.className = 'dashboard__bar-label';
    label.textContent = b.label;
    const barWrap = document.createElement('div');
    barWrap.className = 'dashboard__bar-wrap';
    const bar = document.createElement('div');
    bar.className = 'dashboard__bar dashboard__bar--comp';
    bar.style.width = `${(b.count / maxComplexity) * 100}%`;
    const num = document.createElement('span');
    num.className = 'dashboard__bar-num';
    num.textContent = String(b.count);
    barWrap.append(bar);
    row.append(label, barWrap, num);
    compSection.append(row);
  }
  root.append(compSection);

  host.append(root);
}
