import { Tooltip } from "@nextui-org/tooltip";
import { MyAvatar } from "./avatar";
import { Button, Popover, PopoverContent, PopoverTrigger, Select, SelectItem, Selection } from "@nextui-org/react";
import { AlgorithmDescription } from "./algorithmDescription";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket, faRoute, faTrowelBricks } from "@fortawesome/free-solid-svg-icons";
import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, createRef, use, useEffect, useRef, useState } from "react";
import { color } from "@/types";
import { globals } from "@/src/configs/globals";
import { algoState } from "@/src/types/algos.types";
import { algosKeys, mazeGenerationAlgorithms, mazeSolvingAlgorithms } from "@/src/configs/algos.config";



export const FirstSection = (props: any) => {
  const mazeBuildingInspector = createRef<HTMLButtonElement>();
  const mazeSolvingInspector = createRef<HTMLButtonElement>();


  const { tooltipDelayRef } = props;
  const tooltipDelay = tooltipDelayRef.current;


  const [mazeBuildingInspectorColor, setMazeBuildingInspectorColor] = useState("primary" as typeof color);
  const [mazeSolvingInspectorColor, setMazeSolvingInspectorColor] = useState("primary" as typeof color);


  const [mazeSolvingAlgorithmValue, setmazeSolvingAlgorithmValue] = useState<Selection>(new Set([]));
  const [mazeBuildingAlgorithmValue, setmazeBuildingAlgorithmValue] = useState<Selection>(new Set([]));


  useEffect(() => {
    console.log("mazeBuildingAlgorithmValue => ", Array.from(mazeBuildingAlgorithmValue)[0]);
    console.log("mazeSolvingAlgorithmValue => ", Array.from(mazeSolvingAlgorithmValue)[0]);
  }, [mazeSolvingAlgorithmValue, mazeBuildingAlgorithmValue]);

  const [disableLaunch, setDisableLaunch] = useState<boolean>(globals.startAlgo);

  // NOTE: this need ot be used in it's apropriate place after patching the reset button and priseajur
  // to take into account the algorithms launching
  const handleAlgoLaunch = () => {
    globals.mazeSolvingAlgorithm = Array.from(mazeSolvingAlgorithmValue)[0] as algosKeys;
    globals.mazeBuildingAlgorithm = Array.from(mazeBuildingAlgorithmValue)[0] as algosKeys;
    globals.startAlgo = true;
    setDisableLaunch(globals.startAlgo);
    globals.setDisableLaunch = setDisableLaunch;

    console.log("mazeBuildingAlgorithmValue => ", Array.from(mazeBuildingAlgorithmValue)[0]);
    console.log("mazeSolvingAlgorithmValue => ", Array.from(mazeSolvingAlgorithmValue)[0]);
  }

  globals.handleAlgoLaunch = handleAlgoLaunch;

  return (
    <>
      <div className=" flex flex-row items-center flex-grow justify-between">
        <MyAvatar />
        <div className=" flex flex-row gap-2 items-center">
          <Select
            label="Maze Building"
            className="fixed-width-select"
            size="sm"
            radius="sm"
            variant="underlined"
            placeholder="Select an Algorithm"
            // startContent={<FontAwesomeIcon icon={faTrowelBricks} size="sm" />}
            selectorIcon={<FontAwesomeIcon icon={faTrowelBricks} size="sm" />}
            disableSelectorIconRotation
            // defaultSelectedKeys={["Random"]}
            // description="The algorithm used to build the maze"
            selectedKeys={mazeBuildingAlgorithmValue}
            onSelectionChange={setmazeBuildingAlgorithmValue}
          >
            {mazeGenerationAlgorithms.map((algo: typeof mazeGenerationAlgorithms[0]) => (
              <SelectItem key={algo.key} value={algo.name} >
                {algo.name}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Path Finding"
            className="fixed-width-select"
            size="sm"
            radius="sm"
            variant="underlined"
            placeholder="Select an Algorithm"
            // startContent={<FontAwesomeIcon icon={faMagnifyingGlassLocation} size="sm" />}
            selectorIcon={<FontAwesomeIcon icon={faRoute} size="sm" />}
            disableSelectorIconRotation
            // defaultSelectedKeys={["Random"]}
            // description="The algorithm used to solve the maze"
            selectedKeys={mazeSolvingAlgorithmValue}
            onSelectionChange={setmazeSolvingAlgorithmValue}
          >
            {mazeSolvingAlgorithms.map((algo: typeof mazeSolvingAlgorithms[0]) => (
              <SelectItem key={algo.key} value={algo.name}>
                {algo.name}
              </SelectItem>
            ))}
          </Select>
          <Tooltip content="algorithms launching" showArrow={true} color="primary" delay={tooltipDelay} closeDelay={200}>
            <Button ref={mazeSolvingInspector} color={mazeSolvingInspectorColor} isIconOnly size="sm" isDisabled={disableLaunch} onClick={handleAlgoLaunch}>
              <FontAwesomeIcon icon={faRocket} size="lg" />
            </Button>
          </Tooltip>
        </div>
      </div>
    </>
  );
};
