import { IQueue } from "./queue.type";



export class PriorityQueue<T> {

  private storage: (T | number)[] = [Infinity,];
  private capacity: number;
  private operator: (rhs: T | number, lhs: T | number) => boolean;


  constructor(operator: (rhs: T | number, lhs: T | number) => boolean, capacity: number = Infinity) {
    // this.storage = storage;
    this.capacity = capacity;
    this.operator = operator;
    // console.log("storage: ", this.storage);
    // console.log("storage size: ", this.storage.length);
    this.buildHeap();
  }

  private parrent(index: number) {
    return Math.floor(index / 2);
  }

  private left(index: number) {
    return index * 2;
  }

  private right(index: number) {
    return (index * 2) + 1;
  }


  private heapfy(index: number) {
    let left: number = this.left(index);
    let right: number = this.right(index);
    let toCompare: number;

    if (left < this.size() && this.operator(this.storage[left], this.storage[index])) {
      toCompare = left;
    }
    else {
      toCompare = index;
    }

    if (right < this.size() && this.operator(this.storage[right], this.storage[toCompare])) {
      toCompare = right;
    }

    if (toCompare !== index) {
      let tmp = this.storage[toCompare];

      this.storage[toCompare] = this.storage[index];
      this.storage[index] = tmp;

      this.heapfy(toCompare);
    }
  }

  private buildHeap() {
    for (let i = Math.floor(this.size() / 2); i > 0; i--)
      this.heapfy(i);
  }

  updatePriority(item: T): void {
    // console.log("the item: ", item);
    // console.log("the queue: ", this.storage);
    let index = 1;
    for (; this.storage[index] !== item && index < this.size(); index++)
      ;

    if (index === this.size() && this.storage[index] !== item)
      return;
    // console.log("shit ended");
    while (index > 1 && this.operator(this.storage[index], this.storage[this.parrent(index)])) {
      let tmp = this.storage[this.parrent(index)];

      this.storage[this.parrent(index)] = this.storage[index];
      this.storage[index] = tmp;

      index = this.parrent(index);
      // console.log("index: ", index);
    }
  }

  enqueue(item: T): void {
    if (this.size() === this.capacity)
      throw Error("you have reached the max capacity, you cannot add more items");
    this.storage.push(item);
    this.updatePriority(item);
  }

  peek(): (T | number) | undefined {
    return this.storage[1];
  }

  dequeue(): (T | number) | undefined {
    let head: (T | number) | undefined = this.peek();
    this.storage[1] = this.storage[this.size() - 1]
    this.storage.pop();
    this.heapfy(1);
    return head;
  }

  size(): number {
    return this.storage.length;
  }

  clear(): void {
    this.storage = [Infinity,];
  }

}
