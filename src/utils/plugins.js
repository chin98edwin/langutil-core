const MANGLE_collection = {};

function setPlugin(key, value) {
  MANGLE_collection[key] = value;
}

module.exports = { MANGLE_collection, setPlugin };
