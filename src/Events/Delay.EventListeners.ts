import { inputDefaults } from "../configs/defaults.ts";
import { globals } from "./input.ts";

export const DELAYSTEP = 10;

export function updateDelay(newValue: number, setInputValue: React.Dispatch<React.SetStateAction<string>>) {
  // Do whatever else you need to do when the value changes
  // For example, update the globals.delay variable:
  globals.delay = newValue;
  console.log("globals.delay => ", globals.delay);
  if (globals.delay < 1) {
    globals.delay = inputDefaults.DELAY;
    setInputValue(String(globals.delay));
    return;
  }
  else if (globals.delay > inputDefaults.MAXDELAY) {
    globals.delay = inputDefaults.MAXDELAY;
    setInputValue(String(globals.delay));
    return;
  }
  else
    setInputValue(String(globals.delay));
}
