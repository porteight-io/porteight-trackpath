import { ButtonProps } from "@/interfaces/interface";

const Button = (props: ButtonProps) => {
  const btnVariant =
    props.variant === "primary"
      ? "bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-[0_10px_24px_rgba(245,158,11,0.25)]"
      : props.variant === "secondary"
      ? "bg-white/10 text-white border border-white/20 hover:bg-white/15"
      : "bg-white text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-sm";

  const sizeVariant = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5",
  }[props.size];

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (props.onClick) {
      props.onClick();
    }
  };

  return (
    <>
      <button
        onClick={handleSubmit}
        disabled={props.disabled}
        className={`${btnVariant} ${sizeVariant} mt-2 inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors cursor-pointer`}
      >
        {props.frontIcon} {props.text} {props.backIcon}
      </button>
    </>
  );
};

export default Button;