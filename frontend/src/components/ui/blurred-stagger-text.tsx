"use client"

import * as React from "react"
import { motion } from "motion/react";

export const BlurredStagger = ({
    text = "we love hextaui.com ❤️",
    className = "",
    as: Tag = "h1",
    inView = false,
    staggerChildren = 0.035,
    letterDuration = 0.6,
}: {
    text: string;
    className?: string;
    as?: "h1" | "h2" | "h3" | "p" | "span";
    inView?: boolean;
    staggerChildren?: number;
    letterDuration?: number;
}) => {
    const headingText = text;
    const ease = [0.22, 1, 0.36, 1] as const;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren,
            },
        },
    };

    const letterAnimation = {
        hidden: {
            opacity: 0,
            filter: "blur(10px)",
        },
        show: {
            opacity: 1,
            filter: "blur(0px)",
        },
    };

    const animProps = {
        variants: container,
        initial: "hidden" as const,
        ...(inView ? { whileInView: "show" as const, viewport: { once: true, margin: "-50px" } } : { animate: "show" as const }),
        className,
    };

    const children = headingText.split("").map((char, index) => (
        <motion.span
            key={index}
            variants={letterAnimation}
            transition={{ duration: letterDuration, ease }}
        >
            {char === " " ? "\u00A0" : char}
        </motion.span>
    ));

    if (Tag === "h1") return <motion.h1 {...animProps}>{children}</motion.h1>;
    if (Tag === "h2") return <motion.h2 {...animProps}>{children}</motion.h2>;
    if (Tag === "h3") return <motion.h3 {...animProps}>{children}</motion.h3>;
    if (Tag === "p") return <motion.p {...animProps}>{children}</motion.p>;
    return <motion.span {...animProps}>{children}</motion.span>;
};
