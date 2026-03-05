import localFont from "next/font/local";
import { Inter } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], weight: ["500"] });

export const instrumentSerif = localFont({
    src: [
        {
            path: "../../public/instrument-serif/instrumentserif-regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../public/instrument-serif/instrumentserif-italic.ttf",
            weight: "400",
            style: "italic",
        },
    ],
    variable: "--font-instrument-serif",
});
