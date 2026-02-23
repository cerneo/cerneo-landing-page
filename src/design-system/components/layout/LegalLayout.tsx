import type { ReactNode } from "react";
import { Container } from "./Container";
import { Section } from "./Section";

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <>
      <Section variant="dark" className="py-12 md:py-16">
        <Container>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-gray-400 text-sm">{lastUpdated}</p>
        </Container>
      </Section>
      <Section variant="default">
        <Container>
          <div className="prose prose-gray max-w-none prose-headings:text-charcoal prose-headings:font-semibold prose-p:text-steel prose-p:leading-relaxed prose-li:text-steel prose-a:text-neo-600 prose-a:no-underline hover:prose-a:underline">
            {children}
          </div>
        </Container>
      </Section>
    </>
  );
}
