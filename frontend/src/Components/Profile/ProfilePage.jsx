import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProfile, getProjects } from "./ProfileAPI";

import { ProfileHeader } from "./ProfileHeader";
import { ProfileTabs } from "./ProfileTabs";
import { ProfileOverview } from "./ProfileOverview";
import { MyProjects } from "./MyProjects";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {
  const [tab, setTab] = useState("overview");

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, projectRes] = await Promise.all([
          getProfile(),
          getProjects(),
        ]);

        setUser(profileRes.data.user);
        setProjects(projectRes.data.projects);
      } catch (err) {
        navigate('/auth');
        console.error("Profile load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-gray-400 text-sm font-medium"
        >
          Loading profile...
        </motion.div>
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto bg-white shadow-sm rounded-none md:rounded-2xl overflow-hidden">
        <ProfileHeader user={user} projects={projects} onUserUpdate={setUser} />
        <ProfileTabs tab={tab} setTab={setTab} />

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "overview" ? (
              <ProfileOverview projects={projects} />
            ) : (
              <MyProjects projects={projects} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};