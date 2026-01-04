const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">

      {/* Hero content area */}
      <div className="h-[76vh] flex items-center">
        <div className="ml-[15%] max-w-140 z-10">
          <h1 className="text-[64px] leading-[1.1] font-semibold text-black">
            Build Backends.
            <br />
            Drag. Drop.
            <br />
            Deploy.
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-115">
            Dragend lets you create production-ready backends using a visual
            drag-and-drop workflow. No boilerplate. No setup hell. Just ship.
          </p>
        </div>
      </div>

      {/* Viewport fade (fills remaining space) */}
     <div
  className="pointer-events-none absolute bottom-0 left-0 w-full h-[28vh]
    bg-linear-to-t
    from-white/90
    via-white/60
    to-transparent"
/>
    </section>
  );
};

export default HeroSection;
