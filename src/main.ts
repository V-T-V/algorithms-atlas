// =============================================================================
// 入口：挂载根、监听路由、在 Lobby / 算法详情之间切换。
// =============================================================================

import './style.css';
import './lobby/lobby.css';

import { currentRoute, initRouter, navigate, onRoute } from './core/router.ts';
import { METAS, findMeta, loadDemo, loadSource } from './core/registry.ts';
import { recordVisit } from './core/storage.ts';
import { initTheme, toggleTheme } from './core/theme.ts';
import { renderLobby } from './lobby/Lobby.ts';
import { renderShell } from './shell/Shell.ts';
import { renderSolvePage } from './solve/SolvePage.ts';
import { mountAlgorithm } from './core/engine.ts';
import { getCategory } from './taxonomy.ts';

const app = document.getElementById('app')!;

// 初始化主题
initTheme();

// 全局主题切换按钮（固定在右上角）
const themeBtn = document.createElement('button');
themeBtn.type = 'button';
themeBtn.className = 'theme-toggle';
themeBtn.textContent = '🌙';
themeBtn.title = '切换深色/浅色主题';
themeBtn.addEventListener('click', () => {
  const t = toggleTheme();
  themeBtn.textContent = t === 'dark' ? '🌙' : '☀️';
});
document.body.append(themeBtn);

let currentEngine: { destroy: () => void } | null = null;

function showLobby(): void {
  currentEngine?.destroy();
  currentEngine = null;
  renderLobby(app, METAS);
}

async function showAlgorithm(id: string): Promise<void> {
  currentEngine?.destroy();
  currentEngine = null;

  const meta = findMeta(id);
  if (!meta) {
    app.replaceChildren();
    const p = document.createElement('div');
    p.className = 'lobby__empty';
    p.style.padding = '80px 20px';
    p.innerHTML = `找不到算法 <code>${id}</code>。<a href="#/">返回画廊</a>`;
    app.append(p);
    return;
  }

  const { stage } = renderShell(app, meta);
  const themeVar = getCategory(meta.categoryId)?.theme ?? '--c-cyan';

  const demo = await loadDemo(id);
  if (!demo) {
    stage.replaceChildren();
    const p = document.createElement('p');
    p.textContent = '演示加载失败。';
    stage.append(p);
    return;
  }
  // 加载源码（用于源码同步高亮）
  const source = await loadSource(id);

  // 记录浏览历史
  recordVisit(id);

  // 仅当仍停留在同一算法时才挂载（用户可能已导航离开）
  if (currentRoute().view === 'algorithm' && currentRoute().id === id) {
    currentEngine = mountAlgorithm(demo, { stage, themeVar, source });
  }
}

function showSolve(): void {
  currentEngine?.destroy();
  currentEngine = null;
  renderSolvePage(app, METAS);
}

onRoute((r) => {
  if (r.view === 'lobby') showLobby();
  else if (r.view === 'solve') showSolve();
  else if (r.id) void showAlgorithm(r.id);
});

initRouter();

// 全局快捷键：Esc 返回画廊
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && currentRoute().view === 'algorithm') navigate();
});
