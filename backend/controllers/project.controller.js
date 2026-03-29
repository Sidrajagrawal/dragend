const crypto = require("../utils/crypto");
const Project = require("../models/Project");
const Database = require("../models/Database");
const Table = require("../models/Table");
const Endpoint = require("../models/Endpoint");
const DB_config = require("../models/DB_Config");
const { PostgresCheck, MySqlCheck, MongoCheck, SqlServerCheck, OracleCheck } = require("../utils/DBConnectionCheck");

exports.createProject = async (req, res) => {
  try {
    console.log("Create Project Payload:", req.body);

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
      serviceName,
      environment // Removed endpoint and apiKey from here
    } = req.body;

    const user = req.user._id;
    const normalizedDbType = dbType.toLowerCase();

    let checkResult = { connect: true, msg: "Local environment - validation skipped." };

    if (environment === "deployed") {
      if (normalizedDbType === "postgresql") {
        checkResult = await PostgresCheck(connectionName, host, port, username, password, uri);
      } else if (normalizedDbType === "mysql") {
        checkResult = await MySqlCheck(connectionName, host, port, username, password, uri);
      } else if (normalizedDbType === "mongodb") {
        checkResult = await MongoCheck(uri);
      } else if (normalizedDbType === "sql server") {
        checkResult = await SqlServerCheck(host, port, connectionName, username, password);
      } else if (normalizedDbType === "oracle") {
        if (!serviceName) {
          return res.status(400).json({ msg: "Service name required for Oracle" });
        }
        checkResult = await OracleCheck(host, port, serviceName, username, password);
      }

      if (!checkResult?.connect) {
        return res.status(400).json({
          success: false,
          msg: checkResult?.msg || "Database connection failed. Please check your credentials."
        });
      }
    }

    const project = await Project.create({
      name: projectName,
      ownerId: user,
      description,
    });

    let configPayload = {};
    let finalAuthType = authType;

    // Safety net: Automatically build Local Mongo URI if the frontend forgot
    let finalUri = uri;
    if (environment === "local" && normalizedDbType === "mongodb" && !finalUri) {
      finalUri = `mongodb://localhost:27017/${connectionName || 'local_db'}`;
      finalAuthType = "uri";
    }

    // Prepare credentials object (Removed the apiKey block completely)
    if (finalAuthType === "uri") {
      configPayload = { uri: finalUri };
    } else if (finalAuthType === "credentials") {
      configPayload = {
        host: host || "localhost",
        port: port,
        username: username || "root",
        password: password ? crypto.encrypt(password) : "",
        serviceName: serviceName || undefined
      };
    }

    const dbConfig = await DB_config.create({
      envType: environment,
      authType: finalAuthType,
      credentials: configPayload
    });

    const database = await Database.create({
      projectId: project._id,
      name: connectionName,
      type: normalizedDbType,
      config: dbConfig._id,
    });

    project.databaseIds.push(database._id);
    await project.save();

    return res.status(201).json({
      success: true,
      projectId: project._id,
      databaseId: database._id,
      message: environment === "local"
        ? "Local Project created successfully (Validation Skipped)"
        : "Project created and Database Verified!"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};


exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ ownerId: req.user._id }).populate("databaseIds");
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch projects" });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, ownerId: req.user._id }).populate({
      path: "databaseIds", populate: { path: "config" }
    });
    if (!project) return res.status(404).json({ msg: "Project not found" });
    return res.status(200).json({ success: true, project: project });
  } catch (err) {
    console.error("Get Project Error:", err);
    res.status(500).json({ msg: "Failed to fetch project" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { projectName, description } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user._id }, { name: projectName, description }, { new: true }
    );
    if (!project) return res.status(404).json({ msg: "Project not found" });
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ msg: "Update failed" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, ownerId: req.user._id });
    if (!project) return res.status(404).json({ msg: "Project not found" });
    await Database.deleteMany({ projectId: project._id });
    await DB_config.deleteMany({ _id: { $in: project.databaseIds } });
    await Table.deleteMany({ projectId: project._id });
    await Endpoint.deleteMany({ projectId: project._id });
    await project.deleteOne();
    res.json({ success: true, msg: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
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

exports.saveWorkflow = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { tables, endpoints, canvasState } = req.body;

    const project = await Project.findOne({ _id: projectId, ownerId: req.user._id });
    if (!project) return res.status(404).json({ success: false, msg: "Project not found" });

    const databaseId = project.databaseIds[0];
    if (!databaseId) return res.status(400).json({ success: false, msg: "No database linked" });

    await Table.deleteMany({ projectId });
    await Endpoint.deleteMany({ projectId });

    const tableMap = {};
    const savedTables = [];

    if (tables && tables.length > 0) {
      for (const tableData of tables) {
        const newTable = await Table.create({
          projectId, databaseId, name: tableData.tableName,
          timestamps: tableData.timestamps || false,
          fields: tableData.fields
        });
        tableMap[tableData.tableName] = newTable._id;
        savedTables.push(newTable);
      }
    }

    if (endpoints && endpoints.length > 0) {
      const endpointDocs = endpoints.map(ep => ({
        projectId, method: ep.method, route: ep.route,
        connectedTableId: tableMap[ep.connectedTableName] || null,
        selectedFields: ep.selectedFields || []
      }));
      await Endpoint.insertMany(endpointDocs);
    }

    project.canvasState = canvasState || { nodes: [], edges: [] };
    await project.save();

    return res.status(200).json({ success: true, msg: "Workflow saved successfully", tables: savedTables.length });
  } catch (err) {
    console.error("Save Workflow Error:", err);
    return res.status(500).json({ success: false, msg: "Failed to save workflow" });
  }
};