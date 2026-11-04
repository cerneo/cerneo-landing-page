import { notFound } from "next/navigation";

/** Toda rota desconhecida dentro de um locale cai no `not-found.tsx` do locale. */
export default function CatchAll() {
  notFound();
}
