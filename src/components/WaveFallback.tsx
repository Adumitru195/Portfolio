/**
 * Static stand-in for the wireframe wave when WebGL isn't available: a faint
 * indigo grid laid back in perspective, fading out at both ends. Purely
 * decorative and motionless.
 */
export default function WaveFallback({ opacity = 0.3 }: { opacity?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute inset-x-[-30%] top-[-45%] h-[120%] [transform:perspective(1100px)_rotateX(52deg)] [transform-origin:50%_100%] [background-image:linear-gradient(to_right,#4F46E5_1px,transparent_1px),linear-gradient(to_bottom,#4F46E5_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_top,transparent_0%,black_30%,black_75%,transparent_100%)]"
        style={{ opacity }}
      />
    </div>
  )
}
