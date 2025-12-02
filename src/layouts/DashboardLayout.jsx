import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef1ff] to-[#f4f6ff] text-slate-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-4">
        {children}
      </div>
    </div>
  );
}
