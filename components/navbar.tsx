import {
  Navbar as NextUINavbar,
  NavbarContent,
} from "@nextui-org/navbar";
import { Key, createRef, use, useEffect, useRef, useState } from "react";
import { title } from "./primitives";
import { Button, ButtonGroup } from "@nextui-org/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookBookmark, faBookOpen, faBug, faBugSlash, faCaretLeft, faCaretRight, faCircleInfo, faCircleQuestion, faCodeBranch, faForward, faGear, faGraduationCap, faLink, faMagnifyingGlassLocation, faMinus, faPause, faPlay, faPlus, faRepeat, faRoute, faStreetView, faTextSlash, faTrowelBricks } from "@fortawesome/free-solid-svg-icons";
import { inputDefaults } from "@/src/configs/defaults";
import { DELAYSTEP, updateDelay } from "@/src/Events/Delay.EventListeners";
import { reset } from "@/src";
import { globals } from "@/src/configs/globals";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tooltip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Select, SelectItem, Selection, Popover, PopoverTrigger, PopoverContent, DropdownSection, Checkbox, Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { FirstSection } from "./firstSection";
import { color } from "@/types";


export const Navbar = () => {

  const resetButton = createRef<HTMLButtonElement>();
  const pauseButton = createRef<HTMLButtonElement>();
  const skipButton = createRef<HTMLButtonElement>();
  const debugButton = createRef<HTMLButtonElement>();
  const debugBooklet = createRef<HTMLButtonElement>();
  const settings = createRef<HTMLButtonElement>();
  const increment = createRef<HTMLButtonElement>();
  const decrement = createRef<HTMLButtonElement>();
  const numberInput = createRef<HTMLInputElement>();

  const depthFilterButton = createRef<HTMLButtonElement>();


  const [inputValue, setInputValue] = useState(inputDefaults.DELAY as unknown as string);
  const inputValueRef = useRef(inputValue);

  useEffect(() => {
    inputValueRef.current = inputValue;
  }, [inputValue]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.value => ", e.target.value);
    const newValue = e.target.value;
    if (!/^\d*$/.test(newValue) || newValue === "") {
      updateDelay(inputDefaults.DELAY, setInputValue);
    } else {
      updateDelay(parseInt(newValue), setInputValue);
    }
  }

  const incrementDelay = () => {
    const value: number = parseInt(inputValueRef.current) + DELAYSTEP > inputDefaults.MAXDELAY ? inputDefaults.MAXDELAY : parseInt(inputValueRef.current) + DELAYSTEP;

    updateDelay(value, setInputValue);
  }

  const decrementDelay = () => {
    const value: number = parseInt(inputValueRef.current) - DELAYSTEP < inputDefaults.MINDELAY ? inputDefaults.MINDELAY : parseInt(inputValueRef.current) - DELAYSTEP;

    updateDelay(value, setInputValue);
  }

  const [pauseButtonIcon, setPauseButtonIcon] = useState(inputDefaults.ISPAUSED ? faPlay : faPause);

  const handlePauseButton = () => {
    globals.isPaused = !globals.isPaused;
    setPauseButtonIcon(globals.isPaused ? faPlay : faPause);
  };

  const [debugButtonIcon, setDebugButtonIcon] = useState(inputDefaults.DEBUGMODEON ? faBug : faBugSlash);
  const [debugButtonColor, setDebugButtonColor] = useState((inputDefaults.DEBUGMODEON ? "primary" : "default") as "primary" | "default" | "secondary" | "success" | "warning" | "danger" | undefined);

  const handleDebugButton = () => {
    globals.debugModeOn = !globals.debugModeOn;
    setDebugButtonIcon(globals.debugModeOn ? faBug : faBugSlash);
    setDebugButtonColor(globals.debugModeOn ? "primary" : "default");
    if (globals.debugModeOn !== globals.debugBookletIsOn) {
      handleDebugBooklet();
      console.log("debugBooklet is toggled");
    }
  };

  const [debugBookletColor, setDebugBookletColor] = useState(inputDefaults.DEBUGBOOKLETISON ? "primary" as typeof color : "default" as typeof color);

  const handleDebugBooklet = () => {
    globals.debugBookletIsOn = !globals.debugBookletIsOn;
    setDebugBookletColor(globals.debugBookletIsOn ? "primary" : "default");
  };

  const handleSettingsMenue = () => {

  }

  const handleResetButton = () => {
    reset();
    if (globals.setDisableLaunch)
      globals.setDisableLaunch(false);
    globals.depthFilterOn = false;
    setDisableDepthFilter(true)
    // setDepthFilterColor(globals.depthFilterOn ? "primary" : "default");
  };


  const handleSkipButton = () => {
    console.log("skipping");
    if (globals.startAlgo || globals.animatePath)
      globals.skipAlgoAnimaiton = true;
  }

  const [depthFilterColor, setDepthFilterColor] = useState("primary");
  const [disableDepthFilter, setDisableDepthFilter] = useState(!globals.depthFilterOn);

  const addDepthFilter = () => {
    if (globals.startAlgo) {
      globals.depthFilterOn = false;
      setDisableDepthFilter(true)
      // setDepthFilterColor(globals.depthFilterOn ? "primary" : "default");
      globals.gridRedraw = true;
      return;
    }
    globals.depthFilterOn = !globals.depthFilterOn;
    // setDepthFilterColor(globals.depthFilterOn ? "primary" : "default");
    console.log("addDepthFilter: ", globals.depthFilterOn);
    globals.colorComposition.r = Math.random() - 0.5 > 0;
    globals.colorComposition.g = Math.random() - 0.5 > 0;
    globals.colorComposition.b = Math.random() - 0.5 > 0;
    globals.gridRedraw = true;
  };

  useEffect(() => {

    const windowShortcutes = (event: any) => {

      // console.log("event => ", event);
      if (event.code === 'KeyF') {
        addDepthFilter();
      }
      if (event.code === 'KeyS') {
        handleSkipButton();
      }
      if (event.code === 'KeyL') {
        console.log("event => ", event);
        globals.handleAlgoLaunch();
      }
      if (event.code === 'KeyR' && !event.ctrlKey) {
        handleResetButton();
      }
      if (event.code === 'KeyP') {
        console.log("pauseButton.current => ");
        handlePauseButton();
      }
      if (event.code === 'KeyD') {
        handleDebugButton();
      }
      if (event.code === 'KeyB' && globals.debugModeOn) {
        handleDebugBooklet();
      }
      if (event.key === '-') {
        decrementDelay();
      }
      if (event.code === '+' || event.key === '=') {
        incrementDelay();
      }
    }

    window.addEventListener('keydown', windowShortcutes);

    return () => {
      window.removeEventListener('keydown', windowShortcutes);
    }
  }, []);



  const [tooltipDelay, setTooltipDelay] = useState(inputDefaults.DEFAULTTOOLTIPSTATE);
  const tooltipDelayRef = useRef(tooltipDelay);

  useEffect(() => {
    tooltipDelayRef.current = tooltipDelay;
  }, [tooltipDelay]);


  const [depthNumbers, setDepthNumbers] = useState(globals.depthNumbers);

  const addDepthNumbers = (state: boolean) => {
    // console.log(state);
    // console.log("type of state: ", typeof state);
    globals.depthNumbers = state;
    setDepthNumbers(globals.depthNumbers);
    if (globals.depthFilterOn)
      globals.gridRedraw = true;
  }


  const handleProjectMenu = (e: Key) => {
    console.log("e => ", e);
    if (e === "Tooltips") {
      setTooltipDelay(tooltipDelayRef.current === inputDefaults.TOOLTIPDELAY ? inputDefaults.DISABLETOOLTIP : inputDefaults.TOOLTIPDELAY);
    }
  };


  globals.handleResetButton = handleResetButton;
  globals.setDisableDepthFilter = setDisableDepthFilter;

  // NOTE: tutorial

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [tutorialPages, setTutorialPages] = useState<number>(0);
  const tutorialPagesRef = useRef(tutorialPages);

  useEffect(() => {
    tutorialPagesRef.current = tutorialPages;
  }, [tutorialPages]);

  const nextPage = () => {
    setTutorialPages(tutorialPagesRef.current++);
    console.log("current page: ", tutorialPagesRef.current);
  };
  const prevPage = () => {
    setTutorialPages(tutorialPagesRef.current--);
    console.log("current page: ", tutorialPagesRef.current);
  };

  useEffect(() => {
    onOpenChange();
  }, []);

  return (
    <NextUINavbar maxWidth="full" position="sticky" isBordered id="nav">
      <NavbarContent id="firstSection" as="div" justify="start">
        <FirstSection tooltipDelayRef={tooltipDelayRef} />
      </NavbarContent>

      <NavbarContent id="secondSection" as="div" justify="center">
        <Tooltip content="project menu" showArrow={true} color="primary" delay={tooltipDelay} closeDelay={200} placement="bottom">
          <div>
            <Dropdown>
              <DropdownTrigger>
                <Button color="primary" variant="light" size="lg">
                  <h1 className={`${title({ color: "blue", size: "md", fullWidth: true })} bold-font`}>
                    Daedalus
                  </h1>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Static Actions"
                color="primary"
                variant="light"
                onAction={handleProjectMenu}
              >
                <DropdownItem
                  key="Tuto"
                  description="Take a Tour"
                  endContent={<FontAwesomeIcon icon={faGraduationCap} size="lg" />}
                  onPress={onOpen}
                >
                  Tutorial</DropdownItem>
                <DropdownItem
                  key="Project Repo"
                  description="Check the Repo"
                  endContent={<FontAwesomeIcon icon={faCodeBranch} size="lg" />}
                  href="https://github.com/mohamed-souiyeh/Daedalus"
                  target="_blank"
                >
                  Project Repo
                </DropdownItem>
                <DropdownItem
                  key="Tooltips"
                  description="Those descriptive popups"
                  endContent={<FontAwesomeIcon icon={faTextSlash} size="lg" />}
                >
                  Toggel Tooltips</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              placement="bottom-center"
              isDismissable={false}
              size="4xl"
              radius="md"
              motionProps={{
                variants: {
                  enter: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      duration: 0.4,
                      ease: "easeOut",
                    },
                  },
                  exit: {
                    y: -20,
                    opacity: 0,
                    transition: {
                      duration: 0.3,
                      ease: "easeIn",
                    },
                  },
                }
              }}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-row justify-center items-end gap-1">
                      <h1 className={`${title({ color: "blue", size: "md", fullWidth: false })} bold-font`}>
                        Daedalus
                      </h1>
                      <h3 >
                        Tutorial
                      </h3>
                    </ModalHeader>
                    <ModalBody className="flex flex-col items-center gap-1">
                      <Tabs
                        size="sm"
                        color="primary"
                        variant="underlined"
                        fullWidth={true}
                      >
                        <Tab key="photos" title="Photos">
                          <Card>
                            <CardBody>
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </CardBody>
                          </Card>
                        </Tab>
                        <Tab key="music" title="Music">
                          <Card>
                            <CardBody>
                              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            </CardBody>
                          </Card>
                        </Tab>
                        <Tab key="videos" title="Videos">
                          <Card>
                            <CardBody>
                              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </CardBody>
                          </Card>
                        </Tab>
                      </Tabs>
                    </ModalBody>
                    <ModalFooter className="flex flex-row justify-between gap-2">
                      <div>
                        <Button color="danger" variant="light" onPress={onClose}>
                          Close
                        </Button>
                      </div>
                      <div className="flex flex-row gap-1" >
                        <Button
                          color="primary"
                          startContent={<FontAwesomeIcon icon={faCaretLeft} size="lg" />}
                          onPress={prevPage}
                        >
                          Prev
                        </Button>
                        <Button
                          color="primary"
                          endContent={<FontAwesomeIcon icon={faCaretRight} size="lg" />}
                          onPress={nextPage}
                        >
                          Next
                        </Button>
                      </div>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </Tooltip>
      </NavbarContent>

      <NavbarContent id="thirdSection" as="div" justify="end" className="gap-2">
        <Dropdown backdrop="opaque">
          <Tooltip content="Settings" showArrow={true} color="primary" delay={tooltipDelay} closeDelay={200}>
            <DropdownTrigger>
              <Button color="primary" isIconOnly size="sm" >
                <FontAwesomeIcon icon={faGear} size="lg" />
              </Button>
            </DropdownTrigger>
          </Tooltip>
          <DropdownMenu variant="light">
            <DropdownItem
              isReadOnly
              textValue="toggle numbers for exact distances"
              aria-label="Depth numbers"
              key="DepthNumbers"
              description="toggle numbers for exact distances"
              endContent={<FontAwesomeIcon icon={faStreetView} size="lg" />}>
              <Checkbox aria-label="depth value" isSelected={depthNumbers} onValueChange={addDepthNumbers} size="sm">Depth Value</Checkbox>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Tooltip id="reset" content="Reset" showArrow={true} color="primary" delay={tooltipDelay} closeDelay={200}>
          <Button ref={resetButton} color="primary" isIconOnly size="sm" onClick={handleResetButton}>
            <FontAwesomeIcon icon={faRepeat} size="lg" />
          </Button>
        </Tooltip>
        <Tooltip content="skip" showArrow={true} color="primary" delay={tooltipDelay} closeDelay={200}>
          <Button ref={skipButton} color="primary" isIconOnly size="sm" onClick={handleSkipButton}>
            <FontAwesomeIcon icon={faForward} size="lg" />
          </Button>
        </Tooltip>
        <Tooltip content="Play-Pause" showArrow={true} color="primary" delay={tooltipDelay} closeDelay={200}>
          <Button ref={pauseButton} color="primary" isIconOnly size="sm" onClick={handlePauseButton}>
            <FontAwesomeIcon icon={pauseButtonIcon} size="lg" />
          </Button>
        </Tooltip>
        {
          // <ButtonGroup >
          //   <Tooltip content="Debug Booklet Toggel" showArrow={true} color="primary" delay={tooltipDelay} closeDelay={200}>
          //     <Button ref={debugBooklet} color={debugBookletColor} isIconOnly size="sm" onClick={handleDebugBooklet}>
          //       <FontAwesomeIcon icon={faBookOpen} size="lg" />
          //     </Button>
          //   </Tooltip>
          //
          //   <Tooltip content="Debuger Toggel" showArrow={true} color="primary" delay={tooltipDelay} closeDelay={200}>
          //     <Button ref={debugButton} color={debugButtonColor} isIconOnly size="sm" onClick={handleDebugButton}>
          //       <FontAwesomeIcon icon={debugButtonIcon} size="lg" />
          //     </Button>
          //   </Tooltip>
          //
          // </ButtonGroup>
        }

        {
          <Tooltip content="Depth Filter" showArrow={true} color="primary" delay={tooltipDelay} closeDelay={200}>
            <Button ref={depthFilterButton} color="primary" isIconOnly size="sm" onClick={addDepthFilter} isDisabled={disableDepthFilter}>
              <FontAwesomeIcon icon={faStreetView} size="lg" />
            </Button>
          </Tooltip>
        }

        <ButtonGroup id="delay">
          <Tooltip content="Decrement Delay" showArrow={true} color="primary" delay={tooltipDelay} closeDelay={200}>
            <Button ref={decrement} color="primary" isIconOnly size="sm" onClick={decrementDelay}>
              <FontAwesomeIcon icon={faMinus} size="lg" />
            </Button>
          </Tooltip>
          <Tooltip content="Delay in milliseconds" showArrow={true} color="primary" delay={tooltipDelay} closeDelay={200}>
            <input
              type="text"
              ref={numberInput}
              className=" h-8 text-center"
              size={1}
              value={inputValue}
              onBlur={onInputChange}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setInputValue(e.target.value)
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  numberInput.current?.blur();
                }
              }}
            />
          </Tooltip>
          <Tooltip content="Increment Delay" showArrow={true} color="primary" delay={tooltipDelay} closeDelay={200}>
            <Button ref={increment} color="primary" isIconOnly size="sm" onClick={incrementDelay}>
              <FontAwesomeIcon icon={faPlus} size="lg" />
            </Button>
          </Tooltip>
        </ButtonGroup>

      </NavbarContent>
    </NextUINavbar >
  );
};

