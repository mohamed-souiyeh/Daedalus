import { Roboto } from "next/font/google";
import { tv } from "tailwind-variants";

// export declare function Roboto<T extends CssVariable | undefined = undefined>(options: {
//     weight: '100' | '300' | '400' | '500' | '700' | '900' | Array<'100' | '300' | '400' | '500' | '700' | '900'>;
//     style?: 'normal' | 'italic' | Array<'normal' | 'italic'>;
//     display?: Display;
//     variable?: T;
//     preload?: boolean;
//     fallback?: string[];
//     adjustFontFallback?: boolean;
//     subsets?: Array<'cyrillic' | 'cyrillic-ext' | 'greek' | 'greek-ext' | 'latin' | 'latin-ext' | 'vietnamese'>;
// }): T extends undefined ? NextFont : NextFontWithVariable;

const roboto = Roboto({
  weight: '700',
  subsets: ['latin'],
  variable: '--font-roboto',
})

export const title = tv({
  base: `${roboto.variable} tracking-tight inline font-semibold`,
  variants: {
    color: {
      violet: "from-[#FF1CF7] to-[#b249f8]",
      yellow: "from-[#FF705B] to-[#FFB457]",
      blue: "from-[#0072F5] to-[#0072F5]",
      cyan: "from-[#00b7fa] to-[#01cfea]",
      green: "from-[#6FEE8D] to-[#17c964]",
      pink: "from-[#FF72E1] to-[#F54C7A]",
      foreground: "dark:from-[#FFFFFF] dark:to-[#4B4B4B]",
    },
    size: {
      sm: "text-3xl lg:text-4xl",
      md: "text-[3rem] lg:text-5xl leading-9",
      lg: "text-4xl lg:text-6xl",
    },
    fullWidth: {
      true: "w-full block",
    },
  },
  defaultVariants: {
    size: "md",
  },
  compoundVariants: [
    {
      color: [
        "violet",
        "yellow",
        "blue",
        "cyan",
        "green",
        "pink",
        "foreground",
      ],
      class: "bg-clip-text text-transparent bg-gradient-to-b",
    },
  ],
});

export const subtitle = tv({
  base: "w-full md:w-1/2 my-2 text-lg lg:text-xl text-default-600 block max-w-full",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    fullWidth: true
  }
});
