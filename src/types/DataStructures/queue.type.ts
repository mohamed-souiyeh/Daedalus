interface IQueue<T> {
  enqueue(item: T): void;
  dequeue(): T | undefined;
  peek(): T | undefined;
  size(): number;
}

export class Queue<T> implements IQueue<T> {
  private storage: T[] = [];
  private capacity: number;

  constructor(capacity: number = Infinity) {
    this.capacity = capacity;
  }

  enqueue(item: T): void {
    if (this.size() === this.capacity)
      throw Error("you have reached the max capacity, you cannot add more items");
    this.storage.push(item);
  }

  peek(): T | undefined {
    return this.storage[0];
  }

  dequeue(): T | undefined {
    return this.storage.shift();
  }

  size(): number {
    return this.storage.length;
  }

  clear(): void {
    this.storage = [];
  }
}
