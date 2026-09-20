/**
 * The inline SVG symbol sprite, rendered once in the root layout.
 * `<Icon name="pin" />` references these through `<use href="#i-pin">`.
 */
export function IconSprite() {
  return (
    <svg
      className="absolute h-0 w-0 overflow-hidden"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <symbol id="i-line" viewBox="0 0 24 24" className="stroked">
          <path d="M12 4.2c-4.5 0-8.1 2.9-8.1 6.4 0 3.1 2.7 5.7 6.5 6.3l-.5 2.9c-.1.4.3.7.6.5l4.3-2.6c3.2-1 5.3-3.4 5.3-6.1 0-3.5-3.6-6.4-8.1-6.4z" />
          <path d="M9 10.4v3.2M12 10.4v3.2M15 10.4v3.2" />
        </symbol>
        <symbol id="i-fb" viewBox="0 0 24 24">
          <path d="M13.4 21v-8h2.6l.4-3h-3V8.1c0-.9.2-1.5 1.5-1.5h1.6V3.9c-.3 0-1.2-.1-2.3-.1-2.4 0-4 1.4-4 4.1V10H7.6v3h2.6v8h3.2z" />
        </symbol>
        <symbol id="i-ig" viewBox="0 0 24 24" className="stroked">
          <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="5" />
          <circle cx="12" cy="12" r="3.7" />
          <circle cx="17.1" cy="6.9" r="1.05" fill="currentColor" stroke="none" />
        </symbol>
        <symbol id="i-phone" viewBox="0 0 24 24" className="stroked">
          <path d="M6.7 3.4h2.2l1.5 3.8-1.9 1.2a12 12 0 0 0 5.1 5.1l1.2-1.9 3.8 1.5v2.2a2.5 2.5 0 0 1-2.7 2.5A15.1 15.1 0 0 1 4.2 6.1a2.5 2.5 0 0 1 2.5-2.7z" />
        </symbol>
        <symbol id="i-mail" viewBox="0 0 24 24" className="stroked">
          <rect x="3.4" y="5.6" width="17.2" height="12.8" rx="2.6" />
          <path d="M4.2 7.4 12 12.9l7.8-5.5" />
        </symbol>
        <symbol id="i-pin" viewBox="0 0 24 24" className="stroked">
          <path d="M12 20.6s6.3-5.9 6.3-10.2a6.3 6.3 0 1 0-12.6 0c0 4.3 6.3 10.2 6.3 10.2z" />
          <circle cx="12" cy="10.2" r="2.4" />
        </symbol>
      </defs>
    </svg>
  );
}
