// =============================================================================
// 问题求解页面
// 用户输入问题 → 搜索引擎匹配算法 → 按相关度排序展示结果。
// =============================================================================

import type { AlgorithmMeta } from '../types.ts';
import { getCategory } from '../taxonomy.ts';
import { navigate } from '../core/router.ts';
import { SearchEngine, type SearchResult } from './search-engine.ts';
import { findCompositions, type Composition } from './composition.ts';

const EXAMPLES = [
  '如何找最短路径',
  '数组去重',
  '两个字符串的编辑距离',
  '排序算法',
  '最小生成树',
  '二分查找',
  '动态规划背包问题',
  '字符串模式匹配',
  '凸包',
  '拓扑排序调度',
  '排序后查找',
  '区间更新查询',
];

let engineInstance: SearchEngine | null = null;

function getEngine(metas: readonly AlgorithmMeta[]): SearchEngine {
  if (!engineInstance) {
    engineInstance = new SearchEngine();
    engineInstance.build(metas);
  }
  return engineInstance;
}

export function renderSolvePage(host: HTMLElement, metas: readonly AlgorithmMeta[]): void {
  host.replaceChildren();
  const root = document.createElement('div');
  root.className = 'solve';

  // 返回
  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'shell__back';
  back.innerHTML = '← 返回画廊';
  back.addEventListener('click', () => navigate());
  root.append(back);

  // 标题
  const title = document.createElement('h1');
  title.className = 'solve__title';
  title.textContent = '🔍 问题求解';
  root.append(title);

  const subtitle = document.createElement('p');
  subtitle.className = 'solve__subtitle';
  subtitle.textContent = '描述你的问题，自动推荐最相关的算法。';
  root.append(subtitle);

  // 输入区
  const inputWrap = document.createElement('div');
  inputWrap.className = 'solve__input-wrap';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'solve__input';
  input.placeholder = '描述你的问题…（如：如何找最短路径）';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'solve__btn';
  btn.textContent = '求解';

  inputWrap.append(input, btn);
  root.append(inputWrap);

  // 示例
  const examplesWrap = document.createElement('div');
  examplesWrap.className = 'solve__examples';
  const examplesLabel = document.createElement('span');
  examplesLabel.className = 'solve__examples-label';
  examplesLabel.textContent = '💡 示例：';
  examplesWrap.append(examplesLabel);
  for (const ex of EXAMPLES) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'solve__chip';
    chip.textContent = ex;
    chip.addEventListener('click', () => {
      input.value = ex;
      doSearch();
    });
    examplesWrap.append(chip);
  }
  root.append(examplesWrap);

  // 结果区
  const resultsWrap = document.createElement('div');
  resultsWrap.className = 'solve__results';
  root.append(resultsWrap);

  host.append(root);

  // 搜索
  const doSearch = (): void => {
    const query = input.value.trim();
    resultsWrap.replaceChildren();

    if (!query) {
      const hint = document.createElement('div');
      hint.className = 'solve__hint';
      hint.textContent = '请在上方输入你的问题。';
      resultsWrap.append(hint);
      return;
    }

    const engine = getEngine(metas);
    const results = engine.search(query, 20);
    const compositions = findCompositions(query, (q, l) => engine.search(q, l));

    if (results.length === 0 && compositions.length === 0) {
      const hint = document.createElement('div');
      hint.className = 'solve__hint';
      hint.textContent = `没有找到与「${query}」相关的算法。试试换个描述？`;
      resultsWrap.append(hint);
      return;
    }

    // 组合方案（优先展示）
    if (compositions.length > 0) {
      const compLabel = document.createElement('div');
      compLabel.className = 'solve__section-label';
      compLabel.textContent = `🔗 推荐组合方案（${compositions.length} 个）`;
      resultsWrap.append(compLabel);

      for (const comp of compositions) {
        resultsWrap.append(renderComposition(comp));
      }
    }

    // 单算法结果
    if (results.length > 0) {
      const resultLabel = document.createElement('div');
      resultLabel.className = 'solve__section-label';
      resultLabel.textContent = `📋 单算法匹配（${results.length} 个，按相关度排序）`;
      resultsWrap.append(resultLabel);

      for (const result of results) {
        resultsWrap.append(renderResultCard(result));
      }
    }
  };

  btn.addEventListener('click', doSearch);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });

  // 实时搜索（边打边搜，300ms 防抖）
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  input.addEventListener('input', () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (input.value.trim().length >= 2) doSearch();
    }, 300);
  });

  // 初始提示
  const hint = document.createElement('div');
  hint.className = 'solve__hint';
  hint.textContent = '输入问题后按回车或点击「求解」。';
  resultsWrap.append(hint);
}

function renderResultCard(result: SearchResult): HTMLElement {
  const { meta, score } = result;
  const cat = getCategory(meta.categoryId);

  const card = document.createElement('div');
  card.className = 'solve__card';
  card.tabIndex = 0;

  // 匹配度
  const scoreEl = document.createElement('span');
  scoreEl.className = 'solve__score';
  scoreEl.textContent = `${score}%`;
  if (score >= 70) scoreEl.classList.add('solve__score--high');
  else if (score >= 40) scoreEl.classList.add('solve__score--mid');

  // 标题行
  const topRow = document.createElement('div');
  topRow.className = 'solve__card-top';
  topRow.append(scoreEl);
  const titleEl = document.createElement('span');
  titleEl.className = 'solve__card-title';
  if (cat) {
    const icon = document.createElement('span');
    icon.textContent = cat.icon + ' ';
    titleEl.append(icon);
  }
  titleEl.append(document.createTextNode(meta.title.zh));
  topRow.append(titleEl);

  // 元信息
  const metaRow = document.createElement('div');
  metaRow.className = 'solve__card-meta';
  metaRow.textContent = `${cat?.name.zh ?? meta.categoryId} · ${meta.complexity.time}`;

  // 摘要
  const summary = document.createElement('div');
  summary.className = 'solve__card-summary';
  summary.textContent = meta.summary.zh;

  card.append(topRow, metaRow, summary);

  card.addEventListener('click', () => navigate(meta.id));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') navigate(meta.id);
  });

  return card;
}

function renderComposition(comp: Composition): HTMLElement {
  const card = document.createElement('div');
  card.className = 'solve__composition';

  // 标题行
  const titleRow = document.createElement('div');
  titleRow.className = 'solve__comp-title';
  titleRow.textContent = comp.title;
  card.append(titleRow);

  // 描述
  const desc = document.createElement('div');
  desc.className = 'solve__comp-desc';
  desc.textContent = comp.description;
  card.append(desc);

  // 步骤
  for (const step of comp.steps) {
    const stepEl = document.createElement('div');
    stepEl.className = 'solve__comp-step';

    const stepNum = document.createElement('span');
    stepNum.className = 'solve__comp-step-num';
    stepNum.textContent = String(step.step);

    const stepContent = document.createElement('div');
    stepContent.className = 'solve__comp-step-content';

    const stepDesc = document.createElement('div');
    stepDesc.className = 'solve__comp-step-desc';
    stepDesc.textContent = step.description;
    stepContent.append(stepDesc);

    // 推荐算法
    if (step.algorithms && step.algorithms.length > 0) {
      const algoList = document.createElement('div');
      algoList.className = 'solve__comp-algos';
      for (const algo of step.algorithms.slice(0, 3)) {
        const algoChip = document.createElement('button');
        algoChip.type = 'button';
        algoChip.className = 'solve__comp-algo';
        algoChip.textContent = `${algo.meta.title.zh}`;
        algoChip.title = `${algo.meta.complexity.time}`;
        algoChip.addEventListener('click', (e) => {
          e.stopPropagation();
          navigate(algo.meta.id);
        });
        algoList.append(algoChip);
      }
      stepContent.append(algoList);
    }

    stepEl.append(stepNum, stepContent);
    card.append(stepEl);
  }

  return card;
}
