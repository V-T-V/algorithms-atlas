import { test } from 'node:test';
import assert from 'node:assert/strict';
import { twoStep, type Logical } from '../../src/algorithms/design/design-two-step-view/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-two-step-view/trace.ts';
const toL = (n: string): Logical => ({ tag: 'p', text: n });
const theme = (l: Logical): string => '<' + l.tag + '>' + l.text + '</' + l.tag + '>';
test('two-step 渲染', () => assert.equal(twoStep(['a', 'b'], toL, theme), '<p>a</p><p>b</p>'));
test('two-step trace 非空', () => assert.ok(buildTrace().length > 0));
