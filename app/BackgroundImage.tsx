export default function BackgroundImage() {
  return (
    <div>
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/Background.png')" }}
        />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-black/80 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-black/80 to-transparent" />

          <div className="absolute top-0 bottom-0 left-0 w-24 bg-linear-to-r from-black/80 to-transparent" />

          <div className="absolute top-0 bottom-0 right-0 w-24 bg-linear-to-l from-black/80 to-transparent" />
        </div>
      </div>
    </div>
  );
}
