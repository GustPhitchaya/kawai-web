/**
 * The one keyboard on the page — the nav.
 *
 * Scrolling plays notes, but the keys that show it live in the header, so the
 * scroll engine publishes strikes here and <Nav> renders them. Keeping this in
 * a rune store rather than a prop chain is what lets the two live apart.
 */
class Keyboard {
  /** Nav key index most recently struck, or -1. */
  lit = $state(-1)
  /** Bumped on every strike so repeats on the same key still register. */
  seq = $state(0)
  /** How hard it was struck, 0–1. */
  amp = $state(0)

  #clear: ReturnType<typeof setTimeout> | null = null

  strike(index: number, amp = 1): void {
    this.lit = index
    this.amp = amp
    this.seq++
    if (this.#clear) clearTimeout(this.#clear)
    this.#clear = setTimeout(() => { this.lit = -1 }, 190)
  }
}

export const keyboard = new Keyboard()
