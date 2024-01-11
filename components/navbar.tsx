import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import React, { CSSProperties, useState } from "react";
import { MyAvatar } from "./avatar";
import { title } from "./primitives";
import { Button, ButtonGroup } from "@nextui-org/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookBookmark, faBug, faBugSlash, faGear, faMinus, faPause, faPlay, faPlus, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { inputDefaults } from "@/src/configs/defaults";
import { Switch } from "@nextui-org/switch";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { Input } from "@nextui-org/input";



export const Navbar = () => {
  const [pauseButtonIcon, setPauseButtonIcon] = useState(inputDefaults.ISPAUSED ? faPlay : faPause);
  const handlePauseButton = () => {
    setPauseButtonIcon(pauseButtonIcon === faPlay ? faPause : faPlay);
  };

  const [debugButtonIcon, setDebugButtonIcon] = useState(inputDefaults.DEBUGMODEON ? faBug : faBugSlash);
  const [debugButtonColor, setDebugButtonColor] = useState((inputDefaults.DEBUGMODEON ? "primary" : "default") as "primary" | "default" | "secondary" | "success" | "warning" | "danger" | undefined);

  const handleDebugButton = () => {
    setDebugButtonIcon(debugButtonIcon === faBug ? faBugSlash : faBug);
    setDebugButtonColor(debugButtonColor === "primary" ? "default" : "primary");
    // color = debugButtonIcon === faBug ? "primary" : "default";
  };

  const [debugBookletColor, setDebugBookletColor] = useState("default" as "primary" | "default" | "secondary" | "success" | "warning" | "danger" | undefined);

  const handleDebugBooklet = () => {
    setDebugBookletColor(debugBookletColor === "primary" ? "default" : "primary");
  };

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
        <Button id="controleCenterButton" color="primary" isIconOnly size="sm">
          <FontAwesomeIcon icon={faGear} rotation={90} size="lg" />
        </Button>
        <Button id="resetButton" color="primary" isIconOnly size="sm">
          <FontAwesomeIcon icon={faRepeat} size="lg" />
        </Button>
        <Button id="pauseButton" color="primary" isIconOnly size="sm" onClick={handlePauseButton}>
          <FontAwesomeIcon icon={pauseButtonIcon} size="lg" />
        </Button>
        <ButtonGroup >

          <Button id="debugBooklet" color={debugBookletColor} isIconOnly size="sm" onClick={handleDebugBooklet}>
            <FontAwesomeIcon icon={faBookBookmark} size="lg" />
          </Button>
          
          <Button id="debugButton" color={debugButtonColor} isIconOnly size="sm" onClick={handleDebugButton}>
            <FontAwesomeIcon icon={debugButtonIcon} size="lg" />
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button id="decrement" color="primary" isIconOnly size="sm">
            <FontAwesomeIcon icon={faPlus} size="lg" />
          </Button>
          <input
            type="text"
            id="number-input"
            className=" h-8 text-center"
            size={1}
            defaultValue="16" 
            />
          <Button id="increment" color="primary" isIconOnly size="sm">
            <FontAwesomeIcon icon={faMinus} size="lg" />
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