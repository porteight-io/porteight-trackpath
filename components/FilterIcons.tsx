/**
 * Filter-bar glyphs from the reference toolbar. The first two are their own
 * assets; the rest are Material icons, which MUI renders at fontSizeMedium
 * = 1.5rem (21px at their 14px root) and fontSizeSmall = 1.25rem (17.5px).
 */

type IconProps = {
  size?: number;
  className?: string;
  color?: string;
};

const base = (size: number, viewBox: string) => ({
  width: size,
  height: size,
  viewBox,
  fill: "none" as const,
  xmlns: "http://www.w3.org/2000/svg",
  focusable: false as const,
  "aria-hidden": true,
});

/** Submit's end icon: a rounded square with a check breaking out of it. */
export function SubmitIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size, "0 0 22 22")} className={className}>
      <path
        d="M11 2.59961C11.2827 2.59961 11.5539 2.71227 11.7539 2.91211C11.9539 3.11215 12.0664 3.38409 12.0664 3.66699C12.0663 3.94977 11.9539 4.22094 11.7539 4.4209C11.5539 4.62084 11.2828 4.7334 11 4.7334H6.41699C5.97054 4.7334 5.54225 4.91088 5.22656 5.22656C4.91088 5.54225 4.7334 5.97054 4.7334 6.41699V15.583C4.7334 16.0295 4.91088 16.4578 5.22656 16.7734C5.54225 17.0891 5.97054 17.2666 6.41699 17.2666H15.583C16.0295 17.2666 16.4578 17.0891 16.7734 16.7734C17.0891 16.4578 17.2666 16.0295 17.2666 15.583V11.1377C17.2666 10.8548 17.3791 10.5829 17.5791 10.3828C17.779 10.183 18.0503 10.0714 18.333 10.0713C18.6159 10.0713 18.8879 10.1828 19.0879 10.3828C19.2879 10.5829 19.4004 10.8548 19.4004 11.1377V15.583C19.4004 16.5953 18.998 17.5665 18.2822 18.2822C17.5665 18.998 16.5953 19.4004 15.583 19.4004H6.41699C5.40475 19.4004 4.43354 18.998 3.71777 18.2822C3.00201 17.5665 2.59961 16.5953 2.59961 15.583V6.41699C2.59961 5.40475 3.00201 4.43354 3.71777 3.71777C4.43354 3.00201 5.40475 2.59961 6.41699 2.59961H11Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.3"
      />
      <path
        d="M19.249 3.5127C19.5328 3.5127 19.8051 3.62564 20.0059 3.82617C20.2066 4.02691 20.3193 4.30009 20.3193 4.58398C20.3192 4.8677 20.2065 5.14019 20.0059 5.34082L11.7559 13.5908C11.6569 13.6904 11.5388 13.7692 11.4092 13.8232C11.2792 13.8774 11.1398 13.9053 10.999 13.9053C10.8583 13.9053 10.7188 13.8774 10.5889 13.8232C10.459 13.7691 10.3413 13.6897 10.2422 13.5898L6.5752 9.92383C6.47588 9.82447 6.39751 9.70597 6.34375 9.57617C6.29003 9.44641 6.26174 9.30744 6.26172 9.16699C6.26172 8.88325 6.37466 8.61087 6.5752 8.41016C6.77594 8.20941 7.04912 8.09668 7.33301 8.09668C7.61673 8.09681 7.88921 8.20953 8.08984 8.41016L10.998 11.3281L14.6924 7.63086L18.4922 3.82715V3.82617C18.6929 3.62557 18.9653 3.51274 19.249 3.5127Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.3"
      />
    </svg>
  );
}

/** Download's end icon (their own asset, 18px, no viewBox in the original). */
export function DownloadIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size, "0 0 18 18")} className={className}>
      <g fill="currentColor">
        <path d="M8.983 17.997H4.599c-2.004-.004-3.45-1.442-3.46-3.446q-.004-1.05 0-2.098c.004-.721.44-1.185 1.111-1.189.672-.003 1.111.46 1.118 1.181.004.71-.003 1.424.004 2.138.007.745.443 1.181 1.195 1.181h8.884c.749 0 1.188-.436 1.195-1.181.004-.71-.003-1.424.004-2.138.003-.72.443-1.18 1.114-1.18.672 0 1.115.463 1.108 1.188-.007.91.042 1.831-.07 2.728-.212 1.645-1.61 2.805-3.277 2.812-1.519.01-3.03.004-4.542.004" />
        <path d="M10.117 8.537c.168-.158.27-.246.362-.337.714-.721 1.42-1.445 2.137-2.16.51-.509 1.217-.544 1.674-.101s.44 1.174-.06 1.68a1292 1292 0 0 1-4.377 4.377c-.517.514-1.188.514-1.701 0A866 866 0 0 1 3.75 7.595c-.482-.485-.485-1.217-.035-1.653s1.16-.414 1.649.07c.727.725 1.441 1.46 2.162 2.188.091.094.193.182.34.32.011-.201.022-.331.022-.465 0-2.299-.004-4.602.003-6.9.004-.866.76-1.379 1.55-1.07.437.17.676.549.676 1.104q.005 3.412 0 6.828z" />
      </g>
    </svg>
  );
}

/** Material CloseIcon — the Autocomplete clear indicator. */
export function ClearIcon({ size = 17.5, className }: IconProps) {
  return (
    <svg {...base(size, "0 0 24 24")} className={className}>
      <path
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Material ArrowDropDownIcon — the Autocomplete popup indicator. */
export function ArrowDropDownIcon({ size = 21, className }: IconProps) {
  return (
    <svg {...base(size, "0 0 24 24")} className={className}>
      <path d="M7 10l5 5 5-5z" fill="currentColor" />
    </svg>
  );
}

/** Material DateRangeIcon. */
export function DateRangeIcon({ size = 21, className }: IconProps) {
  return (
    <svg {...base(size, "0 0 24 24")} className={className}>
      <path
        d="M9 11H7v2h2zm4 0h-2v2h2zm4 0h-2v2h2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 16H5V9h14z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Material AccessTimeFilledIcon — used on both time fields. */
export function AccessTimeFilledIcon({ size = 21, className }: IconProps) {
  return (
    <svg {...base(size, "0 0 24 24")} className={className}>
      <path
        d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2m3.3 14.71L11 12.41V7h2v4.59l3.71 3.71z"
        fill="currentColor"
      />
    </svg>
  );
}
