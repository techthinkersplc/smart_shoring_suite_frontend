import Image from "next/image";

export function BrandPanel() {
  return (
    <div className="relative hidden md:block bg-[#1c2620]">
      <Image
        src="/image/Want_to_build_your_dream_business_or_investment_property.jpg"
        alt="Construction site with blueprints"
        fill
        priority
        className="object-cover object-[50%_25%]"
      />

      {/* Green-to-black gradient overlay to match the design */}
      <div className="absolute inset-0 bg-linear-to-b from-[#2E7D4F]/40 to-black/70" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-12 text-center">
        <div className="relative h-28 w-28 overflow-hidden rounded-2xl bg-[#4a5a52] shadow-2xl shadow-black/40">
          <Image
            src="/image/Duto.jpg"
            alt="DUTO logo"
            fill
            className="object-contain p-3"
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white drop-shadow-md">
            Smart Shoring Suite
          </h1>
          <p className="max-w-sm text-sm text-white/90 drop-shadow">
            Enterprise-grade structural safety management and equipment
            logistics in one unified platform.
          </p>
        </div>
      </div>
    </div>
  );
}
