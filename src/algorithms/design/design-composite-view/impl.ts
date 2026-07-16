export type View = { render(): string };
export class LeafView implements View {
  constructor(private html: string) {}
  render(): string {
    return this.html;
  }
}
export class CompositeView implements View {
  private kids: View[] = [];
  add(v: View): this {
    this.kids.push(v);
    return this;
  }
  render(): string {
    return this.kids.map((k) => k.render()).join('\n');
  }
}
