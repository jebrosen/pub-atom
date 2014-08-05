"use strict";

var builder = require("xmlbuilder");

var helpers = require("./helpers");
var tag = require("./tag");

/** Data required to create an atom feed. Many of these properties match up with the Atom 1.0 specification
  * @typedef {Object} {EntryData}
  * @property id {string=} Entry id. If unspecfied, a tag: URI will be generated when added to a feed
  * @property title {string} Entry title
  * @property updated {Date} Date the entry was last updated
  * @property published {Date}= Date the entry was first published
  * @memberof AtomEntry
  */

/** Creates a new Atom entry object.
  * @constructor
  * @param feed {EntryData} An {@link EntryData} object to use when constructing the feed
  */
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

/** Adds this entry to a feed.
  * Calling this method enforces some checks such as id generation
  * and author enforcement that depend on knowing the owning feed
  * @param feed {AtomFeed} Feed to add this entry to
  */
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
