"use strict";

function makeTag(domain, dateObj, relPath) {
  if (!(dateObj instanceof Date) || isNaN(dateObj.valueOf())) {
    throw new Error("dateObj must be a valid Date: " + dateObj);
  }
  
  var y = dateObj.getFullYear();
  var m = dateObj.getMonth() + 1;
  var d = dateObj.getDate();
  
  var dateStr =
      y.toString() + "-" +
      ("0" + m.toString()).slice(-2) + "-" +
      ("0" + d.toString()).slice(-2);
  
  return "tag:" + domain + "," + dateStr + ":" + relPath;
}

module.exports = exports = makeTag;
