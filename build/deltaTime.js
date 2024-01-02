import { delay, isPaused } from "./input.js";
export class DeltaTime {
    #lastTime;
    #timeStep;
    #debugTimeStep = 0;
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
    set lastTime(value) {
        this.#lastTime = value;
    }
    set timeStep(value) {
        this.#timeStep = value;
    }
    set debugTimeStep(value) {
        this.#debugTimeStep = value;
    }
    oneStepIsDone() {
        if (this.#timeStep >= delay && !isPaused) {
            this.#timeStep = 0;
            return true;
        }
        return false;
    }
    oneDebugStepIsDone() {
        if (this.#debugTimeStep >= 16) {
            this.#debugTimeStep = 0;
            return true;
        }
        return false;
    }
    update(dt) {
        this.#timeStep += dt - this.#lastTime;
        this.#debugTimeStep += dt - this.#lastTime;
        this.#lastTime = dt;
    }
}
