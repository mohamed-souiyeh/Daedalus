import { IQueue } from "./queue.type";



export class PriorityQueue<T> implements IQueue<T>{

  private storage: T[] = [];
  private capacity: number;
  private operator: (rhs: T, lhs: T) => boolean;


  constructor(operator: (rhs: T, lhs: T) => boolean, capacity: number = Infinity) {
    // this.storage = storage;
    this.capacity = capacity;
    this.operator = operator;
    this.buildHeap();
  }

  private parrent(index: number) {
    return index / 2;
  }

  private left(index: number) {
    return index * 2;
  }

  private right(index: number) {
    return (index * 2) + 1;
  }


  private heapfy(index: number) {
    let left: number = this.left(index + 1) - 1;
    let right: number = this.right(index + 1) - 1;
    let largest: number;

    if (left < this.size() && this.operator(this.storage[left], this.storage[index])) {
      largest = left;
    }
    else {
      largest = index;
    }

    if (right < this.size() && this.operator(this.storage[right], this.storage[largest])) {
      largest = right;
    }

    if (largest !== index) {
      let tmp = this.storage[largest];

      this.storage[largest] = this.storage[index];
      this.storage[index] = tmp;
      this.heapfy(largest);
    }
  }

  private buildHeap() {
    for (let i = this.size() / 2; i >= 0; i--)
      this.heapfy(i);
  }

  enqueue(item: T): void {
    if (this.size() === this.capacity)
      throw Error("you have reached the max capacity, you cannot add more items");
    this.storage.unshift(item);
    this.heapfy(0);
  }

  peek(): T | undefined {
    return this.storage[0];
  }

  dequeue(): T | undefined {
    let head: T | undefined = this.storage.shift();
    this.heapfy(0);
    return head;
  }

  size(): number {
    return this.storage.length;
  }

  clear(): void {
    this.storage = [];
  }

  print() {
    console.log("max queue elements: ", this.storage.join(", "));
  }
}
