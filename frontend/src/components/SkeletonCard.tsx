export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col h-full animate-pulse">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-slate-200 rounded-md w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
        </div>
        <div className="h-6 bg-slate-200 rounded-full w-24"></div>
      </div>

      <div className="mt-4">
        <div className="h-5 bg-slate-200 rounded-full w-20"></div>
      </div>

      <div className="mt-4 space-y-2 flex-1">
        <div className="h-4 bg-slate-200 rounded-md w-full"></div>
        <div className="h-4 bg-slate-200 rounded-md w-full"></div>
        <div className="h-4 bg-slate-200 rounded-md w-5/6"></div>
      </div>

      <div className="mt-6">
        <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
      </div>
    </div>
  );
}
