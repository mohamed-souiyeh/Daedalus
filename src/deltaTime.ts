import { globals } from "./Events/input.js";




export class DeltaTime {
  #lastTime: number;
  #timeStep: number;
  #debugTimeStep: number = 0;

  constructor() {
    this.#lastTime = 0;
    this.#timeStep = 0;
    this.#debugTimeStep = 0;
  }

  get debugTimeStep() {
    return this.#debugTimeStep;
  }

  get timeStep() {
    return this.#timeStep;
  }

  get lastTime() {
    return this.#lastTime;
  }

  set lastTime(value: number) {
    this.#lastTime = value;
  }

  set timeStep(value: number) {
    this.#timeStep = value;
  }

  set debugTimeStep(value: number) {
    this.#debugTimeStep = value;
  }

  public oneStepIsDone() {
    if (this.#timeStep >= globals.delay && !globals.isPaused) {
      this.#timeStep = 0;
      return true;
    }
    return false;
  }

  public oneDebugStepIsDone() {
    if (this.#debugTimeStep >= 16) {
      this.#debugTimeStep = 0;
      return true;
    }
    return false;
  }

  public update(dt: number) {
    this.#timeStep += dt - this.#lastTime;
    this.#debugTimeStep += dt - this.#lastTime;
    this.#lastTime = dt;
  }

}


