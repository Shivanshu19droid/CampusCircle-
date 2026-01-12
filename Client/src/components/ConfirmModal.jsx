import { useEffect } from "react";

function ConfirmModal({
  isOpen,
  message = "Are you sure you want to perform this action ? This cannot be undone!",
  onConfirm,
  onCancel,
  title="confirmation"
}) {
  if (!isOpen) {
    return null;
  }


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      {/* White box */}
      <div className="bg-white p-5 rounded-lg shadow-lg w-[300px]">
        <p className="text-sm text-gray-700">{message}</p>

        <div className="mt-4 flex justify-end gap-3">
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onCancel}
          >
            No
          </button>

          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
