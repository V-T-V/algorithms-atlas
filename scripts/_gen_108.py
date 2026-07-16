#!/usr/bin/env python3
# Temporary generator for 108 new algorithms. Produces 4 files + 1 test per algorithm.
import os, shutil

ROOT = r"D:\M_X_M\algorithms-atlas"
SRC = os.path.join(ROOT, "src", "algorithms")
TEST = os.path.join(ROOT, "test")

META_HEADER = """import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: __ID__,
  categoryId: __CAT__,
  title: { zh: __TZH__, en: __TEN__ },
  summary: {
    zh: __SZH__,
    en: __SEN__,
  },
  description: {
    zh: __DZH__,
    en: __DEN__,
  },
  tags: __TAGS__,
  complexity: { time: __TIME__, space: __SPACE__ },
};
"""

INDEX = """import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';

export { meta } from './meta.ts';

export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
"""

def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

import re

def fix_grid(trace_ts):
    # Convert setGrid(X.map((row) => row.map((v) => String(v)))) into Cell objects
    # with role 'default', since setGrid requires Cell[][], not string[][].
    pattern = r"\.setGrid\(([A-Za-z_]+)\.map\(\(row\) => row\.map\(\(v\) => String\(v\)\)\)\)"
    def repl(m):
        var = m.group(1)
        return (f".setGrid({var}.map((row) => row.map((v) => "
                f"({{ v: String(v), role: 'default' as BarRole }}))))")
    return re.sub(pattern, repl, trace_ts)

def emit(cat, algo):
    aid = algo["id"]
    base = os.path.join(SRC, cat, aid)
    os.makedirs(base, exist_ok=True)
    # meta - placeholder substitution (avoid .format collision with TS braces)
    def js_str(s):
        return "'" + str(s).replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n") + "'"
    meta_ts = (META_HEADER
        .replace("__ID__", js_str(aid))
        .replace("__CAT__", js_str(cat))
        .replace("__TZH__", js_str(algo["tzh"]))
        .replace("__TEN__", js_str(algo["ten"]))
        .replace("__SZH__", js_str(algo["szh"]))
        .replace("__SEN__", js_str(algo["sen"]))
        .replace("__DZH__", js_str(algo["dzh"]))
        .replace("__DEN__", js_str(algo["den"]))
        .replace("__TAGS__", str(algo["tags"]).replace("'", "'"))
        .replace("__TIME__", js_str(algo["time"]))
        .replace("__SPACE__", js_str(algo["space"])))
    write(os.path.join(base, "meta.ts"), meta_ts)
    # impl / trace / index
    write(os.path.join(base, "impl.ts"), algo["impl"])
    trace_ts = fix_grid(algo["trace"])
    write(os.path.join(base, "trace.ts"), trace_ts)
    write(os.path.join(base, "index.ts"), INDEX)
    # test
    write(os.path.join(TEST, cat, aid + ".test.ts"), algo["test"])

if __name__ == "__main__":
    # Import the data module holding all algo definitions
    import importlib.util
    spec = importlib.util.spec_from_file_location("data", os.path.join(os.path.dirname(__file__), "_gen_data.py"))
    data = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(data)
    for algo in data.ALL:
        emit(algo["cat"], algo)
    print(f"Generated {len(data.ALL)} algorithms")
