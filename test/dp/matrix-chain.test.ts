import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matrixChain } from '../../src/algorithms/dp/matrix-chain/impl.ts';

test('matrix-chain 经典用例 (CLRS)：[30,35,15,5,10,20,25] = 15125', () => {
  const r = matrixChain([30, 35, 15, 5, 10, 20, 25]);
  assert.equal(r.cost, 15125);
  assert.equal(r.parenthesization, '((A1 × (A2 × A3)) × ((A4 × A5) × A6))');
});

test('matrix-chain 三个矩阵基础例', () => {
  // A1(10×30) A2(30×5) A3(5×60)
  // (A1 A2) A3: 10*30*5 + 10*5*60 = 1500 + 3000 = 4500
  // A1 (A2 A3): 30*5*60 + 10*30*60 = 9000 + 18000 = 27000
  const r = matrixChain([10, 30, 5, 60]);
  assert.equal(r.cost, 4500);
});

test('matrix-chain 单矩阵无需乘', () => {
  assert.deepEqual(matrixChain([5, 7]), { cost: 0, parenthesization: 'A1' });
});

test('matrix-chain 两个矩阵只有一种方案', () => {
  // A1(2×3) A2(3×4)：2*3*4 = 24
  const r = matrixChain([2, 3, 4]);
  assert.equal(r.cost, 24);
  assert.equal(r.parenthesization, '(A1 × A2)');
});

test('matrix-chain 边界：空 / 维度不足', () => {
  assert.deepEqual(matrixChain([]), { cost: 0, parenthesization: '' });
  assert.deepEqual(matrixChain([1]), { cost: 0, parenthesization: '' });
});

test('matrix-chain 维度相同时退化分析', () => {
  // 全部 n×n：任意括号化乘法次数相同 = (n-1)*N³
  // 3 个 2×2：(2×2×2)*2 = 16
  const r = matrixChain([2, 2, 2, 2]);
  assert.equal(r.cost, 16);
});

test('matrix-chain 高瘦与矮胖对比', () => {
  // 同样的连乘结果，不同维度顺序代价不同
  // [10,100,5] vs [10,5,100]：两矩阵，前者 10*100*5=5000，后者 10*5*100=5000（相同）
  // 但三矩阵 [10,100,5,50]：
  //   (A1A2)A3 = 10*100*5 + 10*5*50 = 5000+2500 = 7500
  //   A1(A2A3) = 100*5*50 + 10*100*50 = 25000+50000 = 75000
  const r = matrixChain([10, 100, 5, 50]);
  assert.equal(r.cost, 7500);
});

test('matrix-chain 括号化字符串合法（含正确矩阵数）', () => {
  const dims = [30, 35, 15, 5, 10, 20, 25];
  const r = matrixChain(dims);
  // A1..A6 都应出现恰好一次
  for (let i = 1; i < dims.length; i++) {
    const count = r.parenthesization.split(`A${i}`).length - 1;
    assert.equal(count, 1, `A${i} 应出现恰好一次`);
  }
});

test('matrix-chain 钩子被调用', () => {
  let tries = 0;
  let bests = 0;
  let backtracks = 0;
  matrixChain([10, 30, 5, 60], {
    onTrySplit: () => tries++,
    onSetBest: () => bests++,
    onBacktrack: () => backtracks++,
  });
  assert.ok(tries > 0, '应尝试断点');
  assert.ok(bests > 0, '应确定最优值');
  assert.ok(backtracks > 0, '应回溯括号化');
});

test('matrix-chain 尝试断点数 = 内部区间断点总数', () => {
  // n=3 矩阵：区间 [1,2] 1 个断点 + [2,3] 1 个 + [1,3] 2 个 = 4
  let tries = 0;
  matrixChain([10, 30, 5, 60], { onTrySplit: () => tries++ });
  assert.equal(tries, 4);
});
