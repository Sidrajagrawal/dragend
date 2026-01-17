const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  description : {
    type: String,
    default : ""
  },
  ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
   dataSourceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DataSource"
      }
    ],
    databaseIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Database"
      }
    ],
    routeGroupIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RouteGroup"
      }
    ],
    agentIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent"
      }
    ]

}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);