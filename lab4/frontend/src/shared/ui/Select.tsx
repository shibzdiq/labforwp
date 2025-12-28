import React from "react";

type Props = {
  label?: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
};

export default function Select({ label, value, onChange, children }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm opacity-80">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className="px-3 py-2 border border-gray-700 rounded-lg bg-black/40 text-white"
      >
        {children}
      </select>
    </div>
  );
}
