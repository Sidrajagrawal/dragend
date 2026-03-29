import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CARD_PALETTES = [
  { bg: "#dbeafe", accent: "#3b82f6" },
  { bg: "#ede9fe", accent: "#8b5cf6" },
  { bg: "#fce7f3", accent: "#ec4899" },
  { bg: "#d1fae5", accent: "#10b981" },
  { bg: "#fef3c7", accent: "#f59e0b" },
  { bg: "#fee2e2", accent: "#ef4444" },
];

function timeAgo(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const ProjectCard = ({ project, index = 0, isLatest = false, readonly = false }) => {
  const navigate = useNavigate();
  const palette    = CARD_PALETTES[index % CARD_PALETTES.length];
  const nodeCount  = project.canvasState?.nodes?.length ?? 0;
  const edgeCount  = project.canvasState?.edges?.length ?? 0;
  const dbTypes    = [...new Set(project.databaseIds.map((d) => d.type).filter(Boolean))];
  const updatedAgo = timeAgo(project.updatedAt);

  const handleClick = () => {
    if (readonly) return;
    navigate(`/${project._id}/workflow`);
  };

  return (
    <motion.div
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={!readonly ? { y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.10)" } : {}}
      className={`rounded-2xl border border-gray-100 bg-white overflow-hidden ${readonly ? "cursor-default" : "cursor-pointer"}`}
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
    >
      {/* ── Preview area ─────────────────────────────────────────────────── */}
      <div
        className="h-40 w-full relative flex items-center justify-center overflow-hidden"
        style={{ background: palette.bg }}
      >
        {/* blobs */}
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-30 blur-2xl"
          style={{ background: palette.accent }} />
        <div className="absolute bottom-0 left-4 w-20 h-20 rounded-full opacity-20 blur-xl"
          style={{ background: palette.accent }} />

        {/* node/edge mini-badge */}
        {nodeCount > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            <span className="px-2 py-0.5 rounded-md text-xs font-medium"
              style={{ background: "rgba(255,255,255,0.75)", color: palette.accent, backdropFilter: "blur(4px)" }}>
              {nodeCount} table{nodeCount !== 1 ? "s" : ""}
            </span>
            {edgeCount > 0 && (
              <span className="px-2 py-0.5 rounded-md text-xs font-medium"
                style={{ background: "rgba(255,255,255,0.75)", color: palette.accent, backdropFilter: "blur(4px)" }}>
                {edgeCount} edge{edgeCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {/* "Recently active" pulse marker */}
        {isLatest && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(4px)" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: "#22c55e" }} />
              <span className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: "#22c55e" }} />
            </span>
            <span className="text-xs font-semibold" style={{ color: "#15803d" }}>Latest</span>
          </div>
        )}
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-base leading-snug">{project.name}</h3>
          {updatedAgo && (
            <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">{updatedAgo}</span>
          )}
        </div>

        {project.description && (
          <p className="text-gray-400 text-xs mt-1 line-clamp-2">{project.description}</p>
        )}

        {/* DB type pills */}
        {dbTypes.length > 0 && (
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {dbTypes.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-md text-xs font-medium capitalize"
                style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {project.databaseIds.length} DB{project.databaseIds.length !== 1 ? "s" : ""} connected
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: palette.bg, color: palette.accent }}>
            {project.databaseIds.length > 0 ? "Connected" : "No DB"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};