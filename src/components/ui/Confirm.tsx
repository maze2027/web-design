/** Visible marker for unverified content. Search the codebase for "[CONFIRM]" before launch. */
export function ConfirmBadge({ label = "Confirm" }: { label?: string }) {
  return (
    <span className="confirm-badge" title="[CONFIRM] Placeholder: verify before launch">
      <span aria-hidden="true">⚑</span> [CONFIRM] {label}
    </span>
  );
}
