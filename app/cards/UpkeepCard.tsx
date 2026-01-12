import ReactLenis from "lenis/react";

type Town = {
  name: string;
  bank: number;
  upkeep: number;
  days: number;
};
type UpkeepCardProps = {
  title: string;
  subtitle: string;
  towns: Town[];
  accent?: string;
};

export default function UpkeepCard({
  title,
  subtitle,
  towns,
  accent = "blue",
}: UpkeepCardProps) {
  return (
    <div
      className="
        group
        rounded-3xl
        border border-black/10
        bg-white/80 backdrop-blur-xl
        px-8 py-10
        shadow-xl
        transition-all duration-300
        hover:shadow-2xl hover:-translate-y-1
      "
    >
      {/* Badge */}
      <div
        className={`
          inline-block mb-4 rounded-full
          px-4 py-1 text-sm font-medium
          bg-${accent}-500/10 text-${accent}-600
        `}
      >
        {towns.length} Towns
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-black tracking-tight">
        {title}
      </h2>

      <p className="mt-1 text-sm text-black/60">{subtitle}</p>

      {/* Town List */}

      <div className="mt-6 max-h-56 overflow-y-auto text-left">
        <ReactLenis
          root
          options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}
        >
          {towns.length === 0 ? (
            <p className="text-sm text-black/50 text-center">
              No towns falling.
            </p>
          ) : (
            <ul className="space-y-2">
              {towns.map((town) => (
                <li
                  key={town.name}
                  className="
                  flex items-center justify-between
                  rounded-xl
                  border border-black/5
                  bg-black/5
                  px-4 py-2
                  text-sm
                "
                >
                  <span className="font-medium text-black">{town.name}</span>
                  <span className="text-black/60">
                    ${town.bank.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </ReactLenis>
      </div>

      <div className="mt-6 h-px w-full bg-linear-to-r from-transparent via-black/20 to-transparent" />

      <p className="mt-4 text-xs text-black/40 text-center">CCNet Stalker</p>
    </div>
  );
}
