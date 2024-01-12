import { inputDefaults } from "../configs/defaults.ts";
import { globals } from "../configs/globals.ts";

export const DELAYSTEP = 10;

export function updateDelay(newValue: number, setInputValue: React.Dispatch<React.SetStateAction<string>>) {
  // Do whatever else you need to do when the value changes
  // For example, update the globals.delay variable:

  if (newValue < inputDefaults.MINDELAY) {
    globals.delay = inputDefaults.MINDELAY;
    setInputValue(String(globals.delay));
    console.log("globals.delay => ", globals.delay);
    return;
  }
  else if (newValue > inputDefaults.MAXDELAY) {
    globals.delay = inputDefaults.MAXDELAY;
    setInputValue(String(globals.delay));
    console.log("globals.delay => ", globals.delay);
    return;
  }
  else{
    globals.delay = newValue;
    setInputValue(String(globals.delay));
    console.log("globals.delay => ", globals.delay);
  }
}
