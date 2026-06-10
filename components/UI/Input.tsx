import { InputProps } from "@/interfaces/interface";

export const inputVariants =
  "w-full min-w-0 border border-slate-200 outline-none rounded-xl px-3 py-2.5 mt-1.5 bg-white text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20";

export const Input = (props: InputProps) => {
  return (
    <>
      <input
        required
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
        type={props.type}
        placeholder={props.placeholder}
        className={inputVariants}
      />
    </>
  );
};