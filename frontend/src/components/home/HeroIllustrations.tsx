import Image from "next/image";

export default function HeroIllustrations() {
    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible max-w-7xl mx-auto">

            {/* Bee Illustration */}
            <div className="absolute top-[6rem] md:top-[8rem] left-[15%] md:left-[28%] w-16 md:w-20 -rotate-12 opacity-90 mix-blend-multiply">
                <Image src="/bee.png" alt="Bee illustration" width={150} height={150} className="w-full h-auto" />
            </div>

            {/* clap.png adjusted higher to remain visible */}
            <div className="absolute top-[22rem] md:top-[24rem] left-[5%] md:left-[16%] w-56 md:w-[380px] mix-blend-multiply">
                <Image src="/clap.png" alt="High five illustration" width={600} height={600} className="w-full h-auto object-contain" priority />
            </div>

            {/* run.png positioned higher and bigger based on user feedback */}
            <div className="absolute top-[18rem] md:top-[18rem] right-[0%] md:right-[15%] w-[250px] md:w-[350px] mix-blend-multiply">
                <Image src="/run.png" alt="Delivery illustration" width={500} height={500} className="w-full h-auto object-contain" />
            </div>

        </div>
    );
}
