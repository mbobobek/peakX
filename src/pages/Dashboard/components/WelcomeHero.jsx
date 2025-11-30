import { useAuth } from '../../../context/AuthContext';

export default function WelcomeHero({ streak }) {
  const { user } = useAuth();
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className="
        w-full mx-auto 
        rounded-3xl 
        bg-gradient-to-br from-[#7A5CFF] via-[#9F74FF] to-[#B388FF]
        text-white 
        shadow-xl 
        p-4                 /* MOBILE ONLY FIX */
        min-h-[220px]       /* MOBILE ONLY FIX */
        md:p-10 
        md:min-h-[300px]
      "
    >
      <div className="text-xs tracking-[0.15em] opacity-80 mb-2">
        DASHBOARD
      </div>

      <h1 className="font-bold text-xl leading-tight md:text-3xl">
        Welcome back, {user?.email?.split('@')[0] || 'Guest'}!
      </h1>

      <p className="mt-1 text-sm opacity-90 md:text-base">
        {formattedDate}
      </p>

      <p className="mt-3 text-xs leading-relaxed max-w-[250px] opacity-90 md:text-sm md:max-w-md">
        You're on your way to building consistent habits. Focus on today’s tasks and keep your streak alive.
      </p>

      <div
        className="
          mt-4 
          inline-flex 
          items-center 
          gap-2 
          rounded-2xl 
          bg-white/25 
          backdrop-blur-sm 
          px-3 py-1           /* MOBILE SMALLER BADGE */
          shadow-inner
          md:px-5 md:py-3
        "
      >
        <span className="text-base font-bold md:text-xl">
          {streak || 0} days
        </span>
        <span className="text-lg md:text-2xl">🔥</span>
      </div>
    </div>
  );
}
