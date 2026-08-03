"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import classnames from "classnames";
import { Section } from "../layout/Section";
import { Container } from "../layout/Container";
import { Modal, ModalHeader, ModalBody } from "../ui/Modal";
import { AnimatedEnvelope } from "./AnimatedEnvelope";
import { WhatsAppButton } from "./WhatsAppButton";
import { ContactForm } from "./ContactForm";
import { fadeInUp, staggerContainer } from "../../tokens";
import { themeConfig } from "../../config/theme.config";

const cardClasses = classnames(
  "group flex h-full w-full cursor-pointer flex-col rounded-2xl border p-5 text-center",
  "border-gray-200 bg-white hover:border-neo-300 hover:shadow-xl",
  "dark:border-gray-700 dark:bg-charcoal dark:hover:border-neo-700",
  themeConfig.defaultTransition
);

export function ContactSection() {
  const t = useTranslations("contact");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Section
      variant="mist"
      id="contact"
      className="scroll-mt-16 py-12! md:py-16!"
      data-component-name="ContactSection"
    >
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={fadeInUp} className="mx-auto mb-8 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-charcoal dark:text-gray-100 md:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-lg text-steel dark:text-gray-400">{t("subtitle")}</p>
          </motion.div>

          <div className="mx-auto grid max-w-3xl grid-cols-1 items-stretch gap-6 md:grid-cols-2">
            <motion.div variants={fadeInUp} className="flex flex-col">
              <button type="button" onClick={() => setIsModalOpen(true)} className={cardClasses}>
                <span className="flex h-28 items-center justify-center">
                  <AnimatedEnvelope className="env-scene--compact" />
                </span>
                <span className="mt-2 block text-lg font-semibold text-charcoal dark:text-gray-100">
                  {t("email.cardTitle")}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-steel dark:text-gray-400">
                  {t("email.cardDescription")}
                </span>
              </button>
              <p className="mt-2.5 text-center text-xs text-steel dark:text-gray-400">
                {t("email.directLinkPrefix")}{" "}
                <a
                  href="mailto:contato@cerneo.com.br"
                  className="font-medium text-neo-600 hover:underline dark:text-neo-400"
                >
                  contato@cerneo.com.br
                </a>
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col">
              <WhatsAppButton
                label={t("whatsapp.cardTitle")}
                sublabel={t("whatsapp.cardDescription")}
                className={cardClasses}
              />
              <p className="mt-2.5 text-center text-xs text-steel dark:text-gray-400">
                +55 11 95213-4621
              </p>
            </motion.div>
          </div>
        </motion.div>
      </Container>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md" rounded="2xl">
        <ModalHeader>{t("form.title")}</ModalHeader>
        <ModalBody>
          <ContactForm onSuccess={() => setIsModalOpen(false)} />
        </ModalBody>
      </Modal>
    </Section>
  );
}
