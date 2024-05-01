
interface IStack<T> {
  push(item: T): void;
  pop(): T | undefined;
  peek(): T | undefined;
  size(): number;
  clear(): void;
}

export class Stack<T> implements IStack<T> {
  private storage: T[] = [];
  private capacity: number;

  constructor(capacity: number = Infinity) {
    this.capacity = capacity;
  };

  push(item: T): void {
    if (this.size() === this.capacity)
      throw new Error("Stack overflow XD, u have exeeded the stack capacity!");
    this.storage.push(item);
  }

  pop(): T | undefined {
    return this.storage.pop();
  }

  peek(): T | undefined {
    return this.storage[this.size() - 1];
  }

  size(): number {
    return this.storage.length;
  }

  clear(): void {
    this.storage = [];
  }
}
