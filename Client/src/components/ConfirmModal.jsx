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
    <div className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
      
      <div className="bg-white w-full max-w-sm p-5 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        
        <p className="text-sm text-gray-700 leading-relaxed">
          {message}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          
          <button
            className="w-full py-2.5 rounded-full text-sm font-medium bg-[#FF6B35] text-white active:scale-[0.98] transition-transform"
            onClick={onConfirm}
          >
            Yes
          </button>

          <button
            className="w-full py-2.5 rounded-full text-sm font-medium text-[#064E3B] bg-gray-100 active:scale-[0.98] transition-transform"
            onClick={onCancel}
          >
            No
          </button>

        </div>
      </div>
    </div>

    {/* ================= DESKTOP ================= */}
    <div className="hidden lg:flex fixed inset-0 bg-black/30 backdrop-blur-sm items-center justify-center z-[9999] px-4">
      
      <div className="bg-white w-full max-w-sm p-6 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:scale-[1.01] transition-transform duration-200">
        
        <p className="text-sm text-gray-700 leading-relaxed">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          
          <button
            className="px-4 py-2 rounded-full text-sm font-medium text-[#064E3B] hover:bg-gray-100 transition-colors"
            onClick={onCancel}
          >
            No
          </button>

          <button
            className="px-4 py-2 rounded-full text-sm font-medium bg-[#FF6B35] text-white hover:opacity-90 transition-all"
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

