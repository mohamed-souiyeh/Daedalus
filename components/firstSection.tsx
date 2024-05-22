import { Tooltip } from "@nextui-org/tooltip";
import { MyAvatar } from "./avatar";
import { Button, Popover, PopoverContent, PopoverTrigger, Select, SelectItem, SelectSection, Selection } from "@nextui-org/react";
import { AlgorithmDescription } from "./algorithmDescription";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faInfoCircle, faRocket, faRoute, faSpinner, faTrowelBricks } from "@fortawesome/free-solid-svg-icons";
import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, createRef, use, useEffect, useRef, useState } from "react";
import { color } from "@/types";
import { globals } from "@/src/configs/globals";
import { algoState } from "@/src/types/algos.types";
import { algosKeys, mazeGenerationAlgorithms, mazeSolvingAlgorithms } from "@/src/configs/algos.config";



export const FirstSection = (props: any) => {
  const mazeLaunching = createRef<HTMLButtonElement>();
  const mazeBuildingInspector = createRef<HTMLButtonElement>();


  const { tooltipDelayRef } = props;
  const tooltipDelay = tooltipDelayRef.current;




  const [algorithmValue, setAlgorithmValue] = useState<Selection>(new Set([]));


  useEffect(() => {
    console.log("mazeBuildingAlgorithmValue => ", Array.from(algorithmValue)[0]);
  }, [algorithmValue]);

  const [disableLaunch, setDisableLaunch] = useState<boolean>(globals.startAlgo);
  const [launchIcon, setLaunchIcon] = useState<any>(faRocket);
  const [launchAnimation, setLaunchAnimation] = useState<boolean>(launchIcon === faRocket ? false : true);

  const braidingChance: { [key in algosKeys]: number } = {
    [algosKeys.RandomWalkDFS]: 1.0,
    [algosKeys.recursiveDivider]: 0.7,
    [algosKeys.Kruskal]: 0.35,
    [algosKeys.BFS]: 1.0,
    [algosKeys.Dijkstra]: 1.0,
    [algosKeys.Astar]: 1.0,
  };

  // NOTE: this need ot be used in it's apropriate place after patching the reset button and priseajur
  // to take into account the algorithms launching
  const handleAlgoLaunch = () => {
    if (globals.startAlgo === true) return;
    if (mazeSolvingAlgorithms.find((item) => item.key === Array.from(algorithmValue)[0] as algosKeys)) {
      globals.mazeSolvingAlgorithm = Array.from(algorithmValue)[0] as algosKeys;
      globals.mazeBuildingAlgorithm = null;
      globals.hotReload = false;
    }
    else if (mazeGenerationAlgorithms.find((item) => item.key === Array.from(algorithmValue)[0] as algosKeys)) {
      globals.mazeBuildingAlgorithm = Array.from(algorithmValue)[0] as algosKeys;
      globals.mazeSolvingAlgorithm = null;
      globals.hotReload = false;
      globals.braid = globals.activateBraiding;

      globals.braidingChance = braidingChance[globals.mazeBuildingAlgorithm];
    }

    if (!globals.mazeSolvingAlgorithm && !globals.mazeBuildingAlgorithm)
      return;

    globals.startAlgo = true;
    globals.animatePath = false;
    setLaunchIcon(faSpinner);
    setLaunchAnimation(true);

    // setDisableLaunch(true);

    globals.depthFilterOn = false;
    globals.setDisableDepthFilter(true)
    console.log("algorithmValue => ", Array.from(algorithmValue)[0]);
  }

  // globals.setDisableLaunch = setDisableLaunch;
  globals.setDisableLaunch = (state: boolean) => {
    if (state === false) {
      setLaunchAnimation(false);
      setLaunchIcon(faRocket);
    }
  };
  globals.handleAlgoLaunch = handleAlgoLaunch;

  return (
    <>
      <div className=" flex flex-row items-center flex-grow justify-between">
        <MyAvatar />
        <div className=" flex flex-row gap-2 items-center">
          <Tooltip content="algorithms discription" showArrow={true} color={"primary"} delay={tooltipDelay} closeDelay={200}>
            <div>
              <Popover placement="bottom" showArrow={true} color="default" backdrop="opaque">
                <PopoverTrigger>
                  <Button id="maze-description" ref={mazeBuildingInspector} color="primary" isIconOnly size="sm" isDisabled={false}>
                    <FontAwesomeIcon icon={faInfoCircle} size="xl" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <AlgorithmDescription algo={algorithmValue} />
                </PopoverContent>
              </Popover>
            </div>
          </Tooltip>
          <Select
            id="algo-selector"
            label="algorithms"
            className="fixed-width-select"
            size="sm"
            radius="sm"
            variant="underlined"
            placeholder="Select an Algorithm"
            // startContent={<FontAwesomeIcon icon={faTrowelBricks} size="sm" />}
            // selectorIcon={<FontAwesomeIcon icon={faTrowelBricks} size="sm" />}
            disableSelectorIconRotation
            selectedKeys={algorithmValue}
            onSelectionChange={setAlgorithmValue}
          >
            <SelectSection title={"maze generation"}>
              {mazeGenerationAlgorithms.map((algo: typeof mazeGenerationAlgorithms[0]) => (
                <SelectItem key={algo.key} value={algo.name} >
                  {algo.name}
                </SelectItem>
              ))}
            </SelectSection>
            <SelectSection title={"path finding"}>
              {mazeSolvingAlgorithms.map((algo: typeof mazeSolvingAlgorithms[0]) => (
                <SelectItem key={algo.key} value={algo.name}>
                  {algo.name}
                </SelectItem>
              ))}
            </SelectSection>
          </Select>
          <Tooltip content="algorithms launching" showArrow={true} color={"primary"} delay={tooltipDelay} closeDelay={200}>
            <Button id="algo-launch" ref={mazeLaunching} isIconOnly size="sm" color="primary" isDisabled={disableLaunch} onClick={handleAlgoLaunch}>
              <FontAwesomeIcon icon={launchIcon} spinPulse={launchAnimation} size="lg" />
            </Button>
          </Tooltip>
        </div>
      </div >
    </>
  );
};
