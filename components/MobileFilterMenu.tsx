"use client";

import { Check, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";

type FilterOption = {
  value: string;
  label: string;
};

type MobileFilterMenuProps = {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
};

export default function MobileFilterMenu({
  id,
  label,
  value,
  options,
  onChange,
}: MobileFilterMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  const closeAndRestoreFocus = () => {
    setIsOpen(false);
    window.requestAnimationFrame(() => {
      triggerRef.current?.focus({ preventScroll: true });
    });
  };

  return (
    <div className="mt-4 sm:hidden">
      <p
        id={`${id}-label`}
        className="mb-2 text-xs font-bold uppercase tracking-wide text-slate"
      >
        {label}
      </p>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={`${id}-options`}
        aria-labelledby={`${id}-label ${id}-value`}
        onClick={() => setIsOpen((current) => !current)}
        className="secondary-button w-full justify-between gap-3 px-4 py-3 text-left"
      >
        <span id={`${id}-value`} className="min-w-0 break-words">
          {selectedOption?.label}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-tealDark transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          id={`${id}-options`}
          role="group"
          aria-labelledby={`${id}-label`}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              closeAndRestoreFocus();
            }
          }}
          className="mt-2 grid max-h-72 gap-2 overflow-y-auto rounded-3xl border border-line bg-paper p-3 shadow-soft"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  onChange(option.value);
                  closeAndRestoreFocus();
                }}
                className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-full border px-4 py-2.5 text-left text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/60 ${
                  isSelected
                    ? "border-blue bg-blue text-white shadow-soft"
                    : "border-line bg-white text-blue hover:border-tealDark hover:text-tealDark"
                }`}
              >
                <span className="min-w-0 break-words">{option.label}</span>
                {isSelected ? (
                  <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
