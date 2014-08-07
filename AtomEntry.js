"use strict";

var common = require("./AtomCommon");

/** Data required to create an atom feed. Many of these properties match up with the Atom 1.0 specification
  * @typedef {Object} {EntryData}
  * @property id {string=} Entry id. If unspecfied, a tag: URI will be generated when added to a feed
  * @property title {string} Entry title
  * @property updated {Date=} Date the entry was last updated. If unspecified, the current time will be used
  * @property author {AtomPerson=} Author of the entry. If unspecified, the feed must have an author.
  * @property content {AtomContent} Entry text or a link to the entry content
  * @property published {Date}= Date the entry was first published
  * @property path {string=} Relative path to this entry. Required if using automatic id generation
  * @memberof AtomEntry
  */

/** Creates a new Atom entry object.
  * @constructor
  * @param options {EntryData} An {@link EntryData} object to use when constructing the feed
  */
function AtomEntry(options) {
  if (typeof options !== "object") {
    throw new Error("options must be an object");
  }
  
  if (options.id) {
    this.id = options.id;
  }
  
  if (!options.title) {
    throw new Error("Feed title is required");
  }
  this.title = options.title;
  
  this.updated = options.updated || new Date();
  
  if (options.author) {
    this.author = new common.AtomPerson(options.author);
  }
  
  if (options.content) {
    this.content = new common.AtomContent(options.content);
  }
  
  // TODO: link
  // TODO: summary
  // TODO: category
  // TODO: contributor
  
  if (options.published) {
    this.published = options.published;
  }
  
  // TODO: source
  // TODO: rigts
  
  if (options.path) {
    this.path = options.path;
  }
  
  this.idDate = this.published || this.updated;
}

module.exports = exports = AtomEntry;
