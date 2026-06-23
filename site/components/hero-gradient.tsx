export function HeroGradient() {
  return (
    <div className="hero-gradient pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="hero-gradient__base" />
      <div className="hero-gradient__blob hero-gradient__blob--1" />
      <div className="hero-gradient__blob hero-gradient__blob--2" />
      <div className="hero-gradient__blob hero-gradient__blob--3" />
      <div className="hero-gradient__vignette" />
      <div className="hero-gradient__grain" />
    </div>
  );
}
