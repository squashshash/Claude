export function AmbientGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -right-32 -top-40 h-[32rem] w-[32rem] rounded-full bg-primary/25 blur-3xl [animation:float-slow_22s_ease-in-out_infinite]" />
      <div className="absolute -bottom-48 -left-24 h-[28rem] w-[28rem] rounded-full bg-accent/30 blur-3xl [animation:float-slow_26s_ease-in-out_infinite_reverse]" />
      <div className="absolute left-1/3 top-1/2 h-96 w-96 rounded-full bg-primary/10 blur-3xl [animation:float-slow_30s_ease-in-out_infinite]" />
    </div>
  );
}
