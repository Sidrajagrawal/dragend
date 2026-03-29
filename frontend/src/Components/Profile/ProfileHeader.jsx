import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { checkUsername, updateProfile } from "./ProfileAPI";

// ─── helpers ──────────────────────────────────────────────────────────────────
function formatJoinDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function getInitials(username) {
  if (!username) return "?";
  return username.slice(0, 2).toUpperCase();
}

function usernameToHue(username) {
  if (!username) return 240;
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

// ─── Initials Avatar ──────────────────────────────────────────────────────────
const InitialsAvatar = ({ username, size = 128 }) => {
  const hue = usernameToHue(username);
  const initials = getInitials(username);
  return (
    <div
      className="flex items-center justify-center rounded-3xl border-4 border-white shadow-xl flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${hue},70%,55%), hsl(${(hue + 40) % 360},75%,45%))`,
      }}
    >
      <span
        className="font-bold select-none"
        style={{ fontSize: size * 0.32, color: "rgba(255,255,255,0.95)", letterSpacing: "0.05em" }}
      >
        {initials}
      </span>
    </div>
  );
};

// ─── Username status badge ────────────────────────────────────────────────────
const UsernameStatus = ({ status }) => {
  const map = {
    idle:      null,
    checking:  { text: "Checking...", color: "#9ca3af" },
    available: { text: "✓ Available", color: "#16a34a" },
    taken:     { text: "✗ Taken",     color: "#dc2626" },
  };
  const cfg = map[status];
  if (!cfg) return null;
  return (
    <motion.span
      key={status}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xs font-medium"
      style={{ color: cfg.color }}
    >
      {cfg.text}
    </motion.span>
  );
};

// ─── Share Popover ────────────────────────────────────────────────────────────
const SharePopover = ({ username, onClose }) => {
  const profileUrl = `${import.meta.env.VITE_APP_URL}${username}`;
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute z-50 top-full mt-2 left-0 w-80 bg-white rounded-2xl border border-gray-200 shadow-2xl p-4"
      style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.14)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-900">Share profile</p>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <p className="text-xs text-gray-400 mb-2">Anyone with this link can view your profile</p>

      {/* Link row */}
      <div className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 bg-gray-50">
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
        <span className="flex-1 text-xs text-gray-600 truncate font-mono">{profileUrl}</span>
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={copied ? "Copied!" : "Copy link"}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
          style={{
            background: copied ? "#f0fdf4" : "#f1f5f9",
            color: copied ? "#16a34a" : "#374151",
          }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.svg
                key="check"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                className="w-4 h-4"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12"/>
              </motion.svg>
            ) : (
              <motion.svg
                key="copy"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                className="w-4 h-4"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export const ProfileHeader = ({ user, projects, onUserUpdate }) => {

  // ── edit state ────────────────────────────────────────────────────────────
  const [editMode,  setEditMode]  = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [saveError, setSaveError] = useState("");
  const [shareOpen, setShareOpen] = useState(false);

  // ── draft username ────────────────────────────────────────────────────────
  const [draftUsername, setDraftUsername] = useState(user.username ?? "");

  // ── username live-check ───────────────────────────────────────────────────
  const [usernameStatus, setUsernameStatus] = useState("idle");
  const debouncedUsername = useDebounce(draftUsername, 500);

  useEffect(() => {
    if (!editMode) return;
    const trimmed = debouncedUsername.trim();
    if (trimmed === (user.username ?? "") || trimmed.length < 3) {
      setUsernameStatus("idle");
      return;
    }
    setUsernameStatus("checking");
    checkUsername(trimmed)
      .then((res) => setUsernameStatus(res.data.available ? "available" : "taken"))
      .catch(() => setUsernameStatus("idle"));
  }, [debouncedUsername, editMode, user.username]);

  // ── handlers ──────────────────────────────────────────────────────────────
  const handleEdit = () => {
    setDraftUsername(user.username ?? "");
    setUsernameStatus("idle");
    setSaveError("");
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setSaveError("");
    setUsernameStatus("idle");
  };

  const handleSave = async () => {
    if (usernameStatus === "taken" || usernameStatus === "checking") return;
    const trimmed = draftUsername.trim();
    if (trimmed === user.username) { setEditMode(false); return; }

    setSaving(true);
    setSaveError("");
    try {
      const res = await updateProfile({ username: trimmed });
      onUserUpdate(res.data.user);
      setEditMode(false);
    } catch (err) {
      setSaveError(err?.response?.data?.msg ?? "Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const canSave = usernameStatus !== "taken" && usernameStatus !== "checking" && !saving;

  // ── derived stats ─────────────────────────────────────────────────────────
  const totalDBs    = projects.reduce((acc, p) => acc + p.databaseIds.length, 0);
  const totalNodes  = projects.reduce((acc, p) => acc + (p.canvasState?.nodes?.length ?? 0), 0);
  const totalEdges  = projects.reduce((acc, p) => acc + (p.canvasState?.edges?.length ?? 0), 0);
  const totalAgents = projects.reduce((acc, p) => acc + (p.agentIds?.length ?? 0), 0);
  const dbTypes     = [...new Set(projects.flatMap((p) => p.databaseIds.map((d) => d.type)).filter(Boolean))];
  const lastUpdated = projects.length > 0
    ? [...projects].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]
    : null;

  const topStats = [
    { label: "Projects",  value: projects.length },
    { label: "Databases", value: totalDBs },
    { label: "Tables",    value: totalNodes },
    { label: "Relations", value: totalEdges },
  ];

  const journeyItems = [
    {
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
      bg: "#ede9fe", color: "#7c3aed", label: "Last worked on", value: lastUpdated ? lastUpdated.name : "—",
    },
    {
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3S3 13.66 3 12"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
      bg: "#d1fae5", color: "#059669", label: "DB connections", value: `${totalDBs} across ${projects.length} project${projects.length !== 1 ? "s" : ""}`,
    },
    {
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
      bg: "#dbeafe", color: "#2563eb", label: "Schema", value: `${totalNodes} tables`,
    },
    {
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
      bg: "#fce7f3", color: "#db2777", label: "Agents Used", value: totalAgents,
    },
  ];

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="relative">

      {/* Banner */}
      <div className="w-full h-32 sm:h-52 overflow-hidden">
        <img
          src={import.meta.env.VITE_PROFILE_BANNER_URL}
          className="w-full h-full object-cover"
          alt="banner"
        />
      </div>

      <div className="px-4 sm:px-10 pb-6 bg-white">

        {/* Top row: avatar + stats */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between relative gap-4">

          {/* Left: avatar + info */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">

            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="-mt-10 sm:-mt-16 flex-shrink-0"
            >
              <InitialsAvatar username={user.username} size={96} />
            </motion.div>

            {/* Name / meta / buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="pb-1 pt-1 sm:pt-4"
            >
              {/* Username row */}
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                {editMode ? (
                  <div className="flex flex-col gap-1">
                    <input
                      value={draftUsername}
                      onChange={(e) => setDraftUsername(e.target.value)}
                      className="text-xl font-bold tracking-tight text-gray-900 border-b-2 border-indigo-400 bg-transparent outline-none px-1 py-0.5 w-48 sm:w-52"
                      placeholder="Username"
                      autoFocus
                    />
                    <UsernameStatus status={usernameStatus} />
                  </div>
                ) : (
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                    {user.username}
                  </h2>
                )}
                <span
                  className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold flex-shrink-0"
                  style={{ background: "#f1f5f9", color: "#6366f1", border: "1px solid #e0e7ff" }}
                >
                  PRO ⚡
                </span>
              </div>

              {/* Email + joined */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 mb-2">
                {user.email && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    {user.email}
                  </span>
                )}
                {user.createdAt && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                    Joined {formatJoinDate(user.createdAt)}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500 mb-3">Backend Builder • DragEnd Creator</p>

              {/* Save error */}
              <AnimatePresence>
                {saveError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-red-500 mb-3 font-medium"
                  >
                    {saveError}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Action buttons */}
              <AnimatePresence mode="wait">
                {editMode ? (
                  <motion.div key="edit-btns"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
                    className="flex gap-3 flex-wrap"
                  >
                    <motion.button
                      onClick={handleSave}
                      disabled={!canSave}
                      whileHover={canSave ? { scale: 1.03 } : {}}
                      whileTap={canSave ? { scale: 0.97 } : {}}
                      className="px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-sm"
                      style={{ background: canSave ? "#4f46e5" : "#a5b4fc", cursor: canSave ? "pointer" : "not-allowed" }}
                    >
                      {saving ? "Saving..." : "Save"}
                    </motion.button>
                    <motion.button
                      onClick={handleCancel}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="px-5 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 bg-white shadow-sm"
                    >
                      Cancel
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div key="view-btns"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
                    className="flex gap-3 flex-wrap relative"
                  >
                    <motion.button
                      onClick={handleEdit}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-sm"
                      style={{ background: "#161827" }}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit Profile
                    </motion.button>

                    {/* Share button + popover */}
                    <div className="relative">
                      <motion.button
                        onClick={() => setShareOpen((v) => !v)}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 bg-white shadow-sm"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                        </svg>
                        Share
                      </motion.button>

                      <AnimatePresence>
                        {shareOpen && (
                          <SharePopover
                            username={user.username}
                            onClose={() => setShareOpen(false)}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* RIGHT — Stats: horizontal scroll on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex gap-5 sm:gap-8 text-center pb-1 overflow-x-auto sm:overflow-visible"
          >
            {topStats.map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex-shrink-0"
              >
                <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{s.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Journey strip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-6 rounded-2xl border border-gray-100 px-4 sm:px-6 py-4 grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6"
          style={{ background: "#fafafa" }}
        >
          {journeyItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {i > 0 && <div className="w-px h-8 bg-gray-200 -ml-3 mr-3 hidden sm:block" />}
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: item.bg, color: item.color }}>
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-sm font-semibold text-gray-800 leading-tight">{item.value}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};