#!/usr/bin/env python3
# Temporary bulk generator. Reads data_<cat>.py and emits 4 files + 1 test per algorithm.
# Data files: scripts/gen_data/<cat>.py exporting ALGS list.
import os, sys, importlib.util

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
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)

def js_str(s):
    return "'" + str(s).replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n") + "'"

def emit(cat, algo):
    aid = algo["id"]
    base = os.path.join(SRC, cat, aid)
    if os.path.exists(base):
        print(f"  SKIP (exists): {cat}/{aid}")
        return False
    os.makedirs(base, exist_ok=True)
    meta_ts = (META_HEADER
        .replace("__ID__", js_str(aid))
        .replace("__CAT__", js_str(cat))
        .replace("__TZH__", js_str(algo["tzh"]))
        .replace("__TEN__", js_str(algo["ten"]))
        .replace("__SZH__", js_str(algo["szh"]))
        .replace("__SEN__", js_str(algo["sen"]))
        .replace("__DZH__", js_str(algo["dzh"]))
        .replace("__DEN__", js_str(algo["den"]))
        .replace("__TAGS__", str(algo["tags"]))
        .replace("__TIME__", js_str(algo["time"]))
        .replace("__SPACE__", js_str(algo["space"])))
    write(os.path.join(base, "meta.ts"), meta_ts)
    write(os.path.join(base, "impl.ts"), algo["impl"])
    write(os.path.join(base, "trace.ts"), algo["trace"])
    write(os.path.join(base, "index.ts"), INDEX)
    write(os.path.join(TEST, cat, aid + ".test.ts"), algo["test"])
    print(f"  OK {cat}/{aid}")
    return True

def load_cat(cat):
    path = os.path.join(ROOT, "scripts", "gen_data", f"{cat}.py")
    spec = importlib.util.spec_from_file_location(f"gen_data.{cat}", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.ALGS

if __name__ == "__main__":
    cats = sys.argv[1:] or ["parsing","network","scheduling","design","bitwise","geometry","list","ml","numerical","randomized","searching","sorting","tree"]
    total = 0
    for cat in cats:
        print(f"== {cat} ==")
        for algo in load_cat(cat):
            if emit(algo["cat"], algo):
                total += 1
    print(f"\nGenerated {total} algorithms")
