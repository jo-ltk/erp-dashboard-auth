import ErpMark from './ErpMark'

/**
 * Product lockup: rounded gradient tile + wordmark.
 *
 * `tone` only picks the surface it sits on — `brand` for the gradient panel,
 * `ink` for light chrome — so the mark stays identical across screens.
 */
export default function BrandLockup({
  tone = 'ink',
  className = '',
  size = 'md',
}: {
  tone?: 'ink' | 'brand'
  className?: string
  size?: 'sm' | 'md'
}) {
  const isBrand = tone === 'brand'
  const tile = size === 'sm' ? 'h-9 w-9 rounded-2xl p-1.5' : 'h-10 w-10 rounded-2xl p-2'

  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span
        className={
          isBrand
            ? `flex items-center justify-center border border-chalk/30 bg-chalk/20 text-chalk backdrop-blur ${tile}`
            : `brand-tile flex items-center justify-center ${tile}`
        }
      >
        <ErpMark className="h-full w-full" />
      </span>
      <span className="flex items-baseline gap-0.5">
        <span className={`display ${size === 'sm' ? 'text-lg' : 'text-xl'} ${isBrand ? 'text-chalk' : 'text-ink'}`}>
          Naari
        </span>
        <span className={`font-semibold ${size === 'sm' ? 'text-xs' : 'text-sm'} ${isBrand ? 'text-chalk/70' : 'text-accent-strong'}`}>
          .health
        </span>
      </span>
    </span>
  )
}
