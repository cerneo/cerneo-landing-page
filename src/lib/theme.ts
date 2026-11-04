/**
 * O contrato de tema do site. Sem "use client": o layout (Server Component) lê
 * o script e as cores; o botão de tema (cliente) lê a chave.
 *
 * O Cerneo DS resolve a cor por `data-theme` no `<html>` (e também pela classe
 * `.dark`/`.light`): os dois são escritos juntos.
 */
import tokens from "@cerneo/tokens/json";

export const THEME_STORAGE_KEY = "cerneo-theme";
export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

type Resolved = Record<"light" | "dark", Record<"cerneo", { canvas: string }>>;
const resolved = (tokens as unknown as { resolved: Resolved }).resolved;

/** Fundo de cada tema, do pacote de tokens (barra do navegador). */
export const THEME_CANVAS = {
  light: resolved.light.cerneo.canvas,
  dark: resolved.dark.cerneo.canvas,
} as const;

/**
 * Aplica o tema antes da primeira pintura. Sem escolha gravada, segue o sistema.
 * Fica num `<head>` explícito no layout: o React 19 não iça script inline.
 */
export const THEME_INIT_SCRIPT = `(function(){try{
var d=document.documentElement,s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}),
t=(s==='light'||s==='dark')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
d.classList.remove('light','dark');d.classList.add(t);d.setAttribute('data-theme',t);d.style.colorScheme=t;
}catch(e){}})()`;

export function applyTheme(theme: Theme) {
  const d = document.documentElement;
  d.classList.remove("light", "dark");
  d.classList.add(theme);
  d.setAttribute("data-theme", theme);
  d.style.colorScheme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* modo privado: o tema vale só nesta aba */
  }
}

/**
 * Rede de segurança para quando o Next entrega a página sem o <head> do layout
 * (o 404 de rota desconhecida sai num shell de erro e o script não roda).
 */
export function ensureTheme() {
  const d = document.documentElement;
  if (d.getAttribute("data-theme")) return;
  let s: string | null = null;
  try {
    s = localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    s = null;
  }
  const t: Theme = s === "light" || s === "dark" ? s : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  d.classList.remove("light", "dark");
  d.classList.add(t);
  d.setAttribute("data-theme", t);
  d.style.colorScheme = t;
}
