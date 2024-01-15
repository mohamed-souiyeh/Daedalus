import {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};


export const color = undefined as "primary" | "default" | "secondary" | "success" | "warning" | "danger" | undefined;