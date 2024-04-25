'use client';

import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code"
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { Navbar } from "@/components/navbar";
import { useEffect, useRef } from "react";
import { setupEventListners } from "@/src/Events/input";
import { setup } from "@/src";
import { globals } from "@/src/configs/globals";
import { Application } from "pixi.js";


export default function Home() {

  const mazeRef = useRef<HTMLDivElement>(null);

  const pixiSetup = async (mazeElement: HTMLDivElement) => {
    const app = new Application();

    await app.init({
      background: "#1099bb",
      resizeTo: window,
    });

    globals.app = app;

    globals.canvas = app.canvas;

    mazeElement.appendChild(app.canvas);
  }


  useEffect(() => {

    if (!mazeRef.current || globals.setup)
      return;


    pixiSetup(mazeRef.current).then(async () => {

      if (!mazeRef.current)
        return;

      await setupEventListners(mazeRef.current);

      setup();

    })
  }, []);


  return (
    <>
      <Navbar />
      <div id="maze" ref={mazeRef}>
      </div>
    </>
  );
}
