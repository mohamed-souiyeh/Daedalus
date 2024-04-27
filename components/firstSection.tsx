import { Tooltip } from "@nextui-org/tooltip";
import { MyAvatar } from "./avatar";
import { Button, Popover, PopoverContent, PopoverTrigger, Select, SelectItem, Selection } from "@nextui-org/react";
import { AlgorithmDescription } from "./algorithmDescription";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRoute, faTrowelBricks } from "@fortawesome/free-solid-svg-icons";
import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, createRef, use, useEffect, useRef, useState } from "react";
import { color } from "@/types";
import { mazeGenerationAlgorithms, mazeSolvingAlgorithms } from "@/src/configs/controlCenter.config";



export const FirstSection = (props: any) => {
  const mazeBuildingInspector = createRef<HTMLButtonElement>();
  const mazeSolvingInspector = createRef<HTMLButtonElement>();


  const { tooltipDelayRef } = props;
  const tooltipDelay = tooltipDelayRef.current;


  const [mazeBuildingInspectorColor, setMazeBuildingInspectorColor] = useState("primary" as typeof color);
  const [mazeSolvingInspectorColor, setMazeSolvingInspectorColor] = useState("primary" as typeof color);


  const [mazeSolvingAlgorithmValue, setmazeSolvingAlgorithmValue] = useState<Selection>(new Set([]));
  const [mazeBuildingAlgorithmValue, setmazeBuildingAlgorithmValue] = useState<Selection>(new Set([]));


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
            {mazeGenerationAlgorithms.map((algo) => (
              <SelectItem key={algo.key} value={algo.name} >
                {algo.name}
              </SelectItem>
            ))}
          </Select>
          <Tooltip content="Maze Building Algorithm" showArrow={true} color="primary" delay={tooltipDelay} closeDelay={200}>
            <div>
              <Popover placement="bottom" showArrow={true} color="default" backdrop="opaque">
                <PopoverTrigger>
                  <Button ref={mazeBuildingInspector} color={mazeBuildingInspectorColor} isIconOnly size="sm" isDisabled={false}>
                    <FontAwesomeIcon icon={faTrowelBricks} size="lg" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  {
                    //TODO - use algorithm description from config file in algorithm description component
                  }
                  <AlgorithmDescription />
                </PopoverContent>
              </Popover>
            </div>
          </Tooltip>
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
            {mazeSolvingAlgorithms.map((algo) => (
              <SelectItem key={algo.key} value={algo.name}>
                {algo.name}
              </SelectItem>
            ))}
          </Select>
          <Tooltip content="Maze Solving Algorithm" showArrow={true} color="primary" delay={tooltipDelay} closeDelay={200}>
            <div>
              <Popover placement="bottom" showArrow={true} color="default" backdrop="opaque">

                <PopoverTrigger>
                  <Button ref={mazeSolvingInspector} color={mazeSolvingInspectorColor} isIconOnly size="sm" isDisabled={false}>
                    <FontAwesomeIcon icon={faRoute} size="lg" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  {
                    //TODO - use algorithm description from config file in algorithm description component
                  }
                  <AlgorithmDescription />
                </PopoverContent>
              </Popover>
            </div>
          </Tooltip>
        </div>
      </div>
    </>
  );
};
