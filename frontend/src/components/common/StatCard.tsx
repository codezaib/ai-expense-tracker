import { clsx } from "clsx";

const StatCard = ({
  icon: Icon,
  heading,
  text,
  subtext,
  glowColor,
  isGlowVisible = false,
}: any) => {
  return (
    <div className="bg-surface border border-app rounded-3xl p-6 relative overflow-hidden group transition-all duration-500 hover:border-app-hover">
      {/* Glow */}
      <div
        className={clsx(
          "absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl transition-opacity duration-500",
          glowColor,
          isGlowVisible ? "opacity-20" : "opacity-0 group-hover:opacity-20",
        )}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div
            className={clsx(
              "p-3 rounded-2xl bg-opacity-10 border border-current/10 transition-colors duration-500",
            )}
          >
            <Icon
              className={clsx("w-6 h-6", glowColor?.replace("bg-", "text-"))}
            />
          </div>
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-app mb-1">
          {heading}
        </p>

        <h3 className="text-2xl font-black tracking-tight">{text}</h3>

        <p
          className={clsx(
            "text-[10px] mt-2 font-bold uppercase flex items-center gap-1.5 leading-none transition-colors",
            subtext.includes("-") ? "text-danger" : "text-success",
          )}
        >
          {subtext}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
