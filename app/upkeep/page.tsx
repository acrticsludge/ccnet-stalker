export default function Upkeep() {
  return (
    <div>
      <div className="flex items-center justify-center">
        <div
          className="
          rounded-3xl
          border border-black/10
          bg-white/80 backdrop-blur-xl
          px-10 py-12
          shadow-2xl
          text-center
        "
        >
          <div className="inline-block mb-4 rounded-full border border-black/10 bg-black/5 px-4 py-1 text-sm text-black/70">
            Under Development
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold text-black tracking-tight">
            Coming Soon
          </h1>

          <p className="mt-4 max-w-md text-black/70">
            CCNet upkeep tracking, alerts, and live nation data — all in one
            clean dashboard.
          </p>

          <div className="my-8 h-px w-full bg-linear-to-r from-transparent via-black/20 to-transparent" />

          <p className="text-sm text-black/50">Stay tuned 🚀</p>
        </div>
      </div>
    </div>
  );
}
