'use client';

import {
  Navbar as NextUINavbar,
  NavbarContent,
} from "@nextui-org/navbar";
import { Key, createRef, use, useEffect, useRef, useState } from "react";
import { subtitle, title } from "./primitives";
import { Button, ButtonGroup } from "@nextui-org/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faBookBookmark, faBookOpen, faBridgeCircleCheck, faBug, faBugSlash, faCaretLeft, faCaretRight, faCircleInfo, faCircleQuestion, faCodeBranch, faForward, faGear, faGraduationCap, faInfoCircle, faLink, faMagnifyingGlassLocation, faMinus, faPause, faPlay, faPlus, faRepeat, faRocket, faRoute, faStreetView, faTextSlash, faTrowelBricks, faWeightHanging } from "@fortawesome/free-solid-svg-icons";
import { inputDefaults } from "@/src/configs/defaults";
import { DELAYSTEP, updateDelay } from "@/src/Events/Delay.EventListeners";
import { reset } from "@/src";
import { globals } from "@/src/configs/globals";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tooltip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Select, SelectItem, Selection, Popover, PopoverTrigger, PopoverContent, DropdownSection, Checkbox, Tabs, Tab, Card, CardBody, SelectSection, Avatar, Slider } from "@nextui-org/react";
import { FirstSection } from "./firstSection";
import { mazeGenerationAlgorithms, mazeSolvingAlgorithms } from "@/src/configs/algos.config";
import { AlgorithmDescription } from "./algorithmDescription";
import { MyAvatar } from "./avatar";
import Cookies from 'js-cookie'

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

  // const [debugButtonIcon, setDebugButtonIcon] = useState(inputDefaults.DEBUGMODEON ? faBug : faBugSlash);
  // const [debugButtonColor, setDebugButtonColor] = useState((inputDefaults.DEBUGMODEON ? "primary" : "default") as "primary" | "default" | "secondary" | "success" | "warning" | "danger" | undefined);
  //
  // const handleDebugButton = () => {
  //   globals.debugModeOn = !globals.debugModeOn;
  //   setDebugButtonIcon(globals.debugModeOn ? faBug : faBugSlash);
  //   setDebugButtonColor(globals.debugModeOn ? "primary" : "default");
  //   if (globals.debugModeOn !== globals.debugBookletIsOn) {
  //     handleDebugBooklet();
  //     console.log("debugBooklet is toggled");
  //   }
  // };
  //
  // const [debugBookletColor, setDebugBookletColor] = useState(inputDefaults.DEBUGBOOKLETISON ? "primary" as typeof color : "default" as typeof color);
  //
  // const handleDebugBooklet = () => {
  //   globals.debugBookletIsOn = !globals.debugBookletIsOn;
  //   setDebugBookletColor(globals.debugBookletIsOn ? "primary" : "default");
  // };
  //
  // const handleSettingsMenue = () => {
  //
  // }

  const handleResetButton = () => {
    reset();
    if (globals.isPaused)
      handlePauseButton();
    if (globals.setDisableLaunch)
      globals.setDisableLaunch(false);
    globals.depthFilterOn = false;
    globals.addWeights = false;
    globals.hotReload = false;
    setAnimateWeights(false);
    setDisableDepthFilter(true)
    // setDepthFilterColor(globals.depthFilterOn ? "primary" : "default");
  };

  const [animateSkipButton, setAnimateSkipButton] = useState(globals.skipAlgoAnimation);

  const handleSkipButton = () => {
    globals.skipAlgoAnimation = !globals.skipAlgoAnimation;
    setAnimateSkipButton(globals.skipAlgoAnimation);
  }

  const [depthFilterColor, setDepthFilterColor] = useState("primary");
  const [disableDepthFilter, setDisableDepthFilter] = useState(globals.depthFilterOn);

  const addDepthFilter = () => {
    if (globals.startAlgo) {
      globals.depthFilterOn = false;
      setDisableDepthFilter(true)
      // setDepthFilterColor(globals.depthFilterOn ? "primary" : "default");
      globals.gridRedraw = true;
      return;
    }
    if (globals.reset)
      return;
    globals.depthFilterOn = !globals.depthFilterOn;
    // setDepthFilterColor(globals.depthFilterOn ? "primary" : "default");
    console.log("addDepthFilter: ", globals.depthFilterOn);
    globals.colorComposition.r = Math.random() - 0.5 > 0;
    globals.colorComposition.g = Math.random() - 0.5 > 0;
    globals.colorComposition.b = Math.random() - 0.5 > 0;
    globals.gridRedraw = true;
  };


  const [animateWeights, setAnimateWeights] = useState(globals.addWeights);

  const addWeights = () => {
    if (globals.startAlgo) {
      globals.addWeights = false;
      setAnimateWeights(false);
      // setDepthFilterColor(globals.depthFilterOn ? "primary" : "default");
      return;
    }
    globals.addWeights = !globals.addWeights;
    setAnimateWeights(globals.addWeights);
    if (globals.addWeights) {
      globals.addWalls = false;
      setAnimateWallMod(globals.addWalls);
    }
    // setDepthFilterColor(globals.depthFilterOn ? "primary" : "default");
  };

  const [animateWallMod, setAnimateWallMod] = useState(globals.addWalls);

  const addWalls = () => {
    if (globals.startAlgo) {
      globals.addWalls = false;
      setAnimateWallMod(false);
      // setDepthFilterColor(globals.depthFilterOn ? "primary" : "default");
      return;
    }
    globals.addWalls = !globals.addWalls;
    setAnimateWallMod(globals.addWalls);
    if (globals.addWalls) {
      globals.addWeights = false;
      setAnimateWeights(globals.addWeights);
    }
    console.log("addWalls: ", globals.addWalls);
    // setDepthFilterColor(globals.depthFilterOn ? "primary" : "default");
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
        // handleDebugButton();
      }
      if (event.code === 'KeyB' && globals.debugModeOn) {
        // handleDebugBooklet();
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
  };

  const [searchDistance, setSearchDistance] = useState(globals.searchDistance);

  const addSearchDistance = (state: boolean) => {
    // console.log(state);
    // console.log("type of state: ", typeof state);
    globals.searchDistance = state;
    setSearchDistance(globals.searchDistance);
    globals.gridRedraw = true;
  };


  const [braid, setBraid] = useState(globals.activateBraiding);

  const toggelBraiding = (state: boolean) => {
    if (globals.startAlgo || globals.animatePath || globals.braid) return;
    globals.activateBraiding = !globals.activateBraiding;
    setBraid(globals.activateBraiding);
    if (globals.braid === false)
      globals.braid = true;
  };






  // NOTE:to be used in the next implementation of weighted nodes
  //
  // const [weightedNodes, setWeightedNodes] = useState(globals.addWeightedNodes);
  //
  // const addWhieghtedNodes = (state: boolean) => {
  //   if (state === true) {
  //     globals.removeWeightedNodes = !state;
  //     globals.addWeightedNodes = state;
  //   }
  //   else if (state === false) {
  //     globals.removeWeightedNodes = !state;
  //     globals.addWeightedNodes = state;
  //   }
  //   setWeightedNodes(state);
  // }

  const handleProjectMenu = (e: Key) => {
    console.log("e => ", e);
    if (e === "Tooltips") {
      setTooltipDelay(tooltipDelayRef.current === inputDefaults.TOOLTIPDELAY ? inputDefaults.DISABLETOOLTIP : inputDefaults.TOOLTIPDELAY);
    }
  };


  globals.handleResetButton = handleResetButton;
  globals.setDisableDepthFilter = setDisableDepthFilter;
  globals.stopAddingWeightedAnimation = (state: boolean) => {
    setAnimateWeights(!state);
  }
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
    if (Cookies.get("TutorialDone") === undefined)
      onOpenChange();
  }, []);


  const [algorithmValue, setAlgorithmValue] = useState<Selection>(new Set([]));



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
              hideCloseButton={true}
              isKeyboardDismissDisabled={true}
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
                    <ModalHeader className="flex flex-row justify-center items-end gap-1 py-2">
                      <h1 className={`${title({ color: "blue", size: "md", fullWidth: false })} bold-font`}>
                        Daedalus
                      </h1>
                      <h3 >
                        Tutorial (deprecated and needs an update)
                      </h3>
                    </ModalHeader>
                    <ModalBody className="flex flex-col items-center gap-1">
                      <p className={subtitle()}>
                        This project is my humble attempt to display how beautiful and elegant algorithms can be.<br />
                        It creates, solves and colours mazes in interesting and beautiful ways.
                      </p>
                      <Tabs
                        size="md"
                        color="primary"
                        variant="underlined"
                        fullWidth={true}
                      >
                        <Tab
                          key="overview"
                          title={
                            <div className="flex items-center space-x-2">
                              <FontAwesomeIcon icon={faGraduationCap} size="sm" />
                              <span>Overview</span>
                            </div>
                          }
                        >
                          <Card >
                            <CardBody className="flex flex-col content-between">
                              <Tooltip content="project menu" showArrow={true} color="primary" delay={100} closeDelay={200} placement="bottom">
                                <div className="flex flex-col content-between w-auto">
                                  <Dropdown>
                                    <DropdownTrigger>
                                      <Button color="primary" variant="light" size="lg">
                                        <h1 className={`${title({ color: "blue", size: "md", fullWidth: false })} bold-font`}>
                                          Daedalus
                                        </h1>
                                      </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                      aria-label="Static Actions"
                                      color="primary"
                                      variant="light"
                                    >
                                      <DropdownItem
                                        key="Tuto"
                                        description="Take a Tour"
                                        endContent={<FontAwesomeIcon icon={faGraduationCap} size="lg" />}
                                      >
                                        Tutorial</DropdownItem>
                                      <DropdownItem
                                        key="Project Repo"
                                        description="Check the Repo"
                                        endContent={<FontAwesomeIcon icon={faCodeBranch} size="lg" />}
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
                                </div>
                              </Tooltip >
                              <div className="flex flex-col justify-between text-center">
                                <p>
                                  <br />
                                  <br />
                                  This is the project Logo and Project menu.<br />
                                  <br />
                                  If you click on it, multiple options with a small explanation will appear.<br />
                                  <br />
                                  This tutorial will show you arround and it wont bother you again unless u request it from the project menu.
                                </p>
                              </div>
                            </CardBody>
                          </Card>
                        </Tab>
                        <Tab
                          key="algo-slection"
                          title={
                            <div className="flex items-center space-x-2">
                              <FontAwesomeIcon icon={faRocket} size="sm" />
                              <span>algorithm launching</span>
                            </div>
                          }
                        >
                          <Card>
                            <CardBody className="flex flex-col content-between">
                              <div className=" flex flex-row gap-2 items-center justify-center">
                                <Tooltip content="algorithms discription" showArrow={true} color={"primary"} delay={100} closeDelay={200}>
                                  <div>
                                    <Popover placement="bottom" showArrow={true} color="default" backdrop="opaque">
                                      <PopoverTrigger>
                                        <Button id="maze-description" color="primary" isIconOnly size="sm" isDisabled={false}>
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
                                <Tooltip content="algorithms launching" showArrow={true} color={"primary"} delay={100} closeDelay={200}>
                                  <Button id="algo-launch" isIconOnly size="sm" color="primary">
                                    <FontAwesomeIcon icon={faRocket} size="lg" />
                                  </Button>
                                </Tooltip>
                              </div>
                              <div className="flex flex-col justify-between text-center">
                                <br />
                                <br />
                                <p>
                                  This is the Algorithm dropdown menu.<br />
                                  <br />
                                  In the dropdown menu you can choose between maze generation and path-finding algorithms.<br />
                                  <br />
                                  The Info button shows a small explanation about the chosen algorithm.<br />
                                  <br />
                                  The Rocket (u guessed it) launches the chosen algorithm.
                                </p>
                              </div>
                            </CardBody>
                          </Card>
                        </Tab>
                        <Tab
                          key="Depth Filter"
                          title={
                            <div className="flex items-center space-x-2">
                              <FontAwesomeIcon icon={faStreetView} size="sm" />
                              <span>Depth Filter</span>
                            </div>
                          }
                        >
                          <Card>
                            <CardBody className="flex flex-col content-between">
                              <div className=" flex flex-row-reverse gap-2 items-center justify-center">
                                <Tooltip content="Depth Filter" showArrow={true} color="primary" delay={100} closeDelay={200}>
                                  <Button color="primary" isIconOnly size="sm" >
                                    <FontAwesomeIcon icon={faStreetView} size="lg" />
                                  </Button>
                                </Tooltip>
                              </div>
                              <div className="flex flex-col justify-between text-center">
                                <br />
                                <br />
                                <p>
                                  The depth filter is like an X-Ray for mazes, it gives you a much clearer view of the structure of the maze
                                  and the algorithm that generated it .<br />
                                  <br />
                                  The color gets darker the farther away you are from the starting point (the little icon).<br />
                                  <br />
                                </p>
                              </div>
                            </CardBody>
                          </Card>
                        </Tab>
                        <Tab
                          key="controls"
                          title={
                            <div className="flex items-center space-x-2">
                              <FontAwesomeIcon icon={faPlay} size="sm" />
                              <span>controls</span>
                            </div>
                          }
                        >
                          <Card>
                            <CardBody className="flex flex-col content-between">
                              <div className=" flex flex-row-reverse gap-2 items-center justify-center">
                                <Tooltip id="reset" content="Reset" showArrow={true} color="primary" delay={100} closeDelay={200}>
                                  <Button color="primary" isIconOnly size="sm" >
                                    <FontAwesomeIcon icon={faRepeat} size="lg" />
                                  </Button>
                                </Tooltip>
                                <Tooltip content="fast-forward" showArrow={true} color="primary" delay={100} closeDelay={200}>
                                  <Button color="primary" isIconOnly size="sm" >
                                    <FontAwesomeIcon icon={faForward} size="lg" />
                                  </Button>
                                </Tooltip>
                                <Tooltip content="Play-Pause" showArrow={true} color="primary" delay={100} closeDelay={200}>
                                  <Button color="primary" isIconOnly size="sm" >
                                    <FontAwesomeIcon icon={pauseButtonIcon} size="lg" />
                                  </Button>
                                </Tooltip>
                                <ButtonGroup id="delay">
                                  <Tooltip content="Decrement Delay" showArrow={true} color="primary" delay={100} closeDelay={200}>
                                    <Button color="primary" isIconOnly size="sm" >
                                      <FontAwesomeIcon icon={faMinus} size="lg" />
                                    </Button>
                                  </Tooltip>
                                  <Tooltip content="Delay in milliseconds" showArrow={true} color="primary" delay={100} closeDelay={200}>
                                    <input
                                      type="text"
                                      className=" h-8 text-center"
                                      size={1}
                                      defaultValue={8}
                                    />
                                  </Tooltip>
                                  <Tooltip content="Increment Delay" showArrow={true} color="primary" delay={100} closeDelay={200}>
                                    <Button color="primary" isIconOnly size="sm" >
                                      <FontAwesomeIcon icon={faPlus} size="lg" />
                                    </Button>
                                  </Tooltip>
                                </ButtonGroup>
                              </div>
                              <div className="flex flex-col justify-between text-center">
                                <br />
                                <br />
                                <p>
                                  This is the control section.<br />
                                  <br />
                                  Here you can play, pause and fast-forward the algorithms.<br />
                                  <br />
                                  The delay input lets you lengthen the delay between frames algorithms.<br />
                                  <br />
                                  The reset button resets the state of the grid.<br />
                                </p>
                              </div>
                            </CardBody>
                          </Card>
                        </Tab>
                        <Tab
                          key="about me"
                          title={
                            <div className="flex items-center space-x-2">
                              <FontAwesomeIcon icon={faAddressCard} size="sm" />
                              <span>About me</span>
                            </div>
                          }
                        >
                          <Card>
                            <CardBody className="flex flex-col content-between">
                              <div className=" flex flex-row-reverse gap-2 items-center justify-center">
                                <MyAvatar />
                              </div>
                              <div className="flex flex-col justify-between text-center">
                                <br />
                                <br />
                                <p>
                                  My portfolio, GitHub, and LinkedIn are this avatar dropDown menu.
                                  Feel free to reach out with any questions or suggestions!<br />
                                  <br />
                                </p>
                              </div>
                            </CardBody>
                          </Card>
                        </Tab>
                      </Tabs>
                    </ModalBody>
                    {
                      <ModalFooter className="flex flex-row justify-between gap-2">
                        <div>
                          <Button
                            color="danger"
                            variant="light"
                            onPress={() => {
                              Cookies.set("TutorialDone", "");
                              onClose();
                            }}>
                            Skip
                          </Button>
                        </div>
                      </ModalFooter>
                      //   <div className="flex flex-row gap-1" >
                      //     <Button
                      //       color="primary"
                      //       startContent={<FontAwesomeIcon icon={faCaretLeft} size="lg" />}
                      //       onPress={prevPage}
                      //     >
                      //       Prev
                      //     </Button>
                      //     <Button
                      //       color="primary"
                      //       endContent={<FontAwesomeIcon icon={faCaretRight} size="lg" />}
                      //       onPress={nextPage}
                      //     >
                      //       Next
                      //     </Button>
                      //   </div>
                    }
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
              textValue="toggle numbers for exact distances in depth filter"
              key="DepthNumbers"
              description="toggle numbers for exact distances"
              endContent={<FontAwesomeIcon icon={faStreetView} size="lg" />}>
              <Checkbox isSelected={depthNumbers} onValueChange={addDepthNumbers} size="sm">Depth Value</Checkbox>
            </DropdownItem>
            {
              <DropdownItem
                isReadOnly
                textValue="Reduce DeadEnds"
                key="Reduce dead ends"
                description="Reduce the number of DeadEnds"
                endContent={<FontAwesomeIcon icon={faBridgeCircleCheck} size="lg" />}>
                <Checkbox isSelected={braid} onValueChange={toggelBraiding} size="sm">Reduce DeadEnds</Checkbox>
              </DropdownItem>
            }
            {
              <DropdownItem
                isReadOnly
                textValue="DeadEnds Reduction Percentage"
                key="Reduce dead ends percentage"
                description="the percentage of removed DeadEnds"
              >
                <Slider
                  className="sliderThing"
                  label="Temperature"
                  formatOptions={{ style: "percent" }}
                  startContent={<FontAwesomeIcon icon={faBridgeCircleCheck} size="xs" />}
                  endContent={<FontAwesomeIcon icon={faBridgeCircleCheck} size="lg" />}
                  step={0.01}
                  maxValue={1}
                  minValue={0}
                  defaultValue={0.4}
                  size="sm"
                  radius="md"
                />
              </DropdownItem>
            }
            {
              <DropdownItem
                isReadOnly
                textValue="Toggle distance values for path algorithms"
                key="search distance values"
                description="toggle numbers for exact distances"
                endContent={<FontAwesomeIcon icon={faRoute} size="lg" />}>
                <Checkbox isSelected={searchDistance} onValueChange={addSearchDistance} size="sm">Search Distance</Checkbox>
              </DropdownItem>
            }
          </DropdownMenu>
        </Dropdown>
        <Tooltip id="reset" content="Reset" showArrow={true} color="primary" delay={tooltipDelay} closeDelay={200}>
          <Button ref={resetButton} color="primary" isIconOnly size="sm" onClick={handleResetButton}>
            <FontAwesomeIcon icon={faRepeat} size="lg" />
          </Button>
        </Tooltip>
        <Tooltip content="fast-forward" showArrow={true} color="primary" delay={tooltipDelay} closeDelay={200}>
          <Button ref={skipButton} color="primary" isIconOnly size="sm" onClick={handleSkipButton}>
            <FontAwesomeIcon icon={faForward} size="lg" beat={animateSkipButton} />
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
        {
          <Tooltip content="Depth Filter" showArrow={true} color="primary" delay={tooltipDelay} closeDelay={200}>
            <Button ref={depthFilterButton} color="primary" isIconOnly size="sm" onClick={addDepthFilter} isDisabled={disableDepthFilter}>
              <FontAwesomeIcon icon={faStreetView} size="lg" />
            </Button>
          </Tooltip>
        }
        {
          <Tooltip content="Add/Remove Weighted Nodes" showArrow={true} color="primary" delay={tooltipDelay} closeDelay={200}>
            <Button color="primary" isIconOnly size="sm" onClick={addWeights} >
              <FontAwesomeIcon icon={faWeightHanging} size="lg" beat={animateWeights} />
            </Button>
          </Tooltip>
        }
        {
          <Tooltip content="Build/Demolish walls" showArrow={true} color="primary" delay={tooltipDelay} closeDelay={200}>
            <Button color="primary" isIconOnly size="sm" onClick={addWalls} >
              <FontAwesomeIcon icon={faTrowelBricks} size="lg" beat={animateWallMod} />
            </Button>
          </Tooltip>
        }
      </NavbarContent>
    </NextUINavbar >
  );
};

