export class LfPool {
  private leader = 0;
  private size = 1;
  setSize(n: number): void {
    this.size = Math.max(1, n);
    this.leader = 0;
  }
  currentLeader(): number {
    return this.leader;
  }
  promote(): number {
    this.leader = (this.leader + 1) % this.size;
    return this.leader;
  }
}
