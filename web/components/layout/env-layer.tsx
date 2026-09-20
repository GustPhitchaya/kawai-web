/**
 * The fixed ambient layer behind everything: a slowly drifting red glow
 * and five staff rules that float past the middle of the viewport.
 * Pure CSS, so this stays a server component.
 */
export function EnvLayer() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="env-glow" />
      <div className="env-rules">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
