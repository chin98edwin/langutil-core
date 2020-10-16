"use strict";
if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/langutil-core.prod.min.js");
} else {
  module.exports = require("./dist/langutil-core.dev.min.js");
}