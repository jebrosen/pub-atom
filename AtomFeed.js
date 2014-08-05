"use strict";

var builder = require("xmlbuilder");

var AtomEntry = require("./AtomEntry");
var helpers = require("./helpers");

var base = {
  feed: {
    "@xmlns": "http://www.w3.org/2005/Atom",
  },
};

var pkg = require("./package.json");
var generatorData = {
  generator: {
    "@version": pkg.version,
    "@uri": pkg.homepage,
    "#text": pkg.name,
  }
};

function AtomFeed(feed) {
  var keys = Object.keys(feed);
  if (keys.indexOf("id") === -1) {
    throw new Error("Feed id is required");
  }
  if (keys.indexOf("title") === -1) {
    throw new Error("Feed title is required");
  }
  if (keys.indexOf("updated") === -1) {
    throw new Error("Feed updated is required");
  }

  this.doc = builder.create(base);
  this.props = [];

  keys.map(function(prop) {
    var val = feed[prop];

    if (prop === "$domain") {
      this.domain = val;
      return;
    }

    this.props.push(prop);

    if (prop === "updated") {
      val = helpers.dateToISO(val);
    }

    var tempObj = {};
    tempObj[prop] = val;
    this.doc.ele(tempObj);
  }, this);

  if (keys.indexOf("generator") === -1) {
    this.doc.ele(generatorData);
  }
}

AtomFeed.prototype.add = function(entry) {
  var ae = new AtomEntry(entry);
  ae.addTo(this);
};

AtomFeed.prototype.toString = function() {
  return this.doc.toString();
};

module.exports = exports = AtomFeed;
