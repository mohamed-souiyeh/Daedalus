import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { createRef, useEffect, useRef, useState } from "react";
import { MyAvatar } from "./avatar";
import { title } from "./primitives";
import { Button, ButtonGroup } from "@nextui-org/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookBookmark, faBookOpen, faBug, faBugSlash, faGear, faMinus, faPause, faPlay, faPlus, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { inputDefaults } from "@/src/configs/defaults";
import { DELAYSTEP, updateDelay } from "@/src/Events/Delay.EventListeners";
import { globals } from "@/src/Events/input";

const color = undefined as "primary" | "default" | "secondary" | "success" | "warning" | "danger" | undefined;

export const Navbar = () => {

  const controleCenterButton = createRef<HTMLButtonElement>();
  const resetButton = createRef<HTMLButtonElement>();
  const pauseButton = createRef<HTMLButtonElement>();
  const debugButton = createRef<HTMLButtonElement>();
  const debugBooklet = createRef<HTMLButtonElement>();
  const increment = createRef<HTMLButtonElement>();
  const decrement = createRef<HTMLButtonElement>();
  const numberInput = createRef<HTMLInputElement>();


  const [inputValue, setInputValue] = useState(inputDefaults.DELAY as unknown as string);
  const inputValueRef = useRef(inputValue);

  useEffect(() => {
    inputValueRef.current = inputValue;
  }, [inputValue]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!/^\d*$/.test(inputValueRef.current)) {
      updateDelay(inputDefaults.DELAY, setInputValue);
    } else {
      updateDelay(parseInt(inputValueRef.current), setInputValue);
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
  const pauseButtonIconRef = useRef(pauseButtonIcon);

  useEffect(() => {
    pauseButtonIconRef.current = pauseButtonIcon;
  }, [pauseButtonIcon]);

  const handlePauseButton = () => {
    globals.isPaused = !globals.isPaused;
    setPauseButtonIcon(pauseButtonIconRef.current === faPlay ? faPause : faPlay);
  };

  const [debugButtonIcon, setDebugButtonIcon] = useState(inputDefaults.DEBUGMODEON ? faBug : faBugSlash);
  const debugButtonIconRef = useRef(debugButtonIcon);
  const [debugButtonColor, setDebugButtonColor] = useState((inputDefaults.DEBUGMODEON ? "primary" : "default") as "primary" | "default" | "secondary" | "success" | "warning" | "danger" | undefined);
  const debugButtonColorRef = useRef(debugButtonColor);

  useEffect(() => {
    debugButtonIconRef.current = debugButtonIcon;
    debugButtonColorRef.current = debugButtonColor;
  }, [debugButtonIcon, debugButtonColor]);

  const handleDebugButton = () => {
    globals.debugModeOn = !globals.debugModeOn;
    setDebugButtonIcon(debugButtonIconRef.current === faBug ? faBugSlash : faBug);
    setDebugButtonColor(debugButtonColorRef.current === "primary" ? "default" : "primary");
    handleDebugBooklet();
  };

  const [debugBookletColor, setDebugBookletColor] = useState(inputDefaults.DEBUGBOOKLETISON ? "primary" as typeof color: "default" as typeof color);
  const debugBookletColorRef = useRef(debugBookletColor);

  useEffect(() => {
    debugBookletColorRef.current = debugBookletColor;
  }, [debugBookletColor]);

  const handleDebugBooklet = () => {
    globals.debugBookletIsOn = !globals.debugBookletIsOn;
    setDebugBookletColor(debugBookletColorRef.current === "primary" ? "default" : "primary");
  };

  useEffect(() => {

    const windowShortcutes = (event: any) => {
      
      // console.log("event => ", event);
      if (event.code === 'KeyC') {
        // controleCenterButton.current?.click();
      }
      if (event.code === 'KeyP') {
        console.log("pauseButton.current => ");
        handlePauseButton();
      }
      if (event.code === 'KeyD') {
        handleDebugButton();
        handleDebugBooklet();
      }
      if (event.code === 'KeyB') {
        handleDebugBooklet();
      }
      if (event.code === 'NumpadSubtract') {
        decrementDelay();
      }
      if (event.code === 'NumpadAdd') {
        incrementDelay();
      }
    }
  
    window.addEventListener('keydown', windowShortcutes);

    return () => {
      window.removeEventListener('keydown', windowShortcutes);
    }

  }, []);





  return (
    <NextUINavbar maxWidth="full" position="sticky" isBordered id="nav">
      <NavbarContent id="firstSection" as="div" justify="start">
        <MyAvatar />
      </NavbarContent>
      <NavbarContent id="secondSection" as="div" justify="center">
        <h1 className={title({ color: "blue" })}>
          Daedalus
        </h1>
      </NavbarContent>
      <NavbarContent id="thirdSection" as="div" justify="end">
        <Button ref={controleCenterButton} color="primary" isIconOnly size="sm">
          <FontAwesomeIcon icon={faGear} rotation={90} size="lg" />
        </Button>
        <Button ref={resetButton} color="primary" isIconOnly size="sm">
          <FontAwesomeIcon icon={faRepeat} size="lg" />
        </Button>
        <Button ref={pauseButton} color="primary" isIconOnly size="sm" onClick={handlePauseButton}>
          <FontAwesomeIcon icon={pauseButtonIcon} size="lg" />
        </Button>
        <ButtonGroup >

          <Button ref={debugBooklet} color={debugBookletColor} isIconOnly size="sm" onClick={handleDebugBooklet}>
            <FontAwesomeIcon icon={faBookOpen} size="lg" />
          </Button>

          <Button ref={debugButton} color={debugButtonColor} isIconOnly size="sm" onClick={handleDebugButton}>
            <FontAwesomeIcon icon={debugButtonIcon} size="lg" />
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button ref={decrement} color="primary" isIconOnly size="sm" onClick={decrementDelay}>
          <FontAwesomeIcon icon={faMinus} size="lg" />
          </Button>
          <input
            type="text"
            ref={numberInput}
            className=" h-8 text-center"
            size={1}
            value={inputValue}
            onChange={onInputChange}
          />
          <Button ref={increment} color="primary" isIconOnly size="sm" onClick={incrementDelay}>
            <FontAwesomeIcon icon={faPlus} size="lg" />
          </Button>
        </ButtonGroup>
      </NavbarContent>
    </NextUINavbar>
  );
};

// const searchInput = (
// 	<Input
// 		aria-label="Search"
// 		classNames={{
// 			inputWrapper: "bg-default-100",
// 			input: "text-sm",
// 		}}
// 		endContent={
// 			<Kbd className="hidden lg:inline-block" keys={["command"]}>
// 				K
// 			</Kbd>
// 		}
// 		labelPlacement="outside"
// 		placeholder="Search..."
// 		startContent={
// 			<SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
// 		}
// 		type="search"
// 	/>
// );
{/* <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarBrand as="li" className="gap-3 max-w-fit">
					<NextLink className="flex justify-start items-center gap-1" href="/">
						<Logo />
						<p className="font-bold text-inherit">ACME</p>
					</NextLink>
				</NavbarBrand>
				<ul className="hidden lg:flex gap-4 justify-start ml-2">
					{siteConfig.navItems.map((item) => (
						<NavbarItem key={item.href}>
							<NextLink
								className={clsx(
									linkStyles({ color: "foreground" }),
									"data-[active=true]:text-primary data-[active=true]:font-medium"
								)}
								color="foreground"
								href={item.href}
							>
								{item.label}
							</NextLink>
						</NavbarItem>
					))}
				</ul>
			</NavbarContent>

			<NavbarContent
				className="hidden sm:flex basis-1/5 sm:basis-full"
				justify="end"
			>
				<NavbarItem className="hidden sm:flex gap-2">
					<Link isExternal href={siteConfig.links.twitter} aria-label="Twitter">
						<TwitterIcon className="text-default-500" />
					</Link>
					<Link isExternal href={siteConfig.links.discord} aria-label="Discord">
						<DiscordIcon className="text-default-500" />
					</Link>
					<Link isExternal href={siteConfig.links.github} aria-label="Github">
						<GithubIcon className="text-default-500" />
					</Link>
				</NavbarItem>
				<NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
				<NavbarItem className="hidden md:flex">
					<Button
            isExternal
						as={Link}
						className="text-sm font-normal text-default-600 bg-default-100"
						href={siteConfig.links.sponsor}
						startContent={<HeartFilledIcon className="text-danger" />}
						variant="flat"
					>
						Sponsor
					</Button>
				</NavbarItem>
			</NavbarContent>

			<NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
				<Link isExternal href={siteConfig.links.github} aria-label="Github">
					<GithubIcon className="text-default-500" />
				</Link>
				<NavbarMenuToggle />
			</NavbarContent>

			<NavbarMenu>
				{searchInput}
				<div className="mx-4 mt-2 flex flex-col gap-2">
					{siteConfig.navMenuItems.map((item, index) => (
						<NavbarMenuItem key={`${item}-${index}`}>
							<Link
								color={
									index === 2
										? "primary"
										: index === siteConfig.navMenuItems.length - 1
										? "danger"
										: "foreground"
								}
								href="#"
								size="lg"
							>
								{item.label}
							</Link>
						</NavbarMenuItem>
					))}
				</div>
			</NavbarMenu> */}