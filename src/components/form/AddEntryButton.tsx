interface AddEntryButtonProps {
  type?: "button" | "submit" | "reset";
  label: string;
  onClick: () => void;
}

export function AddEntryButton({ type = "button", label, onClick }: Readonly<AddEntryButtonProps>) {
  return (
    <button
        type={type}
        onClick={() => onClick()}
        className="text-xs px-2 py-1 bg-[var(--color-brand-blue-super-light)] text-[var(--color-brand-blue-super-dark)] rounded hover:bg-[var(--color-brand-blue-light)] hover:cursor-pointer"
      >
        {label}
      </button>
  );
}
