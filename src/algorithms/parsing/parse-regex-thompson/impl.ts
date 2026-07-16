// Thompson 构造法 · 纯算法实现
export interface NfaFragment {
  start: number;
  accept: number;
}
export interface ThompsonNfa {
  states: number;
  edges: Array<{ from: number; input: string | null; to: number }>;
  start: number;
  accept: number;
}
type RegexAst =
  | { t: 'lit'; c: string }
  | { t: 'or'; a: RegexAst; b: RegexAst }
  | { t: 'cat'; a: RegexAst; b: RegexAst }
  | { t: 'star'; a: RegexAst };

export class ThompsonBuilder {
  states = 0;
  edges: Array<{ from: number; input: string | null; to: number }> = [];
  fresh(): number {
    return this.states++;
  }
  add(from: number, input: string | null, to: number): void {
    this.edges.push({ from, input, to });
  }
  build(ast: RegexAst): NfaFragment {
    if (ast.t === 'lit') {
      const s = this.fresh();
      const a = this.fresh();
      this.add(s, ast.c, a);
      return { start: s, accept: a };
    }
    if (ast.t === 'or') {
      const s = this.fresh();
      const a = this.fresh();
      const A = this.build(ast.a);
      const B = this.build(ast.b);
      this.add(s, null, A.start);
      this.add(s, null, B.start);
      this.add(A.accept, null, a);
      this.add(B.accept, null, a);
      return { start: s, accept: a };
    }
    if (ast.t === 'cat') {
      const A = this.build(ast.a);
      const B = this.build(ast.b);
      this.add(A.accept, null, B.start);
      return { start: A.start, accept: B.accept };
    }
    // star
    const s = this.fresh();
    const a = this.fresh();
    const A = this.build(ast.a);
    this.add(s, null, A.start);
    this.add(s, null, a);
    this.add(A.accept, null, A.start);
    this.add(A.accept, null, a);
    return { start: s, accept: a };
  }
}

export function buildFromAst(ast: RegexAst): ThompsonNfa {
  const b = new ThompsonBuilder();
  const f = b.build(ast);
  return { states: b.states, edges: b.edges, start: f.start, accept: f.accept };
}
export const lit = (c: string): RegexAst => ({ t: 'lit', c });
export const or_ = (a: RegexAst, b: RegexAst): RegexAst => ({ t: 'or', a, b });
export const cat = (a: RegexAst, b: RegexAst): RegexAst => ({ t: 'cat', a, b });
export const star = (a: RegexAst): RegexAst => ({ t: 'star', a });
