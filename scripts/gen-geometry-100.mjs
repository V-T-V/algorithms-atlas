// Generator for 45 geometry algorithms, each with distinct real logic.
// Brings geometry from 55 to 100. Uses 'geo-' prefix ids (unique vs existing).
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'D:/M_X_M/algorithms-atlas';
const CAT = 'geometry';
const INDEX = `import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';
export { meta } from './meta.ts';
export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
`;

function writeAlg(id, meta, impl, trace, test) {
  const dir = join(ROOT, 'src/algorithms', CAT, id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'meta.ts'), meta);
  writeFileSync(join(dir, 'impl.ts'), impl);
  writeFileSync(join(dir, 'trace.ts'), trace);
  writeFileSync(join(dir, 'index.ts'), INDEX);
  mkdirSync(join(ROOT, 'test', CAT), { recursive: true });
  writeFileSync(join(ROOT, 'test', CAT, `${id}.test.ts`), test);
}

function meta(id, zh, en, sumZh, sumEn, descZh, descEn, time, space, tags) {
  return `// ${zh} · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: '${id}',
  categoryId: '${CAT}',
  title: { zh: '${zh}', en: '${en}' },
  summary: { zh: '${sumZh}', en: '${sumEn}' },
  description: { zh: ${JSON.stringify(descZh)}, en: ${JSON.stringify(descEn)} },
  tags: ${JSON.stringify(tags)},
  complexity: { time: '${time}', space: '${space}' },
};`;
}

// trace helper: two-frame trace with aux readout (note + final). Impl-driven hooks optional.
function twoFrameTrace(idCap, zhStart, enStart, zhDone, enDone, auxDoneExpr) {
  return `// ${idCap} · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '${zhStart}', en: '${enStart}' }).commit();
  rec.begin({ zh: '${zhDone}', en: '${enDone}' })
    .setAux(${auxDoneExpr}).commit();
  return rec.build();
}`;
}

const ALGS = [];

// 1. geo-vector-angle
ALGS.push({
  id: 'geo-vector-angle',
  m: ['向量夹角', 'Vector Angle', '用点积公式求两向量夹角（弧度）。', 'Angle between two vectors via the dot-product formula.',
    '两向量 a、b 的夹角 θ 满足 cos θ = (a·b)/(|a||b|)，θ ∈ [0, π]。', 'cos θ = (a·b)/(|a||b|), θ ∈ [0, π].', 'O(1)', 'O(1)', ['geometry', 'vector', 'angle']],
  impl: `// 向量夹角 · 实现
export interface Vec2 { x: number; y: number; }
export interface VectorAngleHooks { onDot?: (d: number) => void; onResult?: (t: number) => void; }
export function vectorAngle(a: Vec2, b: Vec2, hooks: VectorAngleHooks = {}): number {
  const dot = a.x * b.x + a.y * b.y;
  const na = Math.hypot(a.x, a.y);
  const nb = Math.hypot(b.x, b.y);
  hooks.onDot?.(dot);
  if (na === 0 || nb === 0) throw new RangeError('零向量无方向');
  const cos = Math.max(-1, Math.min(1, dot / (na * nb)));
  const theta = Math.acos(cos);
  hooks.onResult?.(theta);
  return theta;
}`,
  trace: `// 向量夹角 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { vectorAngle, type Vec2 } from './impl.ts';
export const DEFAULT_INPUT: { a: Vec2; b: Vec2 } = { a: { x: 3, y: 0 }, b: { x: 1, y: 1 } };
export function buildTrace(input: { a: Vec2; b: Vec2 } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = input.a, b = input.b;
  const deg = (r: number) => (r * 180 / Math.PI).toFixed(1) + '°';
  rec.begin({ zh: '向量 a 与 b', en: 'Vectors a and b' })
    .setAux([{ label: 'a', value: '(' + a.x + ',' + a.y + ')', role: 'pivot' as BarRole }, { label: 'b', value: '(' + b.x + ',' + b.y + ')', role: 'frontier' as BarRole }]).commit();
  const theta = vectorAngle(a, b, {
    onDot: (d) => rec.begin({ zh: '点积 a·b = ' + d, en: 'dot a·b = ' + d }).setAux([{ label: 'a·b', value: String(d), role: 'compare' as BarRole }]).commit(),
    onResult: (t) => rec.begin({ zh: '夹角 θ = ' + deg(t), en: 'angle θ = ' + deg(t) }).setAux([{ label: 'θ', value: deg(t), role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: '结果：θ ≈ ' + deg(theta), en: 'Result: θ ≈ ' + deg(theta) })
    .setAux([{ label: '弧度', value: theta.toFixed(4), role: 'final' as BarRole }, { label: '角度', value: deg(theta), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vectorAngle } from '../../src/algorithms/geometry/geo-vector-angle/impl.ts';
import { buildTrace } from '../../src/algorithms/geometry/geo-vector-angle/trace.ts';
test('向量夹角 垂直 = π/2', () => { assert.ok(Math.abs(vectorAngle({ x: 1, y: 0 }, { x: 0, y: 1 }) - Math.PI / 2) < 1e-9); });
test('向量夹角 平行 = 0', () => { assert.ok(Math.abs(vectorAngle({ x: 2, y: 0 }, { x: 5, y: 0 })) < 1e-9); });
test('向量夹角 零向量报错', () => { assert.throws(() => vectorAngle({ x: 0, y: 0 }, { x: 1, y: 1 }), RangeError); });
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 2. geo-vector-cross-2d
ALGS.push({
  id: 'geo-vector-cross-2d',
  m: ['二维叉积', '2D Cross Product', '二维叉积标量（带符号面积）。', 'Signed scalar cross product of two 2D vectors.',
    'a×b = a.x*b.y - a.y*b.x，等于两向量张成的平行四边形带符号面积，符号表示旋转方向。', 'a×b = a.x*b.y - a.y*b.x; equals signed area of the parallelogram, sign = orientation.', 'O(1)', 'O(1)', ['geometry', 'vector', 'cross-product']],
  impl: `// 二维叉积 · 实现
export interface Vec2 { x: number; y: number; }
export interface CrossHooks { onResult?: (c: number) => void; }
export function cross2D(a: Vec2, b: Vec2, hooks: CrossHooks = {}): number {
  const c = a.x * b.y - a.y * b.x;
  hooks.onResult?.(c);
  return c;
}
export function turn(a: Vec2, b: Vec2, c: Vec2): 'left' | 'right' | 'collinear' {
  const cr = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  if (cr > 0) return 'left';
  if (cr < 0) return 'right';
  return 'collinear';
}`,
  trace: twoFrameTrace('二维叉积', '向量 a 与 b', 'Vectors a and b', '叉积完成', 'cross product done',
    `[{ label: 'a×b', value: String(cross2D({ x: 3, y: 1 }, { x: 1, y: 2 })), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cross2D, turn } from '../../src/algorithms/geometry/geo-vector-cross-2d/impl.ts';
test('叉积 单位向量', () => { assert.equal(cross2D({ x: 1, y: 0 }, { x: 0, y: 1 }), 1); });
test('叉积 反向为负', () => { assert.equal(cross2D({ x: 0, y: 1 }, { x: 1, y: 0 }), -1); });
test('turn 左转', () => { assert.equal(turn({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }), 'left'); });
test('turn 共线', () => { assert.equal(turn({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }), 'collinear'); });`,
});

// 3. geo-vector-projection
ALGS.push({
  id: 'geo-vector-projection',
  m: ['向量投影', 'Vector Projection', '将向量 a 投影到向量 b 上。', 'Project vector a onto vector b.',
    '投影 proj_b(a) = (a·b / b·b) b。返回标量系数与投影向量。', 'proj_b(a) = (a·b / b·b) b. Returns scalar coefficient and projected vector.', 'O(1)', 'O(1)', ['geometry', 'vector', 'projection']],
  impl: `// 向量投影 · 实现
export interface Vec2 { x: number; y: number; }
export interface ProjectionHooks { onCoeff?: (k: number) => void; onResult?: (p: Vec2) => void; }
export interface ProjectionResult { coeff: number; vec: Vec2; }
export function project(a: Vec2, b: Vec2, hooks: ProjectionHooks = {}): ProjectionResult {
  const bb = b.x * b.x + b.y * b.y;
  if (bb === 0) throw new RangeError('目标向量为零');
  const coeff = (a.x * b.x + a.y * b.y) / bb;
  hooks.onCoeff?.(coeff);
  const vec = { x: coeff * b.x, y: coeff * b.y };
  hooks.onResult?.(vec);
  return { coeff, vec };
}`,
  trace: `// 向量投影 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { project } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '将 a 投影到 b', en: 'Project a onto b' }).commit();
  const r = project({ x: 3, y: 4 }, { x: 2, y: 0 });
  rec.begin({ zh: '投影系数 ' + r.coeff.toFixed(3), en: 'coefficient ' + r.coeff.toFixed(3) })
    .setAux([{ label: '投影向量', value: '(' + r.vec.x.toFixed(2) + ',' + r.vec.y.toFixed(2) + ')', role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { project } from '../../src/algorithms/geometry/geo-vector-projection/impl.ts';
test('投影 到 x 轴', () => {
  const r = project({ x: 3, y: 4 }, { x: 1, y: 0 });
  assert.equal(r.coeff, 3);
  assert.deepEqual(r.vec, { x: 3, y: 0 });
});
test('投影 零向量报错', () => { assert.throws(() => project({ x: 1, y: 1 }, { x: 0, y: 0 }), RangeError); });
test('投影 自投影系数1', () => {
  const r = project({ x: 2, y: 0 }, { x: 2, y: 0 });
  assert.equal(r.coeff, 1);
});`,
});

// 4. geo-vector-rotate
ALGS.push({
  id: 'geo-vector-rotate',
  m: ['向量旋转', 'Vector Rotation', '将向量绕原点逆时针旋转角度 θ。', 'Rotate a vector about the origin counter-clockwise by θ.',
    '旋转矩阵：x′=x cosθ - y sinθ, y′=x sinθ + y cosθ。', 'Rotation: x′=x cosθ - y sinθ, y′=x sinθ + y cosθ.', 'O(1)', 'O(1)', ['geometry', 'vector', 'rotation']],
  impl: `// 向量旋转 · 实现
export interface Vec2 { x: number; y: number; }
export interface RotateHooks { onResult?: (v: Vec2) => void; }
export function rotate(v: Vec2, theta: number, hooks: RotateHooks = {}): Vec2 {
  const c = Math.cos(theta), s = Math.sin(theta);
  const out = { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
  hooks.onResult?.(out);
  return out;
}`,
  trace: `// 向量旋转 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rotate } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '原始向量 (1,0)', en: 'original (1,0)' }).commit();
  const r = rotate({ x: 1, y: 0 }, Math.PI / 2);
  rec.begin({ zh: '逆时针旋转 90° 后', en: 'after +90° rotation' })
    .setAux([{ label: '结果', value: '(' + r.x.toFixed(3) + ',' + r.y.toFixed(3) + ')', role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rotate } from '../../src/algorithms/geometry/geo-vector-rotate/impl.ts';
test('旋转 90°', () => {
  const r = rotate({ x: 1, y: 0 }, Math.PI / 2);
  assert.ok(Math.abs(r.x) < 1e-9);
  assert.ok(Math.abs(r.y - 1) < 1e-9);
});
test('旋转 0° 不变', () => {
  const r = rotate({ x: 3, y: 4 }, 0);
  assert.deepEqual(r, { x: 3, y: 4 });
});`,
});

// 5. geo-triangle-circumcenter
ALGS.push({
  id: 'geo-triangle-circumcenter',
  m: ['三角形外心', 'Triangle Circumcenter', '求三角形外接圆圆心。', 'Compute the circumcenter of a triangle.',
    '外心是三边中垂线交点，到三顶点等距。用垂直平分线线性方程联立求解。', 'Circumcenter is the intersection of perpendicular bisectors; equidistant from all three vertices.', 'O(1)', 'O(1)', ['geometry', 'triangle', 'circle']],
  impl: `// 三角形外心 · 实现
export interface Pt { x: number; y: number; }
export interface CircleResult { center: Pt; radius: number; }
export interface CircumHooks { onCenter?: (c: Pt) => void; }
export function circumcenter(a: Pt, b: Pt, c: Pt, hooks: CircumHooks = {}): CircleResult {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 1e-12) throw new RangeError('三点共线');
  const ux = ((a.x * a.x + a.y * a.y) * (b.y - c.y) + (b.x * b.x + b.y * b.y) * (c.y - a.y) + (c.x * c.x + c.y * c.y) * (a.y - b.y)) / d;
  const uy = ((a.x * a.x + a.y * a.y) * (c.x - b.x) + (b.x * b.x + b.y * b.y) * (a.x - c.x) + (c.x * c.x + c.y * c.y) * (b.x - a.x)) / d;
  const center = { x: ux, y: uy };
  hooks.onCenter?.(center);
  const radius = Math.hypot(a.x - ux, a.y - uy);
  return { center, radius };
}`,
  trace: `// 三角形外心 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { circumcenter } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '给定三角形三点', en: 'three triangle vertices' }).commit();
  const r = circumcenter({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 });
  rec.begin({ zh: '外心 (' + r.center.x.toFixed(2) + ',' + r.center.y.toFixed(2) + ')', en: 'circumcenter computed' })
    .setAux([{ label: '圆心', value: '(' + r.center.x.toFixed(2) + ',' + r.center.y.toFixed(2) + ')', role: 'final' as BarRole }, { label: '半径', value: r.radius.toFixed(3), role: 'frontier' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { circumcenter } from '../../src/algorithms/geometry/geo-triangle-circumcenter/impl.ts';
test('外心 直角三角形', () => {
  const r = circumcenter({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 });
  assert.ok(Math.abs(r.center.x - 2) < 1e-9);
  assert.ok(Math.abs(r.center.y - 1.5) < 1e-9);
  assert.ok(Math.abs(r.radius - 2.5) < 1e-9);
});
test('外心 共线报错', () => {
  assert.throws(() => circumcenter({ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }), RangeError);
});`,
});

// 6. geo-triangle-incenter
ALGS.push({
  id: 'geo-triangle-incenter',
  m: ['三角形内心', 'Triangle Incenter', '求三角形内切圆圆心。', 'Compute the incenter of a triangle.',
    '内心是三条角平分线交点，到三边等距。坐标按边长加权平均：I = (aA+bB+cC)/(a+b+c)。', 'Incenter is intersection of angle bisectors; weighted by side lengths I=(aA+bB+cC)/(a+b+c).', 'O(1)', 'O(1)', ['geometry', 'triangle', 'circle']],
  impl: `// 三角形内心 · 实现
export interface Pt { x: number; y: number; }
export interface CircleResult { center: Pt; radius: number; }
export function incenter(a: Pt, b: Pt, c: Pt): CircleResult {
  const la = Math.hypot(b.x - c.x, b.y - c.y);
  const lb = Math.hypot(a.x - c.x, a.y - c.y);
  const lc = Math.hypot(a.x - b.x, a.y - b.y);
  const s = la + lb + lc;
  if (s === 0) throw new RangeError('退化三角形');
  const center = { x: (la * a.x + lb * b.x + lc * c.x) / s, y: (la * a.y + lb * b.y + lc * c.y) / s };
  const semi = s / 2;
  const area = Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2;
  const radius = area / semi;
  return { center, radius };
}`,
  trace: `// 三角形内心 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { incenter } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '给定三角形', en: 'given triangle' }).commit();
  const r = incenter({ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 0, y: 8 });
  rec.begin({ zh: '内心计算完成', en: 'incenter done' })
    .setAux([{ label: '圆心', value: '(' + r.center.x.toFixed(2) + ',' + r.center.y.toFixed(2) + ')', role: 'final' as BarRole }, { label: '内切圆半径', value: r.radius.toFixed(3), role: 'frontier' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { incenter } from '../../src/algorithms/geometry/geo-triangle-incenter/impl.ts';
test('内心 3-4-5 三角形', () => {
  const r = incenter({ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 0, y: 8 });
  assert.ok(Math.abs(r.radius - 2) < 1e-9);
});`,
});

// 7. geo-triangle-orthocenter
ALGS.push({
  id: 'geo-triangle-orthocenter',
  m: ['三角形垂心', 'Triangle Orthocenter', '求三角形垂心（三高线交点）。', 'Compute the orthocenter of a triangle.',
    '垂心是三条高线的交点。利用关系：H = A+B+C - 2*O（O 为外心），或直接解高线方程。', 'Orthocenter is the intersection of altitudes.', 'O(1)', 'O(1)', ['geometry', 'triangle']],
  impl: `// 三角形垂心 · 实现
export interface Pt { x: number; y: number; }
export function orthocenter(a: Pt, b: Pt, c: Pt): Pt {
  // H = A + B + C - 2*O where O is circumcenter
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 1e-12) throw new RangeError('三点共线');
  const ux = ((a.x * a.x + a.y * a.y) * (b.y - c.y) + (b.x * b.x + b.y * b.y) * (c.y - a.y) + (c.x * c.x + c.y * c.y) * (a.y - b.y)) / d;
  const uy = ((a.x * a.x + a.y * a.y) * (c.x - b.x) + (b.x * b.x + b.y * b.y) * (a.x - c.x) + (c.x * c.x + c.y * c.y) * (b.x - a.x)) / d;
  return { x: a.x + b.x + c.x - 2 * ux, y: a.y + b.y + c.y - 2 * uy };
}`,
  trace: twoFrameTrace('三角形垂心', '给定三角形', 'given triangle', '垂心计算完成', 'orthocenter done',
    `[{ label: 'H', value: '(' + orthocenter({x:0,y:0},{x:4,y:0},{x:0,y:3}).x.toFixed(2) + ',' + orthocenter({x:0,y:0},{x:4,y:0},{x:0,y:3}).y.toFixed(2) + ')', role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { orthocenter } from '../../src/algorithms/geometry/geo-triangle-orthocenter/impl.ts';
test('垂心 直角三角形=直角顶点', () => {
  const h = orthocenter({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 });
  assert.ok(Math.abs(h.x) < 1e-9 && Math.abs(h.y) < 1e-9);
});`,
});

// 8. geo-triangle-centroid
ALGS.push({
  id: 'geo-triangle-centroid',
  m: ['三角形重心', 'Triangle Centroid', '求三角形重心（三中线交点）。', 'Compute the centroid of a triangle.',
    '重心 = (A+B+C)/3，是三条中线的交点，把每条中线分为 2:1。', 'Centroid = (A+B+C)/3, intersection of medians, divides each in 2:1.', 'O(1)', 'O(1)', ['geometry', 'triangle']],
  impl: `// 三角形重心 · 实现
export interface Pt { x: number; y: number; }
export function centroid(a: Pt, b: Pt, c: Pt): Pt {
  return { x: (a.x + b.x + c.x) / 3, y: (a.y + b.y + c.y) / 3 };
}`,
  trace: twoFrameTrace('三角形重心', '给定三角形', 'given triangle', '重心 = 三顶点平均', 'centroid = average of vertices',
    `[{ label: 'G', value: '(' + centroid({x:0,y:0},{x:3,y:0},{x:0,y:3}).x.toFixed(2) + ',' + centroid({x:0,y:0},{x:3,y:0},{x:0,y:3}).y.toFixed(2) + ')', role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { centroid } from '../../src/algorithms/geometry/geo-triangle-centroid/impl.ts';
test('重心', () => {
  const g = centroid({ x: 0, y: 0 }, { x: 3, y: 0 }, { x: 0, y: 3 });
  assert.ok(Math.abs(g.x - 1) < 1e-9 && Math.abs(g.y - 1) < 1e-9);
});`,
});

// 9. geo-triangle-area-signed
ALGS.push({
  id: 'geo-triangle-area-signed',
  m: ['三角形带符号面积', 'Signed Triangle Area', '用叉积求三角形带符号面积。', 'Signed area of a triangle via cross product.',
    '面积 = ((b-a)×(c-a))/2，符号表示顶点方向（逆时针为正）。', 'Area = ((b-a)×(c-a))/2; sign = vertex orientation (CCW positive).', 'O(1)', 'O(1)', ['geometry', 'triangle', 'area']],
  impl: `// 三角形带符号面积 · 实现
export interface Pt { x: number; y: number; }
export interface AreaHooks { onResult?: (s: number) => void; }
export function signedArea(a: Pt, b: Pt, c: Pt, hooks: AreaHooks = {}): number {
  const s = ((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2;
  hooks.onResult?.(s);
  return s;
}`,
  trace: twoFrameTrace('三角形带符号面积', '给定三点', 'three points', '带符号面积 = 叉积/2', 'signed area = cross/2',
    `[{ label: '面积', value: String(signedArea({x:0,y:0},{x:4,y:0},{x:0,y:3})), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { signedArea } from '../../src/algorithms/geometry/geo-triangle-area-signed/impl.ts';
test('正面积 逆时针', () => { assert.equal(signedArea({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 }), 6); });
test('负面积 顺时针', () => { assert.equal(signedArea({ x: 0, y: 0 }, { x: 0, y: 3 }, { x: 4, y: 0 }), -6); });`,
});

// 10. geo-circle-through-3pts
ALGS.push({
  id: 'geo-circle-through-3pts',
  m: ['三点定圆', 'Circle Through Three Points', '过三点求唯一圆（同外心）。', 'Find the unique circle passing through three points.',
    '三点不共线时存在唯一外接圆；圆心即外心，半径=圆心到任一顶点距离。', 'For three non-collinear points, the unique circumcircle has center = circumcenter.', 'O(1)', 'O(1)', ['geometry', 'circle', 'triangle']],
  impl: `// 三点定圆 · 实现
export interface Pt { x: number; y: number; }
export interface Circle { center: Pt; radius: number; }
export function circleThrough3(a: Pt, b: Pt, c: Pt): Circle {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 1e-12) throw new RangeError('三点共线，无外接圆');
  const ux = ((a.x * a.x + a.y * a.y) * (b.y - c.y) + (b.x * b.x + b.y * b.y) * (c.y - a.y) + (c.x * c.x + c.y * c.y) * (a.y - b.y)) / d;
  const uy = ((a.x * a.x + a.y * a.y) * (c.x - b.x) + (b.x * b.x + b.y * b.y) * (a.x - c.x) + (c.x * c.x + c.y * c.y) * (b.x - a.x)) / d;
  const center = { x: ux, y: uy };
  return { center, radius: Math.hypot(a.x - ux, a.y - uy) };
}`,
  trace: twoFrameTrace('三点定圆', '三点输入', 'three points in', '外接圆确定', 'circumcircle found',
    `[{ label: '半径', value: circleThrough3({x:0,y:0},{x:4,y:0},{x:0,y:3}).radius.toFixed(3), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { circleThrough3 } from '../../src/algorithms/geometry/geo-circle-through-3pts/impl.ts';
test('三点定圆 半径', () => {
  const c = circleThrough3({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 });
  assert.ok(Math.abs(c.radius - 2.5) < 1e-9);
});
test('共线报错', () => { assert.throws(() => circleThrough3({ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }), RangeError); });`,
});

// 11. geo-ellipse-perimeter
ALGS.push({
  id: 'geo-ellipse-perimeter',
  m: ['椭圆周长', 'Ellipse Perimeter', '拉马努金近似求椭圆周长。', 'Ramanujan approximation of ellipse perimeter.',
    '周长 ≈ π[3(a+b) - √((3a+b)(a+3b))]，拉马努金一阶近似精度极高。', 'Perimeter ≈ π[3(a+b) - √((3a+b)(a+3b))] (Ramanujan first approximation).', 'O(1)', 'O(1)', ['geometry', 'ellipse', 'approximation']],
  impl: `// 椭圆周长 · 实现
export function ellipsePerimeter(a: number, b: number): number {
  if (a < 0 || b < 0) throw new RangeError('半轴必须非负');
  return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
}`,
  trace: twoFrameTrace('椭圆周长', '输入半长轴 a 与半短轴 b', 'semi-axes a, b', '拉马努金近似周长', 'Ramanujan perimeter',
    `[{ label: '周长', value: ellipsePerimeter(5, 3).toFixed(3), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ellipsePerimeter } from '../../src/algorithms/geometry/geo-ellipse-perimeter/impl.ts';
test('椭圆 a=b 为圆', () => {
  const p = ellipsePerimeter(3, 3);
  assert.ok(Math.abs(p - 2 * Math.PI * 3) < 1e-9);
});
test('负半轴报错', () => { assert.throws(() => ellipsePerimeter(-1, 2), RangeError); });`,
});

// 12. geo-polygon-perimeter
ALGS.push({
  id: 'geo-polygon-perimeter',
  m: ['多边形周长', 'Polygon Perimeter', '求简单多边形周长。', 'Perimeter of a simple polygon.',
    '依次累加相邻顶点间欧氏距离，闭合（首尾相连）。', 'Sum of consecutive vertex distances, closing the loop.', 'O(n)', 'O(1)', ['geometry', 'polygon']],
  impl: `// 多边形周长 · 实现
export interface Pt { x: number; y: number; }
export interface PerimeterHooks { onEdge?: (i: number, len: number) => void; }
export function polygonPerimeter(pts: Pt[], hooks: PerimeterHooks = {}): number {
  const n = pts.length;
  if (n < 2) return 0;
  let p = 0;
  for (let i = 0; i < n; i++) {
    const a = pts[i]!, b = pts[(i + 1) % n]!;
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    p += len;
    hooks.onEdge?.(i, len);
  }
  return p;
}`,
  trace: `// 多边形周长 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { polygonPerimeter, type Pt } from './impl.ts';
export const DEFAULT_INPUT: Pt[] = [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 3 }, { x: 0, y: 3 }];
export function buildTrace(input: Pt[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '多边形顶点', en: 'polygon vertices' }).commit();
  let acc = 0;
  const p = polygonPerimeter(input, {
    onEdge: (i, len) => { acc += len; rec.begin({ zh: '边 ' + i + ' 长 ' + len.toFixed(2), en: 'edge ' + i + ' len ' + len.toFixed(2) }).setAux([{ label: '累计', value: acc.toFixed(2), role: 'compare' as BarRole }]).commit(); },
  });
  rec.begin({ zh: '周长 = ' + p.toFixed(3), en: 'perimeter = ' + p.toFixed(3) }).setAux([{ label: '周长', value: p.toFixed(3), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { polygonPerimeter } from '../../src/algorithms/geometry/geo-polygon-perimeter/impl.ts';
test('矩形周长', () => {
  const p = polygonPerimeter([{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 3 }, { x: 0, y: 3 }]);
  assert.equal(p, 14);
});
test('少于2点 周长0', () => { assert.equal(polygonPerimeter([{ x: 0, y: 0 }]), 0); });`,
});

// 13. geo-polygon-bounds
ALGS.push({
  id: 'geo-polygon-bounds',
  m: ['多边形包围盒', 'Polygon Bounding Box', '求多边形轴对齐包围盒（AABB）。', 'Axis-aligned bounding box (AABB) of a polygon.',
    '遍历顶点取 min/max 得到 [minX,minY,maxX,maxY] 与宽高。', 'Scan vertices for min/max to get AABB and dimensions.', 'O(n)', 'O(1)', ['geometry', 'polygon', 'bounding-box']],
  impl: `// 多边形包围盒 · 实现
export interface Pt { x: number; y: number; }
export interface Bounds { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number; }
export function polygonBounds(pts: Pt[]): Bounds | null {
  if (pts.length === 0) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}`,
  trace: twoFrameTrace('多边形包围盒', '输入顶点', 'input vertices', 'AABB 计算', 'AABB computed',
    `[{ label: '宽×高', value: (polygonBounds([{x:0,y:0},{x:4,y:0},{x:4,y:3},{x:0,y:3}])!).width + 'x' + (polygonBounds([{x:0,y:0},{x:4,y:0},{x:4,y:3},{x:0,y:3}])!).height, role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { polygonBounds } from '../../src/algorithms/geometry/geo-polygon-bounds/impl.ts';
test('包围盒', () => {
  const b = polygonBounds([{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 3 }, { x: 0, y: 3 }]);
  assert.equal(b!.width, 4);
  assert.equal(b!.height, 3);
});
test('空集返回null', () => { assert.equal(polygonBounds([]), null); });`,
});

// 14. geo-polygon-orientation
ALGS.push({
  id: 'geo-polygon-orientation',
  m: ['多边形方向', 'Polygon Orientation', '判断多边形顶点顺序为顺时针或逆时针。', 'Determine polygon vertex order (CW or CCW).',
    '用鞋带公式得带符号面积：>0 为逆时针，<0 为顺时针，0 共线。', 'Shoelace signed area: positive = CCW, negative = CW, zero = degenerate.', 'O(n)', 'O(1)', ['geometry', 'polygon']],
  impl: `// 多边形方向 · 实现
export interface Pt { x: number; y: number; }
export type Orientation = 'cw' | 'ccw' | 'degenerate';
export function polygonOrientation(pts: Pt[]): Orientation {
  const n = pts.length;
  if (n < 3) return 'degenerate';
  let s = 0;
  for (let i = 0; i < n; i++) {
    const a = pts[i]!, b = pts[(i + 1) % n]!;
    s += (b.x - a.x) * (b.y + a.y);
  }
  if (s > 0) return 'cw';
  if (s < 0) return 'ccw';
  return 'degenerate';
}`,
  trace: twoFrameTrace('多边形方向', '多边形输入', 'polygon input', '方向判定', 'orientation decided',
    `[{ label: '方向', value: polygonOrientation([{x:0,y:0},{x:1,y:0},{x:1,y:1}]), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { polygonOrientation } from '../../src/algorithms/geometry/geo-polygon-orientation/impl.ts';
test('逆时针', () => { assert.equal(polygonOrientation([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }]), 'ccw'); });
test('顺时针', () => { assert.equal(polygonOrientation([{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }]), 'cw'); });`,
});

// 15. geo-polygon-convex-check
ALGS.push({
  id: 'geo-polygon-convex-check',
  m: ['多边形凸性判定', 'Polygon Convexity Check', '判断多边形是否为凸多边形。', 'Check whether a polygon is convex.',
    '依次计算相邻三点的叉积符号，若全部同号（或零）则为凸，否则为凹。', 'Cross products of consecutive triples must all share the same sign for convexity.', 'O(n)', 'O(1)', ['geometry', 'polygon', 'convexity']],
  impl: `// 多边形凸性判定 · 实现
export interface Pt { x: number; y: number; }
export function isConvex(pts: Pt[]): boolean {
  const n = pts.length;
  if (n < 3) return false;
  let sign = 0;
  for (let i = 0; i < n; i++) {
    const a = pts[i]!, b = pts[(i + 1) % n]!, c = pts[(i + 2) % n]!;
    const cr = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
    if (cr !== 0) {
      const s = cr > 0 ? 1 : -1;
      if (sign === 0) sign = s;
      else if (s !== sign) return false;
    }
  }
  return true;
}`,
  trace: twoFrameTrace('多边形凸性判定', '输入多边形', 'input polygon', '凸性判定完成', 'convexity checked',
    `[{ label: '凸?', value: String(isConvex([{x:0,y:0},{x:4,y:0},{x:4,y:3},{x:0,y:3}])), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isConvex } from '../../src/algorithms/geometry/geo-polygon-convex-check/impl.ts';
test('矩形凸', () => { assert.equal(isConvex([{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 3 }, { x: 0, y: 3 }]), true); });
test('凹多边形', () => { assert.equal(isConvex([{ x: 0, y: 0 }, { x: 2, y: 1 }, { x: 4, y: 0 }, { x: 4, y: 4 }, { x: 0, y: 4 }]), false); });`,
});

// 16. geo-regular-polygon
ALGS.push({
  id: 'geo-regular-polygon',
  m: ['正多边形顶点', 'Regular Polygon Vertices', '生成正 n 边形顶点坐标。', 'Generate vertices of a regular n-gon.',
    '以圆心 (cx,cy)、半径 r，第 k 个顶点角度 = 2πk/n + startAngle。', 'Vertex k at angle 2πk/n + startAngle around center with radius r.', 'O(n)', 'O(n)', ['geometry', 'polygon']],
  impl: `// 正多边形顶点 · 实现
export interface Pt { x: number; y: number; }
export function regularPolygon(n: number, cx: number, cy: number, r: number, startAngle = 0): Pt[] {
  if (n < 3) throw new RangeError('边数 n 必须 ≥ 3');
  if (r < 0) throw new RangeError('半径必须非负');
  const pts: Pt[] = [];
  for (let k = 0; k < n; k++) {
    const a = (2 * Math.PI * k) / n + startAngle;
    pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  }
  return pts;
}`,
  trace: twoFrameTrace('正多边形顶点', '输入 n 与半径', 'n and radius', '生成顶点', 'vertices generated',
    `[{ label: '顶点数', value: String(regularPolygon(6,0,0,1).length), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { regularPolygon } from '../../src/algorithms/geometry/geo-regular-polygon/impl.ts';
test('正六边形 6 顶点', () => { assert.equal(regularPolygon(6, 0, 0, 1).length, 6); });
test('首顶点在 startAngle', () => {
  const p = regularPolygon(4, 0, 0, 1, Math.PI / 4);
  assert.ok(Math.abs(p[0]!.x - Math.cos(Math.PI / 4)) < 1e-9);
});
test('n<3 报错', () => { assert.throws(() => regularPolygon(2, 0, 0, 1), RangeError); });`,
});

// 17. geo-point-segment-dist
ALGS.push({
  id: 'geo-point-segment-dist',
  m: ['点到线段距离', 'Point to Segment Distance', '求点到线段最短距离。', 'Shortest distance from a point to a segment.',
    '将点投影到线段所在直线，参数 t 限制在 [0,1] 内取最近点距离。', 'Project onto the line, clamp parameter t to [0,1], then distance.', 'O(1)', 'O(1)', ['geometry', 'distance']],
  impl: `// 点到线段距离 · 实现
export interface Pt { x: number; y: number; }
export function pointSegmentDistance(p: Pt, a: Pt, b: Pt): number {
  const dx = b.x - a.x, dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const cx = a.x + t * dx, cy = a.y + t * dy;
  return Math.hypot(p.x - cx, p.y - cy);
}`,
  trace: twoFrameTrace('点到线段距离', '输入点与线段', 'point and segment', '最短距离', 'shortest distance',
    `[{ label: '距离', value: pointSegmentDistance({x:1,y:2},{x:0,y:0},{x:4,y:0}).toFixed(3), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pointSegmentDistance } from '../../src/algorithms/geometry/geo-point-segment-dist/impl.ts';
test('投影在线段内', () => {
  assert.ok(Math.abs(pointSegmentDistance({ x: 2, y: 3 }, { x: 0, y: 0 }, { x: 4, y: 0 }) - 3) < 1e-9);
});
test('投影在线段外', () => {
  assert.ok(Math.abs(pointSegmentDistance({ x: 6, y: 0 }, { x: 0, y: 0 }, { x: 4, y: 0 }) - 2) < 1e-9);
});`,
});

// 18. geo-foot-perpendicular
ALGS.push({
  id: 'geo-foot-perpendicular',
  m: ['垂足', 'Foot of Perpendicular', '求点到直线的垂足。', 'Foot of perpendicular from a point to a line.',
    '将点投影到直线 ax+by+c=0：垂足 = P - (aP.x+bP.y+c)/(a²+b²) · (a,b)。', 'Project point onto line ax+by+c=0; foot = P - (aP.x+bP.y+c)/(a²+b²)·(a,b).', 'O(1)', 'O(1)', ['geometry', 'line', 'projection']],
  impl: `// 垂足 · 实现
export interface Pt { x: number; y: number; }
export interface Line { a: number; b: number; c: number; }
export function footOfPerpendicular(p: Pt, line: Line): Pt {
  const d = line.a * line.a + line.b * line.b;
  if (d === 0) throw new RangeError('退化直线');
  const t = (line.a * p.x + line.b * p.y + line.c) / d;
  return { x: p.x - line.a * t, y: p.y - line.b * t };
}`,
  trace: twoFrameTrace('垂足', '输入点与直线', 'point and line', '垂足计算', 'foot computed',
    `[{ label: '垂足', value: '(' + footOfPerpendicular({x:1,y:5},{a:0,b:1,c:0}).x + ',' + footOfPerpendicular({x:1,y:5},{a:0,b:1,c:0}).y + ')', role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { footOfPerpendicular } from '../../src/algorithms/geometry/geo-foot-perpendicular/impl.ts';
test('垂足 y=0', () => {
  const f = footOfPerpendicular({ x: 1, y: 5 }, { a: 0, b: 1, c: 0 });
  assert.deepEqual(f, { x: 1, y: 0 });
});
test('退化直线报错', () => { assert.throws(() => footOfPerpendicular({ x: 0, y: 0 }, { a: 0, b: 0, c: 1 }), RangeError); });`,
});

// 19. geo-reflection-point
ALGS.push({
  id: 'geo-reflection-point',
  m: ['点关于点反射', 'Point Reflection About Point', '求点 P 关于中心 C 的反射点。', 'Reflect point P about center C.',
    '反射点 P′ = 2C - P（中心对称）。', 'Reflected point P′ = 2C - P (central symmetry).', 'O(1)', 'O(1)', ['geometry', 'transformation', 'reflection']],
  impl: `// 点关于点反射 · 实现
export interface Pt { x: number; y: number; }
export function reflectAboutPoint(p: Pt, c: Pt): Pt {
  return { x: 2 * c.x - p.x, y: 2 * c.y - p.y };
}`,
  trace: twoFrameTrace('点关于点反射', '输入 P 与中心 C', 'P and center C', '中心对称点', 'centrally symmetric point',
    `[{ label: "P'", value: '(' + reflectAboutPoint({x:1,y:2},{x:0,y:0}).x + ',' + reflectAboutPoint({x:1,y:2},{x:0,y:0}).y + ')', role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reflectAboutPoint } from '../../src/algorithms/geometry/geo-reflection-point/impl.ts';
test('关于原点反射', () => { assert.deepEqual(reflectAboutPoint({ x: 1, y: 2 }, { x: 0, y: 0 }), { x: -1, y: -2 }); });`,
});

// 20. geo-homothety
ALGS.push({
  id: 'geo-homothety',
  m: ['位似变换', 'Homothety', '以中心 C、比例 k 对点做位似变换。', 'Homothety of a point about center C with ratio k.',
    'P′ = C + k(P - C)，k>1 放大，0<k<1 缩小，k<0 反向。', 'P′ = C + k(P - C); k>1 enlarges, 0<k<1 shrinks, k<0 inverts.', 'O(1)', 'O(1)', ['geometry', 'transformation']],
  impl: `// 位似变换 · 实现
export interface Pt { x: number; y: number; }
export function homothety(p: Pt, c: Pt, k: number): Pt {
  return { x: c.x + k * (p.x - c.x), y: c.y + k * (p.y - c.y) };
}`,
  trace: twoFrameTrace('位似变换', '输入点与比例', 'point and ratio', '位似结果', 'homothety result',
    `[{ label: "P'", value: '(' + homothety({x:2,y:0},{x:0,y:0},2).x + ',' + homothety({x:2,y:0},{x:0,y:0},2).y + ')', role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { homothety } from '../../src/algorithms/geometry/geo-homothety/impl.ts';
test('放大2倍', () => { assert.deepEqual(homothety({ x: 2, y: 0 }, { x: 0, y: 0 }, 2), { x: 4, y: 0 }); });`,
});

// 21. geo-affine-2d
ALGS.push({
  id: 'geo-affine-2d',
  m: ['二维仿射变换', '2D Affine Transform', '用 2×3 仿射矩阵变换点。', 'Transform a point by a 2x3 affine matrix.',
    '变换：[x′ y′] = [[a,b],[c,d]]·[x,y] + [e,f]。', 'Transform: [x′ y′] = [[a,b],[c,d]]·[x,y] + [e,f].', 'O(1)', 'O(1)', ['geometry', 'transformation', 'matrix']],
  impl: `// 二维仿射变换 · 实现
export interface Pt { x: number; y: number; }
export interface Affine { a: number; b: number; c: number; d: number; e: number; f: number; }
export function affine(p: Pt, m: Affine): Pt {
  return { x: m.a * p.x + m.b * p.y + m.e, y: m.c * p.x + m.d * p.y + m.f };
}`,
  trace: twoFrameTrace('二维仿射变换', '输入点与矩阵', 'point and matrix', '变换完成', 'transform done',
    `[{ label: "P'", value: '(' + affine({x:1,y:1},{a:2,b:0,c:0,d:2,e:0,f:0}).x + ',' + affine({x:1,y:1},{a:2,b:0,c:0,d:2,e:0,f:0}).y + ')', role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { affine } from '../../src/algorithms/geometry/geo-affine-2d/impl.ts';
test('缩放2倍', () => { assert.deepEqual(affine({ x: 1, y: 1 }, { a: 2, b: 0, c: 0, d: 2, e: 0, f: 0 }), { x: 2, y: 2 }); });
test('平移', () => { assert.deepEqual(affine({ x: 1, y: 1 }, { a: 1, b: 0, c: 0, d: 1, e: 3, f: 4 }), { x: 4, y: 5 }); });`,
});

// 22. geo-polygon-translate
ALGS.push({
  id: 'geo-polygon-translate',
  m: ['多边形平移', 'Polygon Translation', '把多边形整体平移 (dx,dy)。', 'Translate a polygon by (dx, dy).',
    '每个顶点 P_i ← P_i + (dx, dy)。', 'Each vertex P_i ← P_i + (dx, dy).', 'O(n)', 'O(n)', ['geometry', 'polygon', 'transformation']],
  impl: `// 多边形平移 · 实现
export interface Pt { x: number; y: number; }
export function translatePolygon(pts: Pt[], dx: number, dy: number): Pt[] {
  return pts.map((p) => ({ x: p.x + dx, y: p.y + dy }));
}`,
  trace: twoFrameTrace('多边形平移', '输入多边形与偏移', 'polygon and offset', '平移完成', 'translated',
    `[{ label: '首点', value: '(' + translatePolygon([{x:0,y:0}],3,4)[0]!.x + ',' + translatePolygon([{x:0,y:0}],3,4)[0]!.y + ')', role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { translatePolygon } from '../../src/algorithms/geometry/geo-polygon-translate/impl.ts';
test('平移', () => {
  assert.deepEqual(translatePolygon([{ x: 0, y: 0 }, { x: 1, y: 1 }], 3, 4), [{ x: 3, y: 4 }, { x: 4, y: 5 }]);
});`,
});

// 23. geo-polygon-scale
ALGS.push({
  id: 'geo-polygon-scale',
  m: ['多边形缩放', 'Polygon Scaling', '以中心 C 对多边形按比例 k 缩放。', 'Scale a polygon about center C by ratio k.',
    '每个顶点 P_i ← C + k(P_i - C)。', 'Each vertex P_i ← C + k(P_i - C).', 'O(n)', 'O(n)', ['geometry', 'polygon', 'transformation']],
  impl: `// 多边形缩放 · 实现
export interface Pt { x: number; y: number; }
export function scalePolygon(pts: Pt[], c: Pt, k: number): Pt[] {
  return pts.map((p) => ({ x: c.x + k * (p.x - c.x), y: c.y + k * (p.y - c.y) }));
}`,
  trace: twoFrameTrace('多边形缩放', '输入多边形与比例', 'polygon and ratio', '缩放完成', 'scaled',
    `[{ label: '首点', value: '(' + scalePolygon([{x:2,y:0}],{x:0,y:0},2)[0]!.x + ',' + scalePolygon([{x:2,y:0}],{x:0,y:0},2)[0]!.y + ')', role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scalePolygon } from '../../src/algorithms/geometry/geo-polygon-scale/impl.ts';
test('缩放2倍', () => {
  assert.deepEqual(scalePolygon([{ x: 2, y: 0 }], { x: 0, y: 0 }, 2), [{ x: 4, y: 0 }]);
});`,
});

// 24. geo-polygon-rotate
ALGS.push({
  id: 'geo-polygon-rotate',
  m: ['多边形旋转', 'Polygon Rotation', '以中心 C 把多边形整体旋转 θ。', 'Rotate a polygon about center C by angle θ.',
    '每个顶点绕 C 旋转 θ：x′ = C.x + (P.x-C.x)cosθ - (P.y-C.y)sinθ。', 'Each vertex rotates about C by θ.', 'O(n)', 'O(n)', ['geometry', 'polygon', 'rotation']],
  impl: `// 多边形旋转 · 实现
export interface Pt { x: number; y: number; }
export function rotatePolygon(pts: Pt[], c: Pt, theta: number): Pt[] {
  const cs = Math.cos(theta), sn = Math.sin(theta);
  return pts.map((p) => {
    const dx = p.x - c.x, dy = p.y - c.y;
    return { x: c.x + dx * cs - dy * sn, y: c.y + dx * sn + dy * cs };
  });
}`,
  trace: twoFrameTrace('多边形旋转', '输入多边形与角度', 'polygon and angle', '旋转完成', 'rotated',
    `[{ label: '首点x', value: rotatePolygon([{x:1,y:0}],{x:0,y:0},Math.PI/2)[0]!.x.toFixed(3), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rotatePolygon } from '../../src/algorithms/geometry/geo-polygon-rotate/impl.ts';
test('旋转90°', () => {
  const r = rotatePolygon([{ x: 1, y: 0 }], { x: 0, y: 0 }, Math.PI / 2);
  assert.ok(Math.abs(r[0]!.y - 1) < 1e-9);
});`,
});

// 25. geo-minkowski-sum
ALGS.push({
  id: 'geo-minkowski-sum',
  m: ['闵可夫斯基和', 'Minkowski Sum', '求两个凸多边形的闵可夫斯基和。', 'Minkowski sum of two convex polygons.',
    '把两个凸多边形按极角合并所有边向量，得到和的凸多边形。', 'Merge edge vectors of two convex polygons by polar angle to get the sum polygon.', 'O(n+m)', 'O(n+m)', ['geometry', 'polygon', 'minkowski']],
  impl: `// 闵可夫斯基和 · 实现（凸多边形，CCW）
export interface Pt { x: number; y: number; }
export interface MinkHooks { onMerge?: (i: number, j: number) => void; }
function cmp(a: Pt, b: Pt): boolean {
  const ca = a.y > 0 || (a.y === 0 && a.x >= 0);
  const cb = b.y > 0 || (b.y === 0 && b.x >= 0);
  if (ca !== cb) return ca;
  return a.x * b.y - a.y * b.x > 0;
}
export function minkowskiSum(A: Pt[], B: Pt[], hooks: MinkHooks = {}): Pt[] {
  const edgesA = A.map((p, i) => ({ x: A[(i + 1) % A.length]!.x - p.x, y: A[(i + 1) % A.length]!.y - p.y }));
  const edgesB = B.map((p, i) => ({ x: B[(i + 1) % B.length]!.x - p.x, y: B[(i + 1) % B.length]!.y - p.y }));
  const merged: Pt[] = [];
  let i = 0, j = 0;
  while (i < edgesA.length || j < edgesB.length) {
    if (j >= edgesB.length || (i < edgesA.length && cmp(edgesA[i]!, edgesB[j]!))) {
      merged.push(edgesA[i]!); i++;
    } else { merged.push(edgesB[j]!); j++; }
    hooks.onMerge?.(i, j);
  }
  // reconstruct from origin
  const res: Pt[] = [];
  let cur = { x: 0, y: 0 };
  for (const e of merged) { res.push({ ...cur }); cur = { x: cur.x + e.x, y: cur.y + e.y }; }
  return res;
}`,
  trace: twoFrameTrace('闵可夫斯基和', '两个凸多边形', 'two convex polygons', '和的凸多边形', 'sum polygon',
    `[{ label: '顶点数', value: String(minkowskiSum([{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}],[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}]).length), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minkowskiSum } from '../../src/algorithms/geometry/geo-minkowski-sum/impl.ts';
test('两单位方形之和', () => {
  const sq = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
  const r = minkowskiSum(sq, sq);
  assert.ok(r.length >= 4);
});`,
});

// 26. geo-halfplane-side
ALGS.push({
  id: 'geo-halfplane-side',
  m: ['点在半平面侧', 'Half-Plane Side Test', '判断点在有向直线 ab 的哪一侧。', 'Which side of directed line ab a point lies on.',
    '叉积 (b-a)×(p-a)：>0 在左侧，<0 在右侧，=0 共线。', 'Cross (b-a)×(p-a): positive=left, negative=right, zero=collinear.', 'O(1)', 'O(1)', ['geometry', 'half-plane']],
  impl: `// 点在半平面侧 · 实现
export interface Pt { x: number; y: number; }
export type Side = 'left' | 'right' | 'on';
export function halfPlaneSide(a: Pt, b: Pt, p: Pt): Side {
  const cr = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
  if (cr > 1e-12) return 'left';
  if (cr < -1e-12) return 'right';
  return 'on';
}`,
  trace: twoFrameTrace('点在半平面侧', '输入有向直线与点', 'directed line and point', '侧判定', 'side decided',
    `[{ label: '侧', value: halfPlaneSide({x:0,y:0},{x:1,y:0},{x:0,y:1}), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { halfPlaneSide } from '../../src/algorithms/geometry/geo-halfplane-side/impl.ts';
test('左侧', () => { assert.equal(halfPlaneSide({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }), 'left'); });
test('右侧', () => { assert.equal(halfPlaneSide({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }), 'right'); });
test('共线', () => { assert.equal(halfPlaneSide({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }), 'on'); });`,
});

// 27. geo-angle-bisector-dir
ALGS.push({
  id: 'geo-angle-bisector-dir',
  m: ['角平分线方向', 'Angle Bisector Direction', '求以顶点 V 为角的两条角平分线方向。', 'Angle bisector direction at vertex V.',
    '把两边单位方向向量相加得到内角平分线方向（相减得外角平分线）。', 'Sum of unit direction vectors of the two edges gives the internal bisector direction.', 'O(1)', 'O(1)', ['geometry', 'angle']],
  impl: `// 角平分线方向 · 实现
export interface Pt { x: number; y: number; }
export function angleBisector(v: Pt, a: Pt, b: Pt): Pt {
  const u1x = a.x - v.x, u1y = a.y - v.y;
  const u2x = b.x - v.x, u2y = b.y - v.y;
  const n1 = Math.hypot(u1x, u1y), n2 = Math.hypot(u2x, u2y);
  if (n1 === 0 || n2 === 0) throw new RangeError('退化角度');
  return { x: u1x / n1 + u2x / n2, y: u1y / n1 + u2y / n2 };
}`,
  trace: twoFrameTrace('角平分线方向', '输入三顶点', 'three vertices', '角平分线方向', 'bisector direction',
    `[{ label: '方向', value: '(' + angleBisector({x:0,y:0},{x:1,y:0},{x:0,y:1}).x.toFixed(2) + ',' + angleBisector({x:0,y:0},{x:1,y:0},{x:0,y:1}).y.toFixed(2) + ')', role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { angleBisector } from '../../src/algorithms/geometry/geo-angle-bisector-dir/impl.ts';
test('直角平分线', () => {
  const d = angleBisector({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 });
  assert.ok(Math.abs(d.x - d.y) < 1e-9);
});`,
});

// 28. geo-perpendicular-bisector
ALGS.push({
  id: 'geo-perpendicular-bisector',
  m: ['中垂线', 'Perpendicular Bisector', '求线段 ab 的中垂线（直线方程 ax+by+c=0）。', 'Perpendicular bisector of segment ab as line equation ax+by+c=0.',
    '中点 M，垂线方向为 (dy, -dx)（垂直于 ab 方向）。', 'Through midpoint M, normal direction is along ab; equation derived.', 'O(1)', 'O(1)', ['geometry', 'line']],
  impl: `// 中垂线 · 实现
export interface Pt { x: number; y: number; }
export interface Line { a: number; b: number; c: number; }
export function perpendicularBisector(a: Pt, b: Pt): Line {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const dx = b.x - a.x, dy = b.y - a.y;
  // normal = (dx, dy), passes midpoint
  return { a: dx, b: dy, c: -(dx * mx + dy * my) };
}`,
  trace: twoFrameTrace('中垂线', '输入线段', 'input segment', '中垂线方程', 'bisector equation',
    `[{ label: '方程', value: JSON.stringify(perpendicularBisector({x:0,y:0},{x:2,y:0})), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { perpendicularBisector } from '../../src/algorithms/geometry/geo-perpendicular-bisector/impl.ts';
test('水平线段中垂线', () => {
  const l = perpendicularBisector({ x: 0, y: 0 }, { x: 2, y: 0 });
  assert.equal(l.a, 2);
  assert.equal(l.c, -2);
});`,
});

// 29. geo-line-normal-form
ALGS.push({
  id: 'geo-line-normal-form',
  m: ['直线一般式转法线式', 'Line General to Normal Form', '把直线 ax+by+c=0 归一化为法线式。', 'Normalize line ax+by+c=0 into normal form.',
    '除以 √(a²+b²) 得到法线式，符号使 c≤0。', 'Divide by √(a²+b²); sign chosen so c≤0.', 'O(1)', 'O(1)', ['geometry', 'line']],
  impl: `// 直线一般式转法线式 · 实现
export interface Line { a: number; b: number; c: number; }
export function toNormalForm(line: Line): Line {
  const n = Math.hypot(line.a, line.b);
  if (n === 0) throw new RangeError('退化直线');
  const sign = line.c > 0 ? -1 : 1;
  return { a: (sign * line.a) / n, b: (sign * line.b) / n, c: (sign * line.c) / n };
}`,
  trace: twoFrameTrace('直线一般式转法线式', '输入 ax+by+c', 'ax+by+c', '法线式', 'normal form',
    `[{ label: '法线式', value: JSON.stringify(toNormalForm({a:3,b:4,c:-10})), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toNormalForm } from '../../src/algorithms/geometry/geo-line-normal-form/impl.ts';
test('3x+4y-10=0 归一化', () => {
  const l = toNormalForm({ a: 3, b: 4, c: -10 });
  assert.ok(Math.abs(l.a - 0.6) < 1e-9);
  assert.ok(Math.abs(l.c - (-2)) < 1e-9);
});
test('退化报错', () => { assert.throws(() => toNormalForm({ a: 0, b: 0, c: 1 }), RangeError); });`,
});

// 30. geo-barycentric-coord
ALGS.push({
  id: 'geo-barycentric-coord',
  m: ['重心坐标', 'Barycentric Coordinates', '求点 P 在三角形 ABC 中的重心坐标。', 'Barycentric coordinates of P in triangle ABC.',
    'P = uA + vB + wC，u+v+w=1。用面积比求解。', 'P = uA + vB + wC with u+v+w=1; computed via area ratios.', 'O(1)', 'O(1)', ['geometry', 'triangle']],
  impl: `// 重心坐标 · 实现
export interface Pt { x: number; y: number; }
export function barycentric(p: Pt, a: Pt, b: Pt, c: Pt): { u: number; v: number; w: number } {
  const d = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
  if (Math.abs(d) < 1e-12) throw new RangeError('退化三角形');
  const u = ((b.y - c.y) * (p.x - c.x) + (c.x - b.x) * (p.y - c.y)) / d;
  const v = ((c.y - a.y) * (p.x - c.x) + (a.x - c.x) * (p.y - c.y)) / d;
  return { u, v, w: 1 - u - v };
}`,
  trace: twoFrameTrace('重心坐标', '输入点与三角形', 'point and triangle', '重心坐标', 'barycentric coords',
    `[{ label: 'uvw', value: JSON.stringify(barycentric({x:0,y:0},{x:0,y:0},{x:1,y:0},{x:0,y:1})), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { barycentric } from '../../src/algorithms/geometry/geo-barycentric-coord/impl.ts';
test('顶点A的u=1', () => {
  const r = barycentric({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 });
  assert.ok(Math.abs(r.u - 1) < 1e-9);
});
test('和为1', () => {
  const r = barycentric({ x: 0.2, y: 0.3 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 });
  assert.ok(Math.abs(r.u + r.v + r.w - 1) < 1e-9);
});`,
});

// 31. geo-point-in-triangle
ALGS.push({
  id: 'geo-point-in-triangle',
  m: ['点在三角形内', 'Point in Triangle', '判断点是否在三角形内部（含边界）。', 'Test if a point lies inside a triangle (boundary inclusive).',
    '用重心坐标：u,v,w ≥ 0 则在内。', 'Using barycentric coordinates: u,v,w ≥ 0 means inside.', 'O(1)', 'O(1)', ['geometry', 'triangle', 'point-in-polygon']],
  impl: `// 点在三角形内 · 实现
export interface Pt { x: number; y: number; }
export function pointInTriangle(p: Pt, a: Pt, b: Pt, c: Pt): boolean {
  const d = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
  if (Math.abs(d) < 1e-12) return false;
  const u = ((b.y - c.y) * (p.x - c.x) + (c.x - b.x) * (p.y - c.y)) / d;
  const v = ((c.y - a.y) * (p.x - c.x) + (a.x - c.x) * (p.y - c.y)) / d;
  const w = 1 - u - v;
  return u >= -1e-9 && v >= -1e-9 && w >= -1e-9;
}`,
  trace: twoFrameTrace('点在三角形内', '输入点与三角形', 'point and triangle', '判定完成', 'test done',
    `[{ label: '在内?', value: String(pointInTriangle({x:0.2,y:0.2},{x:0,y:0},{x:1,y:0},{x:0,y:1})), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pointInTriangle } from '../../src/algorithms/geometry/geo-point-in-triangle/impl.ts';
test('在内', () => { assert.equal(pointInTriangle({ x: 0.2, y: 0.2 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }), true); });
test('在外', () => { assert.equal(pointInTriangle({ x: 2, y: 2 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }), false); });`,
});

// 32. geo-circle-area-calc
ALGS.push({
  id: 'geo-circle-area-calc',
  m: ['圆面积', 'Circle Area', '由半径计算圆面积。', 'Area of a circle given its radius.',
    '面积 = π r²。', 'Area = π r².', 'O(1)', 'O(1)', ['geometry', 'circle', 'area']],
  impl: `// 圆面积 · 实现
export function circleArea(r: number): number {
  if (r < 0) throw new RangeError('半径必须非负');
  return Math.PI * r * r;
}`,
  trace: twoFrameTrace('圆面积', '输入半径', 'radius in', '面积 = πr²', 'area = πr²',
    `[{ label: '面积', value: circleArea(2).toFixed(3), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { circleArea } from '../../src/algorithms/geometry/geo-circle-area-calc/impl.ts';
test('单位圆面积', () => { assert.ok(Math.abs(circleArea(1) - Math.PI) < 1e-9); });
test('负半径报错', () => { assert.throws(() => circleArea(-1), RangeError); });`,
});

// 33. geo-circle-circumference
ALGS.push({
  id: 'geo-circle-circumference',
  m: ['圆周长', 'Circle Circumference', '由半径计算圆周长。', 'Circumference of a circle given its radius.',
    '周长 = 2πr。', 'Circumference = 2πr.', 'O(1)', 'O(1)', ['geometry', 'circle']],
  impl: `// 圆周长 · 实现
export function circleCircumference(r: number): number {
  if (r < 0) throw new RangeError('半径必须非负');
  return 2 * Math.PI * r;
}`,
  trace: twoFrameTrace('圆周长', '输入半径', 'radius in', '周长 = 2πr', 'circumference = 2πr',
    `[{ label: '周长', value: circleCircumference(1).toFixed(3), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { circleCircumference } from '../../src/algorithms/geometry/geo-circle-circumference/impl.ts';
test('单位圆周长', () => { assert.ok(Math.abs(circleCircumference(1) - 2 * Math.PI) < 1e-9); });`,
});

// 34. geo-arc-length-calc
ALGS.push({
  id: 'geo-arc-length-calc',
  m: ['圆弧弧长', 'Arc Length', '由半径与圆心角（弧度）求弧长。', 'Arc length given radius and central angle (radians).',
    '弧长 = r · θ。', 'Arc length = r · θ.', 'O(1)', 'O(1)', ['geometry', 'circle', 'arc']],
  impl: `// 圆弧弧长 · 实现
export function arcLength(r: number, theta: number): number {
  if (r < 0) throw new RangeError('半径必须非负');
  if (theta < 0) throw new RangeError('角度必须非负');
  return r * theta;
}`,
  trace: twoFrameTrace('圆弧弧长', '输入半径与角度', 'radius and angle', '弧长 = rθ', 'arc = rθ',
    `[{ label: '弧长', value: arcLength(2, Math.PI).toFixed(3), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { arcLength } from '../../src/algorithms/geometry/geo-arc-length-calc/impl.ts';
test('半圆弧长', () => { assert.ok(Math.abs(arcLength(2, Math.PI) - 2 * Math.PI) < 1e-9); });`,
});

// 35. geo-sector-area-calc
ALGS.push({
  id: 'geo-sector-area-calc',
  m: ['扇形面积', 'Sector Area', '由半径与圆心角求扇形面积。', 'Sector area given radius and central angle.',
    '扇形面积 = ½ r² θ。', 'Sector area = ½ r² θ.', 'O(1)', 'O(1)', ['geometry', 'circle', 'area']],
  impl: `// 扇形面积 · 实现
export function sectorArea(r: number, theta: number): number {
  if (r < 0) throw new RangeError('半径必须非负');
  if (theta < 0) throw new RangeError('角度必须非负');
  return 0.5 * r * r * theta;
}`,
  trace: twoFrameTrace('扇形面积', '输入半径与角度', 'radius and angle', '面积 = ½r²θ', 'area = ½r²θ',
    `[{ label: '面积', value: sectorArea(2, Math.PI).toFixed(3), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sectorArea } from '../../src/algorithms/geometry/geo-sector-area-calc/impl.ts';
test('半圆扇形=半圆面积', () => { assert.ok(Math.abs(sectorArea(2, Math.PI) - 2 * Math.PI) < 1e-9); });`,
});

// 36. geo-segment-midpoint
ALGS.push({
  id: 'geo-segment-midpoint',
  m: ['线段中点', 'Segment Midpoint', '求线段 ab 中点。', 'Midpoint of segment ab.',
    '中点 M = ((a.x+b.x)/2, (a.y+b.y)/2)。', 'Midpoint M = ((a.x+b.x)/2, (a.y+b.y)/2).', 'O(1)', 'O(1)', ['geometry', 'segment']],
  impl: `// 线段中点 · 实现
export interface Pt { x: number; y: number; }
export function midpoint(a: Pt, b: Pt): Pt {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}`,
  trace: twoFrameTrace('线段中点', '输入线段', 'input segment', '中点', 'midpoint',
    `[{ label: '中点', value: '(' + midpoint({x:0,y:0},{x:4,y:2}).x + ',' + midpoint({x:0,y:0},{x:4,y:2}).y + ')', role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { midpoint } from '../../src/algorithms/geometry/geo-segment-midpoint/impl.ts';
test('中点', () => { assert.deepEqual(midpoint({ x: 0, y: 0 }, { x: 4, y: 2 }), { x: 2, y: 1 }); });`,
});

// 37. geo-segment-length
ALGS.push({
  id: 'geo-segment-length',
  m: ['线段长度', 'Segment Length', '求线段欧氏长度。', 'Euclidean length of a segment.',
    '长度 = √((b.x-a.x)² + (b.y-a.y)²)。', 'Length = √((b.x-a.x)² + (b.y-a.y)²).', 'O(1)', 'O(1)', ['geometry', 'segment']],
  impl: `// 线段长度 · 实现
export interface Pt { x: number; y: number; }
export function segmentLength(a: Pt, b: Pt): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}`,
  trace: twoFrameTrace('线段长度', '输入线段', 'input segment', '欧氏长度', 'euclidean length',
    `[{ label: '长度', value: segmentLength({x:0,y:0},{x:3,y:4}).toFixed(3), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { segmentLength } from '../../src/algorithms/geometry/geo-segment-length/impl.ts';
test('3-4-5', () => { assert.equal(segmentLength({ x: 0, y: 0 }, { x: 3, y: 4 }), 5); });`,
});

// 38. geo-quadrilateral-area
ALGS.push({
  id: 'geo-quadrilateral-area',
  m: ['四边形面积', 'Quadrilateral Area', '用鞋带公式求简单四边形面积。', 'Area of a simple quadrilateral via the shoelace formula.',
    '对四个顶点应用鞋带公式：面积 = ½|Σ(x_i·y_{i+1} - x_{i+1}·y_i)|。', 'Shoelace over four vertices: area = ½|Σ(x_i·y_{i+1} - x_{i+1}·y_i)|.', 'O(1)', 'O(1)', ['geometry', 'polygon', 'area']],
  impl: `// 四边形面积 · 实现
export interface Pt { x: number; y: number; }
export function quadrilateralArea(a: Pt, b: Pt, c: Pt, d: Pt): number {
  const pts = [a, b, c, d];
  let s = 0;
  for (let i = 0; i < 4; i++) {
    const p = pts[i]!, q = pts[(i + 1) % 4]!;
    s += p.x * q.y - q.x * p.y;
  }
  return Math.abs(s) / 2;
}`,
  trace: twoFrameTrace('四边形面积', '输入四点', 'four points', '鞋带面积', 'shoelace area',
    `[{ label: '面积', value: quadrilateralArea({x:0,y:0},{x:4,y:0},{x:4,y:3},{x:0,y:3}).toString(), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quadrilateralArea } from '../../src/algorithms/geometry/geo-quadrilateral-area/impl.ts';
test('矩形面积', () => {
  assert.equal(quadrilateralArea({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 3 }, { x: 0, y: 3 }), 12);
});`,
});

// 39. geo-distance-3d
ALGS.push({
  id: 'geo-distance-3d',
  m: ['三维欧氏距离', '3D Euclidean Distance', '求三维空间两点距离。', 'Euclidean distance between two 3D points.',
    '距离 = √(Δx² + Δy² + Δz²)。', 'Distance = √(Δx² + Δy² + Δz²).', 'O(1)', 'O(1)', ['geometry', '3d', 'distance']],
  impl: `// 三维欧氏距离 · 实现
export interface Pt3 { x: number; y: number; z: number; }
export function distance3D(a: Pt3, b: Pt3): number {
  return Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
}`,
  trace: twoFrameTrace('三维欧氏距离', '输入两点', 'two points', '距离', 'distance',
    `[{ label: '距离', value: distance3D({x:0,y:0,z:0},{x:1,y:2,z:2}).toString(), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { distance3D } from '../../src/algorithms/geometry/geo-distance-3d/impl.ts';
test('单位距离', () => { assert.equal(distance3D({ x: 0, y: 0, z: 0 }, { x: 1, y: 2, z: 2 }), 3); });`,
});

// 40. geo-sphere-surface-area
ALGS.push({
  id: 'geo-sphere-surface-area',
  m: ['球表面积', 'Sphere Surface Area', '由半径求球体表面积。', 'Surface area of a sphere given radius.',
    '表面积 = 4πr²。', 'Surface area = 4πr².', 'O(1)', 'O(1)', ['geometry', '3d', 'sphere']],
  impl: `// 球表面积 · 实现
export function sphereSurfaceArea(r: number): number {
  if (r < 0) throw new RangeError('半径必须非负');
  return 4 * Math.PI * r * r;
}`,
  trace: twoFrameTrace('球表面积', '输入半径', 'radius', '表面积 = 4πr²', 'area = 4πr²',
    `[{ label: '面积', value: sphereSurfaceArea(1).toFixed(3), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sphereSurfaceArea } from '../../src/algorithms/geometry/geo-sphere-surface-area/impl.ts';
test('单位球', () => { assert.ok(Math.abs(sphereSurfaceArea(1) - 4 * Math.PI) < 1e-9); });`,
});

// 41. geo-box-volume
ALGS.push({
  id: 'geo-box-volume',
  m: ['长方体体积', 'Box Volume', '由三边长求长方体体积。', 'Volume of a rectangular box given its three side lengths.',
    '体积 = 长 × 宽 × 高。', 'Volume = length × width × height.', 'O(1)', 'O(1)', ['geometry', '3d', 'volume']],
  impl: `// 长方体体积 · 实现
export function boxVolume(l: number, w: number, h: number): number {
  if (l < 0 || w < 0 || h < 0) throw new RangeError('边长必须非负');
  return l * w * h;
}`,
  trace: twoFrameTrace('长方体体积', '输入三边长', 'three sides', '体积', 'volume',
    `[{ label: '体积', value: boxVolume(2,3,4).toString(), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boxVolume } from '../../src/algorithms/geometry/geo-box-volume/impl.ts';
test('2x3x4', () => { assert.equal(boxVolume(2, 3, 4), 24); });`,
});

// 42. geo-cylinder-volume
ALGS.push({
  id: 'geo-cylinder-volume',
  m: ['圆柱体积', 'Cylinder Volume', '由底面半径与高求圆柱体积。', 'Volume of a cylinder given base radius and height.',
    '体积 = π r² h。', 'Volume = π r² h.', 'O(1)', 'O(1)', ['geometry', '3d', 'volume']],
  impl: `// 圆柱体积 · 实现
export function cylinderVolume(r: number, h: number): number {
  if (r < 0 || h < 0) throw new RangeError('尺寸必须非负');
  return Math.PI * r * r * h;
}`,
  trace: twoFrameTrace('圆柱体积', '输入半径与高', 'radius and height', '体积 = πr²h', 'volume = πr²h',
    `[{ label: '体积', value: cylinderVolume(2,3).toFixed(3), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cylinderVolume } from '../../src/algorithms/geometry/geo-cylinder-volume/impl.ts';
test('单位圆柱', () => { assert.ok(Math.abs(cylinderVolume(1, 1) - Math.PI) < 1e-9); });`,
});

// 43. geo-cone-volume
ALGS.push({
  id: 'geo-cone-volume',
  m: ['圆锥体积', 'Cone Volume', '由底面半径与高求圆锥体积。', 'Volume of a cone given base radius and height.',
    '体积 = ⅓ π r² h。', 'Volume = ⅓ π r² h.', 'O(1)', 'O(1)', ['geometry', '3d', 'volume']],
  impl: `// 圆锥体积 · 实现
export function coneVolume(r: number, h: number): number {
  if (r < 0 || h < 0) throw new RangeError('尺寸必须非负');
  return (Math.PI * r * r * h) / 3;
}`,
  trace: twoFrameTrace('圆锥体积', '输入半径与高', 'radius and height', '体积 = ⅓πr²h', 'volume = ⅓πr²h',
    `[{ label: '体积', value: coneVolume(2,3).toFixed(3), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coneVolume } from '../../src/algorithms/geometry/geo-cone-volume/impl.ts';
test('圆锥=1/3圆柱', () => {
  assert.ok(Math.abs(coneVolume(2, 3) - (Math.PI * 2 * 2 * 3) / 3) < 1e-9);
});`,
});

// 44. geo-tetrahedron-volume
ALGS.push({
  id: 'geo-tetrahedron-volume',
  m: ['四面体体积', 'Tetrahedron Volume', '由四面体四顶点求体积（标量三重积）。', 'Volume of a tetrahedron from four vertices (scalar triple product).',
    '以一个面为底，体积 = |det(b-a, c-a, d-a)| / 6。', 'Volume = |det(b-a, c-a, d-a)| / 6.', 'O(1)', 'O(1)', ['geometry', '3d', 'volume']],
  impl: `// 四面体体积 · 实现
export interface Pt3 { x: number; y: number; z: number; }
export function tetrahedronVolume(a: Pt3, b: Pt3, c: Pt3, d: Pt3): number {
  const ux = b.x - a.x, uy = b.y - a.y, uz = b.z - a.z;
  const vx = c.x - a.x, vy = c.y - a.y, vz = c.z - a.z;
  const wx = d.x - a.x, wy = d.y - a.y, wz = d.z - a.z;
  const det = ux * (vy * wz - vz * wy) - uy * (vx * wz - vz * wx) + uz * (vx * wy - vy * wx);
  return Math.abs(det) / 6;
}`,
  trace: twoFrameTrace('四面体体积', '输入四点', 'four points', '体积 = |det|/6', 'volume = |det|/6',
    `[{ label: '体积', value: tetrahedronVolume({x:0,y:0,z:0},{x:1,y:0,z:0},{x:0,y:1,z:0},{x:0,y:0,z:1}).toFixed(4), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tetrahedronVolume } from '../../src/algorithms/geometry/geo-tetrahedron-volume/impl.ts';
test('单位四面体体积 1/6', () => {
  const v = tetrahedronVolume({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 1 });
  assert.ok(Math.abs(v - 1 / 6) < 1e-9);
});`,
});

// 45. geo-points-collinear
ALGS.push({
  id: 'geo-points-collinear',
  m: ['三点共线判定', 'Collinearity Test', '判断三点是否共线。', 'Test whether three points are collinear.',
    '三点 a,b,c 共线 ⟺ 叉积 (b-a)×(c-a) = 0。', 'a,b,c collinear ⟺ cross (b-a)×(c-a) = 0.', 'O(1)', 'O(1)', ['geometry', 'collinearity']],
  impl: `// 三点共线判定 · 实现
export interface Pt { x: number; y: number; }
export function areCollinear(a: Pt, b: Pt, c: Pt, eps = 1e-9): boolean {
  const cr = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  return Math.abs(cr) < eps;
}`,
  trace: twoFrameTrace('三点共线判定', '输入三点', 'three points', '共线判定', 'collinearity test',
    `[{ label: '共线?', value: String(areCollinear({x:0,y:0},{x:1,y:1},{x:2,y:2})), role: 'final' as BarRole }]`),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { areCollinear } from '../../src/algorithms/geometry/geo-points-collinear/impl.ts';
test('共线', () => { assert.equal(areCollinear({ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }), true); });
test('不共线', () => { assert.equal(areCollinear({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }), false); });`,
});

// write all
for (const a of ALGS) {
  writeAlg(a.id, meta(a.id, ...a.m), a.impl, a.trace, a.test);
}
console.log('geometry: wrote ' + ALGS.length + ' algorithms');
