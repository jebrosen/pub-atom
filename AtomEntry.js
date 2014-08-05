"use strict";

var builder = require("xmlbuilder");

var helpers = require("./helpers");
var tag = require("./tag");

function AtomEntry(entry) {
  var keys = Object.keys(entry);
  if (keys.indexOf("title") === -1) {
    throw new Error("Entry title is required");
  }
  if (keys.indexOf("updated") === -1) {
    throw new Error("Entry updated is required");
  }

  this.doc = builder.create("entry");
  this.props = [];
  
  keys.map(function(prop) {
    var val = entry[prop];

    if (prop === "$path") {
      this.relPath = val;
      return;
    }

    this.props.push(prop);
    if (prop === "updated" || prop === "published") {
      val = helpers.dateToISO(val);
    }

    var tempObj = {};
    tempObj[prop] = val;
    this.doc.ele(tempObj);
  }, this);
  
  this.refDate = entry.published || entry.updated;
}

AtomEntry.prototype.addTo = function(feed) {
  if (this.props.indexOf("id") === -1) {
    if (!feed.domain) {
      throw new Error("Auto-generated ids require a domain specified for the feed");
    }

    if (!this.relPath) {
      throw new Error("Auto-generated ids require a relative path for each entry");
    }

    var id = tag(this.domain, this.refDate, this.relPath);
    this.doc.ele("id", id);
  }

  if (this.props.indexOf("author") === -1) {
    if (feed.props.indexOf("author") === -1) {
      throw new Error("An author is required for each entry if not specified for the feed");
    }
  }
  
  feed.doc.raw(this.doc.toString());
};

module.exports = exports = AtomEntry;
