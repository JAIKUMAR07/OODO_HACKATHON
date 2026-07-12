import React from "react";
import { X, AlertTriangle } from "lucide-react";

function ErrorPopup({ message, subMessage, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs z-50 animate-fade-in px-4">
      {/* Modal Card */}
      <div className="bg-[#1b1112] border-2 border-dashed border-red-500 text-red-300 p-6 rounded-2xl max-w-sm w-full relative shadow-2xl animate-scale-up">
        
        {/* Absolute Close X Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-red-400/50 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition-all focus:outline-none"
          title="Close notification"
        >
          <X size={15} />
        </button>

        {/* Header */}
        <h3 className="text-xs font-bold tracking-widest text-red-500 uppercase border-b border-red-500/10 pb-2.5 mb-4">
          Authentication Error
        </h3>

        {/* Content */}
        <div className="flex flex-col gap-2 text-sm leading-relaxed">
          <p className="flex items-start gap-2 font-bold">
            <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
            <span>{message}</span>
          </p>
          {subMessage && (
            <p className="text-xs opacity-75 pl-5 font-medium leading-relaxed">
              {subMessage}
            </p>
          )}
        </div>

        {/* Acknowledge Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 bg-red-950/30 hover:bg-red-900/30 border border-red-500/25 hover:border-red-500/50 text-red-300 hover:text-white rounded-xl text-xs font-bold transition-all focus:outline-none"
        >
          Acknowledge
        </button>

      </div>
    </div>
  );
}

export default ErrorPopup;
