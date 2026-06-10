import { ReactNode } from "react";

interface Props {
  text: string;
  icon?: ReactNode;
  variant?: "outline" | "yellow" | "white";
}

export default function ActionButton({
  text,
  icon,
  variant = "outline",
}: Props) {
  const styles = {
    outline:
      "border border-white/40 bg-transparent text-white hover:bg-white/10",

    yellow:
      "bg-[#f0b42a] text-black hover:bg-[#f5bd3c]",

    white:
      "bg-white text-black hover:bg-slate-100",
  };

  return (
    <button
      className={`flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-all ${styles[variant]}`}
    >
      {icon}
      {text}
    </button>
  );
}