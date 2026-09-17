// Small, consistent line-icon set (24x24, currentColor, 1.75 stroke) used in place of emoji
// throughout the site, so every glyph shares one visual language.
import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function LogoMark(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <circle cx="5.5" cy="18" r="1.9" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="6" r="1.9" fill="currentColor" stroke="none" />
      <path d="M7 16.7C9.5 13 11.5 10.8 17 6.8" strokeDasharray="0.2 3.4" />
    </svg>
  );
}
export function IconSearch(props: IconProps) { return <svg {...base} {...props}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.3-4.3" /></svg>; }
export function IconSwap(props: IconProps) { return <svg {...base} {...props}><path d="M7 8h11l-3.5-3.5" /><path d="M17 16H6l3.5 3.5" /></svg>; }
export function IconSun(props: IconProps) { return <svg {...base} {...props}><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>; }
export function IconMoon(props: IconProps) { return <svg {...base} {...props}><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" /></svg>; }
export function IconMenu(props: IconProps) { return <svg {...base} {...props}><path d="M4 7h16M4 12h16M4 17h16" /></svg>; }
export function IconClose(props: IconProps) { return <svg {...base} {...props}><path d="M6 6l12 12M18 6L6 18" /></svg>; }
export function IconPin(props: IconProps) { return <svg {...base} {...props}><path d="M12 21s-6.5-5.8-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.2-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.2" /></svg>; }
export function IconShield(props: IconProps) { return <svg {...base} {...props}><path d="M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6l7-3Z" /><path d="M9 12l2 2 4-4" /></svg>; }
export function IconLeaf(props: IconProps) { return <svg {...base} {...props}><path d="M20 4c0 9-5 15-15 15C5 10 11 4 20 4Z" /><path d="M6 19c3-4 6-7 12-12" /></svg>; }
export function IconCoin(props: IconProps) { return <svg {...base} {...props}><circle cx="12" cy="12" r="8.5" /><path d="M9.5 9.2c0-1 1-1.7 2.5-1.7s2.5.8 2.5 1.7c0 2.2-5 1.3-5 3.6 0 1 1 1.7 2.5 1.7s2.5-.7 2.5-1.7M12 6.3v1.2M12 16.5v1.2" /></svg>; }
export function IconPaw(props: IconProps) { return <svg {...base} {...props}><circle cx="7" cy="9.5" r="1.6" /><circle cx="12" cy="7" r="1.6" /><circle cx="17" cy="9.5" r="1.6" /><path d="M12 12.2c2.6 0 5 1.9 5 4.3 0 1.4-1.2 2.2-2.7 1.7l-1-.4a4 4 0 0 0-2.6 0l-1 .4c-1.5.5-2.7-.3-2.7-1.7 0-2.4 2.4-4.3 5-4.3Z" /></svg>; }
export function IconNoSmoking(props: IconProps) { return <svg {...base} {...props}><path d="M3 15h11M14 12h4M21 12v3M21 13.5H18" /><path d="M4 4l16 16" /></svg>; }
export function IconChevronRight(props: IconProps) { return <svg {...base} {...props}><path d="M9 6l6 6-6 6" /></svg>; }
export function IconStar(props: IconProps) { return <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6-4.9-4.6 6.6-.7L12 2.5Z" /></svg>; }
export function IconRoute(props: IconProps) { return <svg {...base} {...props}><circle cx="5" cy="6" r="2" /><circle cx="19" cy="18" r="2" /><path d="M5 8v3a4 4 0 0 0 4 4h6a4 4 0 0 1 4 3" /></svg>; }
export function IconLock(props: IconProps) { return <svg {...base} {...props}><rect x="5" y="10.5" width="14" height="9.5" rx="2.2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></svg>; }
