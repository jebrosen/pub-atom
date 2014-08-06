"use strict";

var builder = require("xmlbuilder");

var helpers = require("./helpers");

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

module.exports = exports = AtomEntry;
