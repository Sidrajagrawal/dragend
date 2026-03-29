const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
  envType: {
    type: String,
    required: true,
    enum: ["local", "deployed"],
  },

  authType: {
    type: String,
    required: true,
    enum: ["credentials", "uri"], 
  },

  credentials: {
    uri: {
      type: String,
      required: function () {
        return this.authType === "uri";
      },
    },

    host: {
      type: String,
      required: function () {
        return this.authType === "credentials";
      },
    },

    port: {
      type: Number,
      required: function () {
        return this.authType === "credentials";
      },
    },

    username: {
      type: String,
      required: function () {
        return this.authType === "credentials";
      },
    },

    password: {
      type: String,
      required: function () {
        return this.authType === "credentials";
      },
    },
    
    serviceName: {
      type: String,
      required: false, 
    }
    
  },
});

module.exports = mongoose.model("DB_Config", configSchema);