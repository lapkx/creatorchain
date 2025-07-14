// Reusable Button component 
export default function Button({ children, onClick, variant = "primary", className = "" }) {
    const base = "px-6 py-2 rounded-lg font-semibold transition";
    const variants = {
      primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
      outline: "border border-white text-white hover:bg-white hover:text-indigo-700",
    };
  
    return (
      <button
        onClick={onClick}
        className={`${base} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  }
  