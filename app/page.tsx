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


export default function Home() {
  const canvaRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvaRef.current || globals.setup)
      return;
    globals.canvas = canvaRef.current;
    globals.ctx = canvaRef.current.getContext("2d");
    if (!globals.ctx)
      return;

    console.log("setup");
    console.log("canvaRef => ", canvaRef);
    console.log("globals canvas => ", globals.canvas);
    console.log("globals ctx =>", globals.ctx);
    setupEventListners();

    setup();

  }, []);


  return (
    <>
      <Navbar />
      <main id="maze">
        <canvas id="canvas" ref={canvaRef} />
      </main>
    </>
  );
}
