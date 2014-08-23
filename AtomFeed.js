"use strict";

var builder = require("xmlbuilder");

var AtomEntry = require("./AtomEntry");
var common = require("./AtomCommon");
var helpers = require("./helpers");
var tag = require("./tag");

var base = {
  feed: {
    "@xmlns": "http://www.w3.org/2005/Atom",
  },
};

var pkg = require("./package.json");
var defaultGenerator = {
    version: pkg.version,
    uri: pkg.homepage,
    name: pkg.name,
};

/** Data required to create an atom feed. Many of these properties match up with the Atom 1.0 specification
  * @typedef {Object} {FeedData}
  * @property id {string} Feed id.
  * @property title {string} Feed title
  * @property updated {Date=} Date the feed was last updated. If unspecified, the current date will be used
  * @property author {AtomPerson=} Author of the feed. If unspecified, every entry must have an author
  * @property links {AtomLink[]|object[]} Links related to the feed. A link with rel=self is recommended.
  * @property generator {AtomGenerator} Generator of the feed. If unspecified, pub-atom information will be used
  * @property icon {string=} Link to the feed's icon
  * @property logo {string=} Link to the feed's logo
  * @property rights {TextData=} Copyright information for the feed
  * @property subtitle {TextData=} Feed subtitle or description
  * @property domain {string=} Domain to use for this feed when automatically generating tag: URIs for entries
  * @memberof AtomFeed
  */

/** Creates a new Atom feed object.
  * @constructor
  * @param feed {FeedData} A {@link FeedData} object to use when constructing the feed
  */
function AtomFeed(options) {
  if (typeof options !== "object") {
    throw new Error("options must be an object");
  }
  
  var doc = this.doc = builder.create(base, { version: "1.0", encoding: "utf-8" });
  
  if (!options.id) {
    throw new Error("Feed id is required");
  }
  this.id = options.id;
  doc.ele("id", options.id);
  
  if (!options.title) {
    throw new Error("Feed title is required");
  }
  this.title = options.title;
  doc.ele("title", options.title);
  
  this.updated = options.updated || new Date();
  doc.ele("updated", helpers.dateToISO(this.updated));

  if (options.author) {
    this.author = options.author;
    doc.ele({ author: new common.AtomPerson(options.author) });
  }
  
  if (options.links) {
    options.links.forEach(function(link) {
      doc.ele(new common.AtomLink(link).makeElement());
    });
  }

  // TODO: category
  // TODO: contributor

  var generator = this.generator = options.generator || defaultGenerator;
  if (typeof generator !== "object") {
    throw new Error("Generator must be an object");
  }
  if (!generator.name) {
    throw new Error("Generator must have a name");
  }
  
  this.doc.ele({ generator: {
    "@version": generator.version,
    "@uri": generator.uri,
    "#text": generator.name,
  } });
  
  if (options.icon) {
    this.icon = options.icon;
    doc.ele("icon", options.icon);
  }
  
  if (options.logo) {
    this.logo = options.logo;
    doc.ele("logo", options.logo);
  }
  
  if (options.rights) {
    var rights = this.rights = new common.AtomText(options.rights);
    var rightsDoc = doc.ele("rights");
    rightsDoc.att("type", rights.type);
    rightsDoc.text(rights.data);
  }
  
  if (options.subtitle) {
    var subtitle = this.subtitle = new common.AtomText(options.subtitle);
    var subtitleDoc = doc.ele("subtitle");
    subtitleDoc.att("type", subtitle.type);
    subtitleDoc.text(subtitle.data);
  }
  
  if (options.domain) {
    this.domain = options.domain;
  }
}

/** Adds an entry to this feed
  * @param options {EntryData} An {@link EntryData} object used to construct the entry
  */
AtomFeed.prototype.addEntry = function(options) {
  var ae = new AtomEntry(options);
  var aeDoc = this.doc.ele("entry");
  
  var id = ae.id;
  if (!id) {
    if (!this.domain) {
      throw new Error("Auto-generated ids require a domain specified for the feed");
    }

    if (!ae.path) {
      throw new Error("Auto-generated ids require a relative path for each entry");
    }

    id = tag(this.domain, ae.idDate, ae.path);
  }
  aeDoc.ele("id", id);
  
  aeDoc.ele("title", ae.title);
  aeDoc.ele("updated", helpers.dateToISO(ae.updated));

  var author = ae.author || this.author;
  if (!author) {
      throw new Error("An author is required for each entry if not specified for the feed");
  }
  aeDoc.ele({ author: author });
  
  if (ae.content) {
    var contentDoc = aeDoc.ele("content");
    contentDoc.att("type", ae.content.type);
    if (ae.content.src) {
      contentDoc.att("src", ae.content.src);
    }
    if (ae.content.data) {
      contentDoc.text(ae.content.data);
    }
  }
};

/** Converts this feed to an XML string
  * @returns XML Data representing the feed
  */
AtomFeed.prototype.toString = function() {
  return this.doc.end();
};

module.exports = exports = AtomFeed;
