import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

/**
 * As duas fontes do Cerneo DS, auto-hospedadas pelo `next/font` no build.
 * O `globals.css` aponta `--cn-font-sans` e `--cn-font-mono` para estas variáveis.
 */
export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-jakarta",
});

export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
  preload: false,
});

export const fontVariables = `${jakarta.variable} ${jetbrains.variable}`;
