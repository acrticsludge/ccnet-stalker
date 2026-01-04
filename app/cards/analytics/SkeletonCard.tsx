export default function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-black/10 bg-white/60 px-6 py-6 shadow-xl animate-pulse">
      <div className="h-3 w-24 bg-black/10 rounded mb-3" />
      <div className="h-7 w-32 bg-black/20 rounded mb-2" />
      <div className="h-4 w-20 bg-black/10 rounded" />
    </div>
  );
}
