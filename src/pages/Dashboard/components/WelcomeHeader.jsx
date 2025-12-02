import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function WelcomeHeader({ displayName, readableDate }) {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-[#a074ff] via-[#8a8dff] to-[#6ca8ff] shadow-[0px_10px_35px_rgba(0,0,0,0.10)] backdrop-blur-2xl border border-white/20 text-white px-8 md:px-10 py-8">
      
      <p className="text-xs md:text-sm font-semibold opacity-95">{readableDate}</p>

      <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
        Welcome back, {displayName}
      </h1>

      <div className="mt-3 flex items-start gap-2.5 text-xs md:text-sm font-semibold opacity-95 leading-snug">
        <InformationCircleIcon className="h-5 w-5 mt-1 flex-shrink-0 text-white/90" />
        <div className="space-y-1">
          <p>PeakX helps you track habits, goals and personal growth.</p>
          <p>Stay consistent and unlock your full potential.</p>
        </div>
      </div>
    </div>
  );
}
