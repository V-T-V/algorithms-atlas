#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Shared generation library for all 6 categories.

Each category script imports build_category() and passes its algorithm list.
"""
import os

def esc(s):
    """Escape single quotes/backslashes for embedding inside JS single-quoted strings."""
    return str(s).replace("\\", "\\\\").replace("'", "\\'")

def make_meta(id, cat, zh, en, szh, sen, dzh, den, tags, time, space):
    return f"""// {zh} · 元数据
import type {{ AlgorithmMeta }} from '../../../types.ts';

export const meta: AlgorithmMeta = {{
  id: '{id}',
  categoryId: '{cat}',
  title: {{ zh: '{esc(zh)}', en: '{esc(en)}' }},
  summary: {{
    zh: '{esc(szh)}',
    en: '{esc(sen)}',
  }},
  description: {{
    zh: '{esc(dzh)}',
    en: '{esc(den)}',
  }},
  tags: {tags},
  complexity: {{ time: '{time}', space: '{space}' }},
}};
"""

INDEX_TMPL = """import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';

export { meta } from './meta.ts';

export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
"""

def build_category(cat, root, test_root, algos):
    """algos: list of dicts with keys id, zh, en, szh, sen, dzh, den, tags, time, space, impl, trace, test."""
    count = 0
    for a in algos:
        folder = os.path.join(root, a['id'])
        os.makedirs(folder, exist_ok=True)
        with open(os.path.join(folder, "meta.ts"), "w", encoding="utf-8") as f:
            f.write(make_meta(a['id'], cat, a['zh'], a['en'], a['szh'], a['sen'],
                              a['dzh'], a['den'], a['tags'], a['time'], a['space']))
        with open(os.path.join(folder, "impl.ts"), "w", encoding="utf-8") as f:
            f.write(a['impl'].lstrip("\n"))
        with open(os.path.join(folder, "trace.ts"), "w", encoding="utf-8") as f:
            f.write(a['trace'].lstrip("\n"))
        with open(os.path.join(folder, "index.ts"), "w", encoding="utf-8") as f:
            f.write(INDEX_TMPL)
        os.makedirs(test_root, exist_ok=True)
        with open(os.path.join(test_root, f"{a['id']}.test.ts"), "w", encoding="utf-8") as f:
            f.write(a['test'].lstrip("\n"))
        count += 1
    print(f"[{cat}] Generated {count} algorithms")
    return count

# ---- Shared helpers for search-like (array + target) algorithms ----

def std_search_trace(id, fn, hooks_type, default_input, default_target, hook_field='onCompare', hook_note='比较'):
    """A trace for searching a target in a sorted array using onCompare(i) hook and array viz."""
    return f"""import type {{ BarRole, Frame }} from '../../../types.ts';
import {{ TraceRecorder }} from '../../../core/recorder.ts';
import {{ {fn}, type {hooks_type} }} from './impl.ts';

export const DEFAULT_INPUT = {default_input};
export const DEFAULT_TARGET = {default_target};

export function buildTrace(input: number[] = DEFAULT_INPUT, target: number = DEFAULT_TARGET): Frame[] {{
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;
  rec
    .begin({{ zh: `在升序数组中查找 ${{target}}`, en: `Search ${{target}} in sorted array` }})
    .setArray(values, undefined, [])
    .commit();
  const hooks: {hooks_type} = {{
    {hook_field}: (i: number) => {{
      const roles: BarRole[] = new Array(n).fill('default');
      roles[i] = 'compare';
      rec
        .begin({{ zh: `{hook_note} a[${{i}}]=${{values[i]}}`, en: `{hook_note} a[${{i}}]=${{values[i]}}` }})
        .setArray(values, roles, [{{ index: i, label: 'i' }}])
        .commit();
    }},
  }};
  const result = {fn}(input, target, hooks);
  const roles: BarRole[] = new Array(n).fill('default');
  if (result >= 0) roles[result] = 'final';
  rec
    .begin(result >= 0 ? {{ zh: `命中下标 ${{result}}`, en: `Found at ${{result}}` }} : {{ zh: `未找到`, en: `Not found` }})
    .setArray(values, roles, result >= 0 ? [{{ index: result, label: '✓' }}] : [])
    .commit();
  return rec.build();
}}
"""
