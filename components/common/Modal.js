// Reusable Modal component 
export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white text-black p-6 rounded-xl max-w-lg w-full shadow-xl relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-4 text-lg font-bold"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  }
  