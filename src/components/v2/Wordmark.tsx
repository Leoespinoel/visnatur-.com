/** VIS NATUR + a red Æ, set in the condensed V2 headline face. */
export function V2Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`v2-display whitespace-nowrap ${className}`}>
      Vis Natur<span className="text-red">Æ</span>
    </span>
  );
}
