// =============================================================================
// Shell —— 算法详情页外壳
//   标题 / 分类 / 复杂度 / 标签 / 中英双语描述切换 / 演示舞台
//   演示舞台由 engine.mountAlgorithm 接管。
// =============================================================================

import type { AlgorithmMeta } from '../types.ts';
import { getCategory } from '../taxonomy.ts';
import { navigate } from '../core/router.ts';
import { METAS } from '../core/registry.ts';
import { isFavorite, toggleFavorite } from '../core/storage.ts';

export interface ShellHandle {
  /** 演示舞台容器，交给 engine。 */
  stage: HTMLElement;
}

export function renderShell(host: HTMLElement, meta: AlgorithmMeta): ShellHandle {
  const cat = getCategory(meta.categoryId);
  const root = document.createElement('div');
  root.className = 'shell';

  // —— 返回 ——
  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'shell__back';
  back.innerHTML = '← 返回画廊';
  back.addEventListener('click', () => navigate());

  // 收藏按钮
  const favBtn = document.createElement('button');
  favBtn.type = 'button';
  favBtn.className = 'shell__fav';
  const updateFavBtn = (): void => {
    favBtn.textContent = isFavorite(meta.id) ? '★ 已收藏' : '☆ 收藏';
  };
  updateFavBtn();
  favBtn.addEventListener('click', () => {
    toggleFavorite(meta.id);
    updateFavBtn();
  });

  // 分享按钮
  const shareBtn = document.createElement('button');
  shareBtn.type = 'button';
  shareBtn.className = 'shell__fav';
  shareBtn.textContent = '🔗 复制链接';
  shareBtn.addEventListener('click', () => {
    const url = window.location.href;
    void navigator.clipboard.writeText(url).then(() => {
      shareBtn.textContent = '✅ 已复制';
      setTimeout(() => { shareBtn.textContent = '🔗 复制链接'; }, 2000);
    }).catch(() => {
      shareBtn.textContent = '❌ 失败';
      setTimeout(() => { shareBtn.textContent = '🔗 复制链接'; }, 2000);
    });
  });

  const topBar = document.createElement('div');
  topBar.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:var(--gap)';
  topBar.append(back, favBtn, shareBtn);
  root.append(topBar);

  // —— 头部 ——
  const head = document.createElement('div');
  head.className = 'shell__head';

  const left = document.createElement('div');
  const h1 = document.createElement('h1');
  h1.className = 'shell__h1';
  h1.innerHTML = `<span>${cat?.icon ?? '•'}</span> ${escapeHtml(meta.title.zh)}`;
  const metaRow = document.createElement('div');
  metaRow.className = 'shell__meta';
  const catBadge = cat
    ? `<span class="shell__cat" style="--cat-color:var(${cat.theme})">${escapeHtml(cat.name.zh)} · ${escapeHtml(cat.name.en)}</span>`
    : '';
  metaRow.innerHTML = `
    ${catBadge}
    <span>时间 <b>${escapeHtml(meta.complexity.time)}</b></span>
    <span>空间 <b>${escapeHtml(meta.complexity.space)}</b></span>
  `;
  const tags = document.createElement('div');
  tags.className = 'shell__tags';
  for (const t of meta.tags) {
    const s = document.createElement('span');
    s.className = 'shell__tag';
    s.textContent = `#${t}`;
    tags.append(s);
  }
  left.append(h1, metaRow, tags);

  // 右侧：双语切换
  const lang = document.createElement('div');
  lang.className = 'shell__lang';
  const zhBtn = document.createElement('button');
  zhBtn.type = 'button';
  zhBtn.textContent = '中文';
  zhBtn.classList.add('is-active');
  const enBtn = document.createElement('button');
  enBtn.type = 'button';
  enBtn.textContent = 'EN';
  lang.append(zhBtn, enBtn);

  head.append(left, lang);
  root.append(head);

  // —— 网格：演示 + 描述 ——
  const grid = document.createElement('div');
  grid.className = 'shell__grid';

  const demoCol = document.createElement('div');
  demoCol.className = 'shell__demo';
  const stage = document.createElement('div');
  demoCol.append(stage);

  const descCol = document.createElement('div');
  descCol.className = 'shell__desc';
  const descTitle = document.createElement('h3');
  descTitle.textContent = '描述 · Description';
  const descBody = document.createElement('div');
  descCol.append(descTitle, descBody);

  if (meta.references && meta.references.length > 0) {
    const refs = document.createElement('div');
    refs.className = 'shell__refs';
    refs.innerHTML = '<b>参考</b> ';
    for (const r of meta.references) {
      const a = document.createElement('a');
      a.href = r.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = r.label;
      refs.append(a, ' ');
    }
    descCol.append(refs);
  }

  // —— 同类算法推荐 ——
  const related = document.createElement('div');
  related.className = 'shell__related';
  const relatedTitle = document.createElement('h3');
  relatedTitle.textContent = '同类算法 · Related';
  related.append(relatedTitle);
  const relatedItems = METAS
    .filter((m) => m.categoryId === meta.categoryId && m.id !== meta.id)
    .slice(0, 6);
  const relatedList = document.createElement('div');
  relatedList.className = 'shell__related-list';
  for (const r of relatedItems) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'shell__related-chip';
    chip.textContent = r.title.zh;
    chip.title = r.summary.zh;
    chip.addEventListener('click', () => navigate(r.id));
    relatedList.append(chip);
  }
  if (relatedItems.length === 0) {
    const empty = document.createElement('span');
    empty.style.cssText = 'font-size:12px;color:var(--ink-faint)';
    empty.textContent = '暂无同类算法';
    relatedList.append(empty);
  }
  related.append(relatedList);
  descCol.append(related);

  grid.append(demoCol, descCol);
  root.append(grid);

  host.replaceChildren(root);

  // —— 双语切换 ——
  function setDesc(which: 'zh' | 'en'): void {
    descBody.innerHTML = toHtml(meta.description[which]);
    zhBtn.classList.toggle('is-active', which === 'zh');
    enBtn.classList.toggle('is-active', which === 'en');
  }
  setDesc('zh');
  zhBtn.addEventListener('click', () => setDesc('zh'));
  enBtn.addEventListener('click', () => setDesc('en'));

  return { stage };
}

/** 极简 Markdown → HTML（段落 / `代码` / *斜体* / - 列表）。 */
function toHtml(md: string): string {
  const lines = md.split('\n');
  const out: string[] = [];
  let inList = false;
  const esc = (s: string) =>
    escapeHtml(s)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('- ')) {
      if (!inList) {
        out.push('<ul>');
        inList = true;
      }
      out.push(`<li>${esc(line.slice(2))}</li>`);
      continue;
    }
    if (inList) {
      out.push('</ul>');
      inList = false;
    }
    if (line) out.push(`<p>${esc(line)}</p>`);
  }
  if (inList) out.push('</ul>');
  return out.join('');
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
