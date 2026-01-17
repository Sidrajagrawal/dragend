const crypto = require("../utils/crypto");
const Project = require("../models/Project");
const Database = require("../models/Database");
const DB_config = require("../models/DB_Config");

const {
  PostgresCheck,
  MySqlCheck,
  MongoCheck,
  SqlServerCheck,
  OracleCheck
} = require("../utils/DBConnectionCheck");

exports.createProject = async (req, res) => {
  try {
    const {
      projectName,
      description,
      backend,
      dbType,
      connectionName,
      authType,

      host,
      port,
      uri,
      username,
      password,
      endpoint,
      apiKey,
      serviceName
    } = req.body;

    const user = req.user?._id || "696b5f88319f75476002782b";

    // 1️⃣ Validate DB Connection BEFORE saving anything
    let checkResult;

    if (dbType === "postgresql") {
      checkResult = await PostgresCheck(connectionName, host, port, projectName, username, password);
    }

    if (dbType === "mysql") {
      checkResult = await MySqlCheck(connectionName, host, port, projectName, username, password);
    }

    if (dbType === "mongodb") {
      checkResult = await MongoCheck(uri);
    }

    if (dbType === "SQL Server") {
      checkResult = await SqlServerCheck(host, port, projectName, username, password);
    }

    if (dbType === "Oracle") {
      if (!serviceName) {
        return res.status(400).json({ msg: "Service name required for Oracle" });
      }
      checkResult = await OracleCheck(host, port, serviceName, username, password);
    }

    if (!checkResult?.connect) {
      return res.status(400).json({
        success: false,
        msg: checkResult?.msg || "Connection failed"
      });
    }

    // 2️⃣ Create Project
   const project = await Project.create({
  name: projectName,
  ownerId: user,
  description,
});

    // 3️⃣ Build DB Config Payload
    let configPayload = { authType };

    if (authType === "uri") {
      configPayload.uri = uri;
    }

    if (authType === "credentials") {
      configPayload.credentials = {
        uri,
        host,
        port,
        username,
        password: crypto.encrypt(password),
        serviceName: dbType === "Oracle" ? serviceName : undefined
      };
    }

    if (authType === "apiKey") {
      configPayload.apiKey = {
        endpoint,
        apiKey: crypto.encrypt(apiKey),
      };
    }

    // 4️⃣ Save DB Config
    const dbConfig = await DB_config.create({
      authType:authType,
      credentials : configPayload});

    // 5️⃣ Create Database Record
    const database = await Database.create({
      projectId: project._id,
      name: connectionName,
      type: dbType,
      config: dbConfig._id,
    });

    // 6️⃣ Attach Database to Project
    project.databaseIds.push(database._id);
    await project.save();

    return res.status(201).json({
      success: true,
      projectId: project._id,
      databaseId: database._id,
      message: "Project created and DB verified successfully"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id })
      .populate("databaseIds");

    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch projects" });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id
    })
    .populate({
      path: "databaseIds",
      populate: { path: "config" }
    });

    if (!project) return res.status(404).json({ msg: "Project not found" });

    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch project" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { projectName, description } = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { projectName, description },
      { new: true }
    );

    if (!project) return res.status(404).json({ msg: "Project not found" });

    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ msg: "Update failed" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!project) return res.status(404).json({ msg: "Not found" });

    await Database.deleteMany({ projectId: project._id });
    await DB_config.deleteMany({ _id: { $in: project.databaseIds } });

    await project.deleteOne();

    res.json({ success: true, msg: "Project deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
};

exports.deleteDatabase = async (req, res) => {
  try {
    const db = await Database.findById(req.params.dbId);
    if (!db) return res.status(404).json({ msg: "Database not found" });

    await DB_config.findByIdAndDelete(db.config);
    await db.deleteOne();

    res.json({ success: true, msg: "Database removed" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete DB" });
  }
};

