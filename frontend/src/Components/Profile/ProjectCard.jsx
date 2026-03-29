import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Pastel colors perfect for the light, airy theme
const CARD_PALETTES = [
  { bg: "#f3e8ff", accent: "#a855f7" }, // Purple
  { bg: "#fce7f3", accent: "#ec4899" }, // Pink
  { bg: "#e0e7ff", accent: "#3b82f6" }, // Blue
  { bg: "#d1fae5", accent: "#10b981" }, // Green
  { bg: "#fef3c7", accent: "#f59e0b" }, // Amber
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
  const dbTypes    = [...new Set(project.databaseIds.map((d) => d.type).filter(Boolean))];
  const updatedAgo = timeAgo(project.updatedAt);

  const handleClick = () => {
    if (!readonly) navigate(`/${project._id}/workflow`);
  };

  return (
    <motion.div
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={!readonly ? { y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.08), 0 0 20px rgba(168,85,247,0.1)" } : {}}
      className={`rounded-2xl border border-gray-100 bg-white overflow-hidden transition-all duration-300 shadow-sm ${readonly ? "cursor-default" : "cursor-pointer"}`}
    >
      <div className="h-32 w-full relative flex items-center justify-center overflow-hidden border-b border-gray-50" style={{ background: palette.bg }}>
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-30 blur-3xl" style={{ background: palette.accent }} />
        <div className="absolute bottom-0 left-4 w-24 h-24 rounded-full opacity-20 blur-2xl" style={{ background: palette.accent }} />

        {nodeCount > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide border border-white/40 uppercase bg-white/60 backdrop-blur-md text-gray-800 shadow-sm">
              {nodeCount} Tables
            </span>
          </div>
        )}

        {isLatest && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-white backdrop-blur-md shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Active</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900 text-lg leading-snug truncate">{project.name}</h3>
          {updatedAgo && <span className="text-[10px] text-gray-400 font-medium flex-shrink-0 mt-1 uppercase tracking-wider">{updatedAgo}</span>}
        </div>

        {project.description ? (
          <p className="text-gray-500 text-xs mt-2 line-clamp-2 h-8">{project.description}</p>
        ) : (
          <p className="text-gray-400 text-xs mt-2 italic h-8">No description provided.</p>
        )}

        {dbTypes.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {dbTypes.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-600 border border-gray-100">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};