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

/** Adds an entry to this feed
  * @param entry {EntryData} An {@link EntryData} object used to construct the entry
  */
AtomFeed.prototype.add = function(entry) {
  var ae = new AtomEntry(entry);
  ae.addTo(this);
};

/** Converts this feed to an XML string
  * @returns XML Data representing the feed
  */
AtomFeed.prototype.toString = function() {
  return this.doc.toString();
};

module.exports = exports = AtomFeed;
