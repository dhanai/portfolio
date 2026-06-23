export function HeroPortrait() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-[2] overflow-hidden lg:hidden"
        aria-hidden="true"
      >
        <div className="hero-portrait-mobile" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[5] hidden overflow-visible lg:block"
        aria-hidden="true"
      >
        <div className="hero-portrait">
          <div className="hero-portrait__glow" />
        </div>
      </div>
    </>
  );
}
