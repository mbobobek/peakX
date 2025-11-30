export default function DashboardHeader({ user }) {
  return (
    <header className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">Dashboard</p>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-600">{user?.email ? user.email : 'Guest user'}</p>
    </header>
  );
}
