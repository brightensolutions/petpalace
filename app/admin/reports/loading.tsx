export default function ReportsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-slate-200 rounded-lg w-1/3" />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-lg" />
          ))}
        </div>
        <div className="h-96 bg-slate-200 rounded-lg" />
      </div>
    </div>
  );
}
