"use strict";

var helpers = module.exports = exports = {};

helpers.dateToISO = function (date) {
  if (typeof date === "string") {
    return date;
  }

  if (date instanceof Date) {
    if (isNaN(date.valueOf())) {
      throw new Error("Date is invalid: " + date);
    }
    return date.toISOString();
  }

  throw new Error("Could not convert date: " + date);
};
