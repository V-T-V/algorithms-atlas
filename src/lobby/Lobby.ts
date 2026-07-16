// =============================================================================
// Lobby —— 算法画廊首页
//   - 搜索（中英文名/摘要/标签）
//   - 分类过滤（30 类）
//   - 复杂度筛选
//   - 虚拟滚动卡片网格（承载 3000 条）
// =============================================================================

import type { AlgorithmMeta } from '../types.ts';
import { CATEGORIES, getCategory } from '../taxonomy.ts';
import { navigate } from '../core/router.ts';
import { searchable } from './util.ts';
import { VirtualList } from './VirtualList.ts';
import { LEARNING_PATHS, matchesLearningPath, type LearningPathId } from './learningPaths.ts';
import { getHistory, getFavorites } from '../core/storage.ts';
import { renderDashboard } from './Dashboard.ts';
import { inferDifficulty, DIFFICULTY_LABELS, type Difficulty } from '../core/difficulty.ts';

export function renderLobby(host: HTMLElement, metas: readonly AlgorithmMeta[]): void {
  host.replaceChildren();

  const root = document.createElement('div');
  root.className = 'lobby';

  // —— 头部 ——
  const header = document.createElement('div');
  header.className = 'lobby__header';
  header.innerHTML = `
    <h1 class="lobby__title">算法图谱 <small>Algorithms Atlas</small></h1>
    <div class="lobby__stats">
      <span>共 <b>${metas.length}</b> 个算法</span>
      <span><b>${CATEGORIES.length}</b> 大类</span>
      <span>目标 <b>3000</b></span>
    </div>
  `;

  // 问题求解入口按钮
  const solveBtn = document.createElement('button');
  solveBtn.type = 'button';
  solveBtn.className = 'lobby__solve-btn';
  solveBtn.innerHTML = '🔍 问题求解';
  solveBtn.addEventListener('click', () => navigate('solve'));
  header.append(solveBtn);

  root.append(header);

  // —— 收藏 + 浏览历史 快捷区 ——
  const favIds = getFavorites();
  const histIds = getHistory().filter((id) => !favIds.includes(id)).slice(0, 8);
  if (favIds.length > 0 || histIds.length > 0) {
    const quickRow = document.createElement('div');
    quickRow.className = 'lobby__quick';
    if (favIds.length > 0) {
      const favSection = document.createElement('div');
      favSection.className = 'lobby__quick-section';
      favSection.innerHTML = '<span class="lobby__quick-label">★ 收藏</span>';
      for (const fid of favIds.slice(0, 10)) {
        const fm = metas.find((m) => m.id === fid);
        if (!fm) continue;
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'lobby__quick-chip';
        chip.textContent = fm.title.zh;
        chip.addEventListener('click', () => navigate(fm.id));
        favSection.append(chip);
      }
      quickRow.append(favSection);
    }
    if (histIds.length > 0) {
      const histSection = document.createElement('div');
      histSection.className = 'lobby__quick-section';
      histSection.innerHTML = '<span class="lobby__quick-label">🕑 最近浏览</span>';
      for (const hid of histIds) {
        const hm = metas.find((m) => m.id === hid);
        if (!hm) continue;
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'lobby__quick-chip';
        chip.textContent = hm.title.zh;
        chip.addEventListener('click', () => navigate(hm.id));
        histSection.append(chip);
      }
      quickRow.append(histSection);
    }
    root.append(quickRow);
  }

  // —— 统计仪表盘 ——
  renderDashboard(root, metas);

  // —— 工具栏 ——
  const toolbar = document.createElement('div');
  toolbar.className = 'lobby__toolbar';

  const search = document.createElement('input');
  search.type = 'search';
  search.className = 'lobby__search';
  search.placeholder = '搜索算法 / Search algorithms…';

  const cats = document.createElement('div');
  cats.className = 'lobby__cats';
  const catAll = catBtn('全部', 'all', true);
  cats.append(catAll);
  for (const c of CATEGORIES) {
    cats.append(catBtn(`${c.icon} ${c.name.zh}`, c.id, false));
  }

  const paths = document.createElement('div');
  paths.className = 'lobby__paths';
  for (const path of LEARNING_PATHS) {
    paths.append(pathBtn(path.label, path.id, path.description, path.id === 'all'));
  }

  const count = document.createElement('span');
  count.className = 'lobby__count';

  // 标签云：统计热门标签（排除类别名本身）
  const tagCounts = new Map<string, number>();
  for (const m of metas) {
    for (const t of m.tags) {
      if (!CATEGORIES.some((c) => c.id === t)) {
        tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
      }
    }
  }
  const topTags = [...tagCounts.entries()].sort((a, b) => b[1]! - a[1]!).slice(0, 20).map((e) => e[0]);
  let activeTag = '';

  const tagCloud = document.createElement('div');
  tagCloud.className = 'lobby__tags';
  if (topTags.length > 0) {
    const tagLabel = document.createElement('span');
    tagLabel.className = 'lobby__tags-label';
    tagLabel.textContent = '🏷️ 标签';
    tagCloud.append(tagLabel);
    const allTagBtn = document.createElement('button');
    allTagBtn.type = 'button';
    allTagBtn.className = 'lobby__tag is-active';
    allTagBtn.textContent = '全部';
    allTagBtn.dataset.tag = '';
    tagCloud.append(allTagBtn);
    for (const t of topTags) {
      const tb = document.createElement('button');
      tb.type = 'button';
      tb.className = 'lobby__tag';
      tb.textContent = `${t} (${tagCounts.get(t)})`;
      tb.dataset.tag = t;
      tagCloud.append(tb);
    }
  }

  // 排序选项
  const sortSelect = document.createElement('select');
  sortSelect.className = 'lobby__sort';
  for (const [val, label] of [
    ['default', '默认顺序'],
    ['name', '按名称'],
    ['complexity', '按复杂度'],
  ] as const) {
    const o = document.createElement('option');
    o.value = val;
    o.textContent = label;
    sortSelect.append(o);
  }

  // 难度筛选
  const diffSelect = document.createElement('select');
  diffSelect.className = 'lobby__sort';
  for (const [val, label] of [
    ['all', '全部难度'],
    ['beginner', DIFFICULTY_LABELS.beginner.zh],
    ['intermediate', DIFFICULTY_LABELS.intermediate.zh],
    ['advanced', DIFFICULTY_LABELS.advanced.zh],
  ] as const) {
    const o = document.createElement('option');
    o.value = val;
    o.textContent = label;
    diffSelect.append(o);
  }

  toolbar.append(search, paths, cats, tagCloud, sortSelect, diffSelect, count);
  root.append(toolbar);

  // —— 列表容器 ——
  const listHost = document.createElement('div');
  listHost.className = 'lobby__list';
  root.append(listHost);

  host.append(root);

  // —— 状态 + 过滤 + 虚拟列表 ——
  let activeCat = 'all';
  let activePath: LearningPathId = 'all';
  let q = '';
  let sortBy: 'default' | 'name' | 'complexity' = 'default';
  let activeDiff: 'all' | Difficulty = 'all';

  const vl = new VirtualList<AlgorithmMeta>(listHost, {
    items: metas,
    itemHeight: 148,
    columns: 0, // 响应式：由 CSS grid auto-fill 决定
    renderItem: (m) => cardEl(m),
  });

  function applyFilter(): void {
    const ql = q.trim().toLowerCase();
    let filtered = metas.filter((m) => {
      if (!matchesLearningPath(m, activePath)) return false;
      if (activeCat !== 'all' && m.categoryId !== activeCat) return false;
      if (activeTag && !m.tags.includes(activeTag)) return false;
      if (activeDiff !== 'all' && inferDifficulty(m) !== activeDiff) return false;
      if (ql && !searchable(m).includes(ql)) return false;
      return true;
    });
    // 排序
    if (sortBy === 'name') {
      filtered = [...filtered].sort((a, b) => a.title.zh.localeCompare(b.title.zh, 'zh'));
    } else if (sortBy === 'complexity') {
      filtered = [...filtered].sort((a, b) => {
        const order = ['O(1)', 'O(log', 'O(n)', 'O(n log', 'O(n²)', 'O(n^2', 'O(2', 'O(n!', 'O(?)', 'O(p'];
        const ai = order.findIndex((p) => a.complexity.time.startsWith(p));
        const bi = order.findIndex((p) => b.complexity.time.startsWith(p));
        return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
      });
    }
    count.textContent = `${filtered.length} / ${metas.length}`;
    if (filtered.length === 0) {
      listHost.replaceChildren(emptyState(ql || activeCat));
    } else {
      // 重建虚拟列表（items 更新）
      vl.setItems(filtered);
    }
  }

  search.addEventListener('input', () => {
    q = search.value;
    applyFilter();
  });
  sortSelect.addEventListener('change', () => {
    sortBy = sortSelect.value as 'default' | 'name' | 'complexity';
    applyFilter();
  });
  diffSelect.addEventListener('change', () => {
    activeDiff = diffSelect.value as 'all' | Difficulty;
    applyFilter();
  });
  tagCloud.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const btn = t.closest('[data-tag]') as HTMLElement | null;
    if (!btn) return;
    activeTag = btn.dataset.tag!;
    tagCloud.querySelectorAll('.lobby__tag').forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    applyFilter();
  });
  cats.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const btn = t.closest('[data-cat]') as HTMLElement | null;
    if (!btn) return;
    activeCat = btn.dataset.cat!;
    cats.querySelectorAll('.lobby__cat').forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    applyFilter();
  });
  paths.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const btn = t.closest('[data-path]') as HTMLElement | null;
    if (!btn) return;
    activePath = btn.dataset.path as LearningPathId;
    paths.querySelectorAll('.lobby__path').forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    applyFilter();
  });

  applyFilter();
}

function catBtn(label: string, id: string, active: boolean): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'lobby__cat' + (active ? ' is-active' : '');
  b.textContent = label;
  b.dataset.cat = id;
  if (id !== 'all') {
    const c = getCategory(id);
    if (c) b.style.setProperty('--cat-color', `var(${c.theme})`);
  }
  return b;
}

function pathBtn(
  label: string,
  id: LearningPathId,
  description: string,
  active: boolean,
): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'lobby__path' + (active ? ' is-active' : '');
  b.textContent = label;
  b.dataset.path = id;
  b.title = description;
  return b;
}

function cardEl(m: AlgorithmMeta): HTMLElement {
  const cat = getCategory(m.categoryId);
  const card = document.createElement('div');
  card.className = 'card';
  card.tabIndex = 0;
  if (cat) card.style.setProperty('--card-color', `var(${cat.theme})`);
  card.innerHTML = `
    <div class="card__top">
      <span class="card__icon">${cat?.icon ?? '•'}</span>
      <span class="card__title">${escapeHtml(m.title.zh)}</span>
    </div>
    <div class="card__en">${escapeHtml(m.title.en)}</div>
    <div class="card__summary">${escapeHtml(m.summary.zh)}</div>
    <div class="card__foot">
      <span>${escapeHtml(cat?.name.zh ?? m.categoryId)}</span>
      <span class="card__diff card__diff--${inferDifficulty(m)}">${DIFFICULTY_LABELS[inferDifficulty(m)].zh}</span>
      <span class="card__time">${escapeHtml(m.complexity.time)}</span>
    </div>
    <div class="card__tags">${m.tags.slice(0, 4).map((t) => `<span class="card__tag">${escapeHtml(t)}</span>`).join('')}</div>
  `;
  card.addEventListener('click', () => navigate(m.id));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') navigate(m.id);
  });
  return card;
}

function emptyState(hint: string): HTMLElement {
  const d = document.createElement('div');
  d.className = 'lobby__empty';
  d.textContent = `没有匹配「${hint}」的算法`;
  return d;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });
}
