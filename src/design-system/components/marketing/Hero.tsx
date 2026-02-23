"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import classnames from "classnames";
import type { THeroVariant } from "../../types";
import { fadeInUp, staggerContainer } from "../../tokens";
import { Container } from "../layout/Container";
import type { ReactNode } from "react";

interface HeroProps {
  variant?: THeroVariant;
  title: string;
  subtitle: string;
  children?: ReactNode;
  className?: string;
}

const hexPath = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

function FloatingHex({
  size,
  x,
  y,
  delay,
  duration,
  opacity,
  filled,
}: {
  size: number;
  x: string;
  y: string;
  delay: number;
  duration: number;
  opacity: string;
  filled?: boolean;
}) {
  return (
    <motion.div
      animate={{
        y: [0, -size * 0.6, 0],
        rotate: [0, filled ? -6 : 8, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
      className={classnames("absolute", filled ? `bg-neo-500/${opacity}` : `border border-neo-400/${opacity}`)}
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        clipPath: hexPath,
      }}
    />
  );
}

function OrbitalRing({ radius, duration, delay }: { radius: number; duration: number; delay: number }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear", delay }}
      className="absolute rounded-full border border-neo-500/[0.06]"
      style={{
        width: radius * 2,
        height: radius * 2,
        top: `calc(50% - ${radius}px)`,
        left: `calc(50% - ${radius}px)`,
      }}
    >
      <motion.div
        className="absolute h-2 w-2 rounded-full bg-neo-400/40"
        style={{ top: -4, left: "50%", marginLeft: -4 }}
      />
    </motion.div>
  );
}

export function Hero({
  variant = "page",
  title,
  subtitle,
  children,
  className,
}: HeroProps) {
  const isHome = variant === "home";

  return (
    <section
      data-component-name="Hero"
      className={classnames(
        "relative overflow-hidden",
        isHome
          ? "bg-charcoal py-24 md:py-32 lg:py-40"
          : "bg-gradient-to-br from-charcoal to-slate-dark py-16 md:py-24",
        className
      )}
    >
      {/* Background layers (home only) */}
      {isHome && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Radial gradient base */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(20,184,166,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(20,184,166,0.04) 0%, transparent 60%)",
            }}
          />

          {/* Animated glow orbs */}
          <motion.div
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 right-[10%] h-[500px] w-[500px] rounded-full bg-neo-500/[0.07] blur-[100px]"
          />
          <motion.div
            animate={{
              x: [0, -20, 0],
              y: [0, 15, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-40 -left-20 h-[400px] w-[400px] rounded-full bg-neo-400/[0.05] blur-[80px]"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.04, 0.08, 0.04] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[300px] w-[300px] rounded-full bg-neo-300/[0.04] blur-[60px]"
          />

          {/* Dot grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Subtle noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Floating hexagons */}
          <FloatingHex size={80} x="12%" y="15%" delay={0} duration={9} opacity="15" />
          <FloatingHex size={48} x="85%" y="20%" delay={1.5} duration={7} opacity="10" filled />
          <FloatingHex size={64} x="8%" y="70%" delay={3} duration={11} opacity="10" />
          <FloatingHex size={32} x="75%" y="75%" delay={2} duration={8} opacity="20" filled />
          <FloatingHex size={24} x="50%" y="10%" delay={4} duration={10} opacity="15" filled />
          <FloatingHex size={56} x="92%" y="50%" delay={1} duration={9} opacity="08" />

          {/* Horizon line glow */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(20,184,166,0.2) 30%, rgba(20,184,166,0.3) 50%, rgba(20,184,166,0.2) 70%, transparent)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-24"
            style={{
              background: "linear-gradient(to top, rgba(20,184,166,0.03), transparent)",
            }}
          />
        </div>
      )}

      <Container className="relative z-10">
        {isHome ? (
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
            {/* Left: text content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex-1 text-center lg:text-left"
            >
              {/* Glassmorphic badge */}
              <motion.div variants={fadeInUp}>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-neo-300 mb-6 border border-neo-500/20 shadow-[0_0_15px_rgba(20,184,166,0.1)]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neo-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-neo-400" />
                  </span>
                  Holding de Tecnologia
                </span>
              </motion.div>

              {/* Title with gradient text */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1]"
              >
                <span className="inline-block bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                  {title}
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="mt-6 text-lg leading-relaxed text-gray-400 md:text-xl max-w-xl mx-auto lg:mx-0"
              >
                {subtitle}
              </motion.p>

              {children && (
                <motion.div
                  variants={fadeInUp}
                  className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
                >
                  {children}
                </motion.div>
              )}

              {/* Trust indicators */}
              <motion.div
                variants={fadeInUp}
                className="mt-12 flex items-center gap-6 justify-center lg:justify-start"
              >
                {[
                  { value: "4", label: "Produtos" },
                  { value: "99.9%", label: "Uptime" },
                  { value: "LGPD", label: "Compliant" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <div className="text-lg font-bold text-neo-400">{stat.value}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: 3D logo composition */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="flex-shrink-0 hidden md:flex items-center justify-center"
              style={{ perspective: "1000px" }}
            >
              <div className="relative w-[340px] h-[340px] lg:w-[420px] lg:h-[420px]">
                {/* Orbital rings */}
                <OrbitalRing radius={170} duration={30} delay={0} />
                <OrbitalRing radius={140} duration={25} delay={2} />
                <OrbitalRing radius={200} duration={40} delay={5} />

                {/* Glow backdrop */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="h-48 w-48 lg:h-56 lg:w-56 rounded-full bg-neo-500/20 blur-[60px]"
                  />
                </div>

                {/* Hexagonal frame behind logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="h-64 w-64 lg:h-72 lg:w-72 border border-neo-500/[0.08]"
                    style={{ clipPath: hexPath }}
                  />
                </div>

                {/* Logo with 3D hover effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      y: [0, -8, 0],
                      rotateX: [0, 2, 0],
                      rotateY: [0, -3, 0],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Image
                      src="/images/cerneo-logo.png"
                      alt="Cerneo"
                      width={246}
                      height={320}
                      className="h-48 w-auto lg:h-60 object-contain drop-shadow-[0_0_40px_rgba(20,184,166,0.3)]"
                      priority
                    />
                  </motion.div>
                </div>

                {/* Floating product dots around logo */}
                {[
                  { color: "bg-product-ai", angle: 45, label: "AI" },
                  { color: "bg-product-crm", angle: 135, label: "CRM" },
                  { color: "bg-product-clinic", angle: 225, label: "Clinic" },
                  { color: "bg-product-kalender", angle: 315, label: "Kalender", logoSrc: "/images/product-logo/kalender-logo.png" },
                ].map((product, i) => {
                  const r = 145;
                  const rad = (product.angle * Math.PI) / 180;
                  const px = Math.cos(rad) * r;
                  const py = Math.sin(rad) * r;
                  return (
                    <motion.div
                      key={product.label}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.15, duration: 0.5, type: "spring", stiffness: 200 }}
                      className="absolute"
                      style={{
                        top: `calc(50% + ${py}px - 16px)`,
                        left: `calc(50% + ${px}px - 16px)`,
                      }}
                    >
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                        className="group relative"
                      >
                        <div className={classnames("h-8 w-8 rounded-full flex items-center justify-center shadow-lg", product.logoSrc ? "bg-white" : product.color)}>
                          {product.logoSrc ? (
                            <Image src={product.logoSrc} alt={product.label} width={20} height={20} className="h-5 w-5 object-contain" />
                          ) : (
                            <span className="text-[10px] font-bold text-white">{product.label.charAt(0)}</span>
                          )}
                        </div>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          <span className="text-[10px] text-gray-400">{product.label}</span>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
            >
              {title}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg leading-relaxed text-gray-300"
            >
              {subtitle}
            </motion.p>
            {children && (
              <motion.div
                variants={fadeInUp}
                className="mt-8 flex flex-wrap items-center justify-center gap-4"
              >
                {children}
              </motion.div>
            )}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
