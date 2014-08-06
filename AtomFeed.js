"use strict";

var builder = require("xmlbuilder");

var AtomEntry = require("./AtomEntry");
var helpers = require("./helpers");
var tag = require("./tag");

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

/** Data required to create an atom feed. Many of these properties match up with the Atom 1.0 specification
  * @typedef {Object} {FeedData}
  * @property id {string} Feed id.
  * @property title {string} Feed title
  * @property updated {Date} Date the feed was last updated
  * @property generator {string=} Generator of the feed. pub-atom information will be used if unspecified
  * @property $domain {string=} Domain to use for this feed when automatically generating tag: URIs for entries
  * @memberof AtomFeed
  */

/** Creates a new Atom feed object.
  * @constructor
  * @param feed {FeedData} A {@link FeedData} object to use when constructing the feed
  */
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

  this.doc = builder.create(base, { version: "1.0", encoding: "utf-8" });
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

/** Adds an entry to this feed
  * @param entry {EntryData} An {@link EntryData} object used to construct the entry
  */
AtomFeed.prototype.add = function(entry) {
  var ae = new AtomEntry(entry);
  
  if (ae.props.indexOf("id") === -1) {
    if (!this.domain) {
      throw new Error("Auto-generated ids require a domain specified for the feed");
    }

    if (!ae.relPath) {
      throw new Error("Auto-generated ids require a relative path for each entry");
    }

    var id = tag(this.domain, ae.refDate, ae.relPath);
    ae.doc.ele("id", id);
  }

  if (ae.props.indexOf("author") === -1) {
    if (this.props.indexOf("author") === -1) {
      throw new Error("An author is required for each entry if not specified for the feed");
    }
  }
  
  this.doc.raw(ae.doc.toString());
};

/** Converts this feed to an XML string
  * @returns XML Data representing the feed
  */
AtomFeed.prototype.toString = function() {
  return this.doc.end();
};

module.exports = exports = AtomFeed;
