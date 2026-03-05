import { createPortal } from "react-dom";

function ConfirmModal({
  isOpen,
  message = "Are you sure you want to perform this action? This cannot be undone!",
  onConfirm,
  onCancel,
  title = "Confirmation",
}) {
  if (!isOpen) return null;

  return createPortal(
  <>
    {/* ================= MOBILE ================= */}
    <div className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
      
      <div className="bg-white w-full max-w-md p-7 rounded-2xl shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.1)]">
        
        <p className="text-base text-slate-700 leading-relaxed">
          {message}
        </p>

        <div className="mt-8 flex flex-col gap-4">
          
          <button
            className="
              w-full py-3
              rounded-lg
              text-sm font-semibold
              text-white
              bg-gradient-to-b from-indigo-900 to-indigo-800
              hover:from-indigo-800 hover:to-indigo-700
              transition-all duration-200
            "
            onClick={onConfirm}
          >
            Yes
          </button>

          <button
            className="
              w-full py-3
              rounded-lg
              text-sm font-medium
              text-slate-600
              border border-slate-200
              hover:bg-slate-50
              transition-all duration-200
            "
            onClick={onCancel}
          >
            No
          </button>

        </div>
      </div>
    </div>

    {/* ================= DESKTOP ================= */}
    <div className="hidden lg:flex fixed inset-0 bg-black/40 backdrop-blur-sm items-center justify-center z-[9999] px-4">
      
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.1)]">
        
        <p className="text-base text-slate-700 leading-relaxed">
          {message}
        </p>

        <div className="mt-8 flex justify-end gap-4">
          
          <button
            className="
              px-5 py-2.5
              rounded-lg
              text-sm font-medium
              text-slate-600
              border border-slate-200
              hover:bg-slate-50
              transition-all duration-200
            "
            onClick={onCancel}
          >
            No
          </button>

          <button
            className="
              px-5 py-2.5
              rounded-lg
              text-sm font-semibold
              text-white
              bg-gradient-to-b from-indigo-900 to-indigo-800
              hover:from-indigo-800 hover:to-indigo-700
              transition-all duration-200
            "
            onClick={onConfirm}
          >
            Yes
          </button>

        </div>

      </div>
    </div>
  </>,
  document.body
);

}

export default ConfirmModal;

