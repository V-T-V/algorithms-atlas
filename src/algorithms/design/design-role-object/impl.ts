export interface Role {
  play(): string;
}
export class Core {
  private roles = new Map<string, Role>();
  private n = 0;
  addRole(name: string, r: Role, hooks: { onAdd?: (n: string) => void } = {}): void {
    this.roles.set(name, r);
    this.n++;
    hooks.onAdd?.(name);
  }
  as(name: string): Role | undefined {
    return this.roles.get(name);
  }
  count(): number {
    return this.n;
  }
}
