#!/usr/bin/env node
// 修复 trace.ts 中 ops 数组类型推断过窄的问题：
// 在 DEFAULT_INPUT = [...] 后插入类型断言 / 或将 buildTrace 入参类型放宽为 any。
// 策略：对每个有问题的 trace.ts，把 buildTrace 参数类型从具体 ops 类型改为 any。
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const targets = [
  'conc-bounded-buffer-sem', 'conc-collision-free-hash', 'conc-mpsc-queue',
  'conc-read-indicator', 'conc-readers-writer-pref', 'conc-spsc-ring',
  'conc-sx-lock', 'conc-vector-clock-full', 'conc-work-stealing-deque',
];
let n = 0;
for (const id of targets) {
  const p = join(ROOT, 'src', 'algorithms', 'concurrency', id, 'trace.ts');
  let src = readFileSync(p, 'utf8');
  // 将 DEFAULT_INPUT 标注为 any：DEFAULT_INPUT = {...} => DEFAULT_INPUT: any = {...}
  src = src.replace(/export const DEFAULT_INPUT =/, 'export const DEFAULT_INPUT: any =');
  // buildTrace(input = DEFAULT_INPUT) 已经从参数推断；保持参数无类型即可
  writeFileSync(p, src);
  n++;
}
console.log(`patched ${n} concurrency trace files`);
