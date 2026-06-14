import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4">
      <div className="text-center">

        {/* Browser-window illustration */}
        <div className="mx-auto mb-8 w-48 rounded-xl border border-[#e5e0d8] bg-white overflow-hidden shadow-sm">
          {/* Title bar */}
          <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-[#e5e0d8] bg-[#f7f2ea]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d8d0c4]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#d8d0c4]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#d8d0c4]" />
          </div>
          {/* Body */}
          <div className="py-6 flex flex-col items-center gap-1">
            <p className="text-4xl font-semibold text-[#1a2e1a] font-mono tracking-tight">404</p>
            <p className="text-xs text-[#a0966e]">page not found</p>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-[#1a2e1a] mb-3">
          Page not found
        </h1>
        <p className="text-sm text-[#7a6e58] max-w-xs mx-auto leading-relaxed mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg border border-[#c8bfaa] text-sm font-medium text-[#1a2e1a] bg-white hover:bg-[#f7f2ea] transition-colors"
          >
            ← Go back
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: "#008235" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#00662a")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#008235")}
          >
            Go to home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;