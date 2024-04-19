import { Tooltip } from "@nextui-org/tooltip";
import { MyAvatar } from "./avatar";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { AlgorithmDescription } from "./algorithmDescription";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRoute, faTrowelBricks } from "@fortawesome/free-solid-svg-icons";
import { Key, createRef, use, useEffect, useRef, useState } from "react";
import { color } from "@/types";



export const FirstSection = (props: any) => {
  const mazeBuildingInspector = createRef<HTMLButtonElement>();
  const mazeSolvingInspector = createRef<HTMLButtonElement>();


  const { tooltipDelayRef } = props;
  const tooltipDelay = tooltipDelayRef.current;


  const [mazeBuildingInspectorColor, setMazeBuildingInspectorColor] = useState("primary" as typeof color );
  const [mazeSolvingInspectorColor, setMazeSolvingInspectorColor] = useState("primary" as typeof color);




  return (
    <>
      <div className=" flex flex-row items-center flex-grow justify-between">
        <MyAvatar />
        <div className=" flex flex-row gap-2">
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