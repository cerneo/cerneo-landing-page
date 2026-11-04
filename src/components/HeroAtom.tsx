"use client";

/**
 * O átomo do hero: a assinatura Cerneo no núcleo, três anéis em 3D e um
 * elétron por produto (Studios, NanaPet, Forge). Vídeo de 6 s em laço,
 * gerado no Hyperframes (scratchpad hero-v5 c1), recortado no átomo.
 *
 * - O hero `aura` é escuro nos dois temas, então há uma versão só: a escura,
 *   sobre preto puro. Com `mix-blend-mode: lighten` o preto some e a aura
 *   aparece por trás (funciona no Safari, sem vídeo com alfa).
 * - O pôster sai no HTML do servidor; o vídeo só entra no cliente, com
 *   movimento liberado e tela de 640 px ou mais (abaixo disso a assinatura
 *   fica menor que os 160 px mínimos e vale o pôster).
 */
import { useEffect, useState } from "react";

const W = 976;
const H = 912;
const SRC = (ext: string) => `/hero/cerne-atomo.${ext}`;

/** Movimento liberado e espaço para a assinatura em 160 px. */
function useCanPlay() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: no-preference) and (min-width: 640px)");
    const sync = () => setOk(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return ok;
}

export function HeroAtom() {
  const play = useCanPlay();
  return (
    <div className="hero-atom" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- pôster fixo, já no tamanho */}
      <img className="hero-atom__poster" src={SRC("webp")} width={W} height={H} alt="" fetchPriority="high" />
      {play && (
        <video className="hero-atom__video" width={W} height={H} poster={SRC("webp")} autoPlay muted loop playsInline preload="auto" disablePictureInPicture>
          <source src={SRC("webm")} type="video/webm" />
          <source src={SRC("mp4")} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
