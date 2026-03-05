import Image from "next/image";

export default function ProductPreview() {
    return (
        <div className="w-full max-w-5xl mt-32 mb-12 relative z-10 mx-auto">
            <div className="rounded-[2rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border-[12px] border-[#111] bg-[#111] transform perspective-1000 rotate-x-2">
                <Image
                    src="/productpreview.png"
                    alt="ResuMatch Dashboard Preview"
                    width={1600}
                    height={1000}
                    className="w-full h-auto object-cover rounded-xl"
                    priority
                />
            </div>
        </div>
    );
}
