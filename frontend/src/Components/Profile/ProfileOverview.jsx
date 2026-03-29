import { motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";

export const ProfileOverview = ({ projects, readonly = false }) => {
  const sorted = [...projects].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );
  const recent = sorted.slice(0, 3);
  const latestId = sorted[0]?._id;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="px-4 sm:px-10 py-8 bg-white"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-gray-900 tracking-tight">
          Recent Projects
        </h3>
        <span className="text-xs text-gray-400">Sorted by last updated</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {recent.map((p, i) => (
          <ProjectCard key={p._id} project={p} index={i} isLatest={p._id === latestId} readonly={readonly} />
        ))}
      </div>
    </motion.div>
  );
};