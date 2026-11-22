import { toast } from "sonner";

// ==========================================
// CONFIRM WITH A TOAST
// ==========================================
// Shows a toast with "Delete" and "Cancel" buttons instead of the
// browser's window.confirm(). onConfirm runs only when the user
// clicks the confirm button.

export function confirmToast(
  message: string,
  onConfirm: () => void,
  confirmLabel = "Delete"
) {
  toast.warning(message, {
    description: "This cannot be undone.",
    duration: 10000,
    action: {
      label: confirmLabel,
      onClick: onConfirm,
    },
    cancel: {
      label: "Cancel",
      onClick: () => {},
    },
  });
}
