import { motion } from "framer-motion";

export const ProfileTabs = ({ tab, setTab }) => {
  const tabs = ["overview", "projects"];

  return (
    <div className="px-4 sm:px-10 border-b border-gray-100 flex gap-0 bg-white">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className="relative pb-3 pt-1 mr-6 sm:mr-8 capitalize text-sm font-medium transition-colors"
          style={{ color: tab === t ? "#111827" : "#9ca3af" }}
        >
          {t}
          {tab === t && (
            <motion.div
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
              style={{ background: "#111827" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};