import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluate,
  chessEval,
  ticTacToeEval,
} from '../../src/algorithms/ai-search/ais-heuristic-eval/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-heuristic-eval/trace.ts';

test('ais-heuristic-eval 加权求和', () => {
  assert.equal(evaluate([{ name: 'a', value: 2, weight: 3 }]), 6);
  assert.equal(
    evaluate([
      { name: 'a', value: 2, weight: 3 },
      { name: 'b', value: 1, weight: -1 },
    ]),
    5,
  );
});

test('ais-heuristic-eval 国际象棋物质主导', () => {
  // 物质差大则评分高
  assert.ok(chessEval(5, 0) > chessEval(0, 50));
});

test('ais-heuristic-eval 井字棋三连高分', () => {
  const win = [
    [1, 1, 1],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const open = [
    [1, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  assert.ok(ticTacToeEval(win) > ticTacToeEval(open));
});

test('ais-heuristic-eval trace', () => {
  assert.ok(buildTrace().length > 2);
});
