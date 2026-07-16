// TOML 子集解析器 · 纯算法实现

export type TomlValue = string | number | boolean | TomlValue[] | TomlTable;
export interface TomlTable {
  [key: string]: TomlValue;
}

export interface TomlLine {
  lineNo: number;
  kind: 'blank' | 'comment' | 'section' | 'kv';
  section?: string;
  key?: string;
  rawValue?: string;
}

/** 事件钩子。 */
export interface TomlHooks {
  /** 识别出一行（给出类型）。 */
  onLine?: (line: TomlLine) => void;
  /** 进入某节。 */
  onSection?: (section: string) => void;
  /** 解析出某键值（给出 key 与解析后的值）。 */
  onKeyValue?: (key: string, value: TomlValue) => void;
  /** 完成。 */
  onResult?: (root: TomlTable) => void;
}

/** 解析单个值字面量。 */
function parseValue(raw: string): TomlValue {
  const s = raw.trim();
  // 字符串
  if (s.startsWith('"') && s.endsWith('"')) return s.slice(1, -1);
  if (s.startsWith("'") && s.endsWith("'")) return s.slice(1, -1);
  // 布尔
  if (s === 'true') return true;
  if (s === 'false') return false;
  // 数组
  if (s.startsWith('[') && s.endsWith(']')) {
    const inner = s.slice(1, -1).trim();
    if (inner === '') return [];
    return inner.split(',').map((p) => parseValue(p));
  }
  // 整数（含负）
  if (/^-? d+$/.test(s)) return parseInt(s, 10);
  // 浮点
  if (/^-? d+\. d+$/.test(s)) return parseFloat(s);
  // 兜底：当作字符串
  return s;
}

/** 在 root 中按点号路径取得/创建嵌套表。 */
function navigate(root: TomlTable, path: string[]): TomlTable {
  let cur: TomlTable = root;
  for (const seg of path) {
    if (cur[seg] === undefined || typeof cur[seg] !== 'object' || Array.isArray(cur[seg])) {
      cur[seg] = {};
    }
    cur = cur[seg] as TomlTable;
  }
  return cur;
}

/**
 * 解析 TOML 子集文本为嵌套对象。
 *
 * @param text TOML 文本
 * @param hooks 可选事件钩子
 * @returns 根表
 */
export function parseToml(text: string, hooks: TomlHooks = {}): TomlTable {
  const root: TomlTable = {};
  let currentTable = root;
  const lines = text.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]!;
    const line = raw.trim();
    const lineNo = i + 1;

    if (line === '') {
      hooks.onLine?.({ lineNo, kind: 'blank' });
      continue;
    }
    if (line.startsWith('#')) {
      hooks.onLine?.({ lineNo, kind: 'comment' });
      continue;
    }
    // 节 [section]
    const secMatch = /^\[(.+)\]$/.exec(line);
    if (secMatch) {
      const section = secMatch[1]!.trim();
      hooks.onLine?.({ lineNo, kind: 'section', section });
      const path = section.split('.').map((p) => p.trim());
      currentTable = navigate(root, path);
      hooks.onSection?.(section);
      continue;
    }
    // 键值 key = value
    const eqIdx = line.indexOf('=');
    if (eqIdx > 0) {
      const key = line.slice(0, eqIdx).trim();
      const rawValue = line.slice(eqIdx + 1).trim();
      hooks.onLine?.({ lineNo, kind: 'kv', key, rawValue });
      const value = parseValue(rawValue);
      currentTable[key] = value;
      hooks.onKeyValue?.(key, value);
      continue;
    }
    // 无法识别
    hooks.onLine?.({ lineNo, kind: 'blank' });
  }
  hooks.onResult?.(root);
  return root;
}
