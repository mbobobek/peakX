export default function ResetPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">PeakX</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Parolni tiklash</h1>
          <p className="mt-2 text-sm text-slate-600">Emailingizni kiriting, biz tiklash havolasini yuboramiz.</p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Havola yuborish
          </button>
        </form>

      </div>
    </div>
  );
}
