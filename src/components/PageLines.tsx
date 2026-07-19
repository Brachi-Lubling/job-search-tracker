/**
 * Subtle straight background lines in the page's PRIMARY color.
 *
 * Place it as a child of the page's root container (the element that sets
 * `--page-accent`). It renders a fixed, full-viewport layer that inherits the
 * accent and sits behind all content. Purely decorative.
 */
export function PageLines() {
  return <div className="page-lines" aria-hidden="true" />;
}
