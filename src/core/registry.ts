// =============================================================================
// 算法注册表 · 自动发现
//   - 演示代码（impl/trace/index）懒加载：glob index.ts
//   - 元数据（meta）静态收集：glob meta.ts（轻量字符串，打进首包无妨）
// 把两者分文件，确保演示代码真正按需分块，不被静态拉进首包。
// 新增算法只需建文件夹（含 index.ts + meta.ts）。
// =============================================================================

import type { AlgorithmMeta, Demo } from '../types.ts';

// —— 懒加载的工厂映射：id → () => Promise<Demo> ——
const LAZY = import.meta.glob('../algorithms/*/*/index.ts') as Record<
  string,
  () => Promise<{ createDemo: () => Promise<Demo> }>
>;

export const demoFactories: ReadonlyMap<string, () => Promise<Demo>> = (() => {
  const m = new Map<string, () => Promise<Demo>>();
  for (const [path, loader] of Object.entries(LAZY)) {
    const id = path.split('/').slice(-2, -1)[0];
    if (!id) continue;
    m.set(id, async () => (await loader()).createDemo());
  }
  return m;
})();

// —— 同步元数据登记：eager 加载 meta.ts（仅纯数据，不含演示代码）。
const META_MODULES = import.meta.glob('../algorithms/*/*/meta.ts', {
  eager: true,
  import: 'meta',
}) as Record<string, { meta: AlgorithmMeta }>;

export const METAS: readonly AlgorithmMeta[] = Object.values(META_MODULES).map((m) => m.meta);

const META_BY_ID = new Map<string, AlgorithmMeta>(METAS.map((m) => [m.id, m]));

export function findMeta(id: string): AlgorithmMeta | undefined {
  return META_BY_ID.get(id);
}

export async function loadDemo(id: string): Promise<Demo | undefined> {
  const factory = demoFactories.get(id);
  if (!factory) return undefined;
  return factory();
}

export function hasDemo(id: string): boolean {
  return demoFactories.has(id);
}

// —— 源码懒加载：id → () => Promise<string>（?raw 导入 impl.ts 文本）——
const SOURCES = import.meta.glob('../algorithms/*/*/impl.ts', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

const sourceFactories: ReadonlyMap<string, () => Promise<string>> = (() => {
  const m = new Map<string, () => Promise<string>>();
  for (const [path, loader] of Object.entries(SOURCES)) {
    const id = path.split('/').slice(-2, -1)[0];
    if (id) m.set(id, loader);
  }
  return m;
})();

export async function loadSource(id: string): Promise<string | undefined> {
  const factory = sourceFactories.get(id);
  if (!factory) return undefined;
  try {
    return await factory();
  } catch {
    return undefined;
  }
}
