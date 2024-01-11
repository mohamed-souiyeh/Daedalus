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
import { globals, setupEventListners } from "@/src/Events/input";
import { animation, setup } from "@/src";


export default function Home() {
  const canvaRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvaRef.current)
      return;
    globals.canvas = canvaRef.current;
    globals.ctx = canvaRef.current.getContext("2d");
    if (!globals.ctx)
      return;
    setupEventListners();

    setup();

    requestAnimationFrame(animation);
  }, []);


  return (
    <>
      <Navbar />
      <main id="maze">
        <canvas id="canvas" ref={canvaRef}/>
      </main>
    </>
  );
}
