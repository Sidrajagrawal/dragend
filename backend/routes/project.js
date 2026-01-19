const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  updateDatabaseConfig,
  deleteProject,
  deleteDatabase
} = require("../controllers/project.controller");

router.post("/create", auth, createProject);
router.get("/", auth, getProjects);
router.get("/:id", auth, getProjectById);
router.put("/:id", auth, updateProject);
router.delete("/:id", auth, deleteProject);
router.delete("/database/:dbId", auth, deleteDatabase);

module.exports = router;
