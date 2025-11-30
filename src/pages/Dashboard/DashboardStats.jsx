export default function DashboardStats() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Your Stats</h2>
        <span className="text-xs font-medium text-slate-500">Preview</span>
      </div>
      <p className="mt-2 text-sm text-slate-600">Streak and success rate will appear here.</p>
    </div>
  );
}
