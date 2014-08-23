"use strict";

/** @typedef {Object} LinkData
  * @property href {string} URI of the referenced link
  * @property rel {string=} Relationship type of the link
  * @property type {string=} Type of media referenced by this link
  * @property hreflang {string=} Language of the referenced resource
  * @property title {string=} Display title of the link
  * @property length {number=} Length of the linked resource, in bytes
  * @memberof AtomLink
  */

/** Creates a new Atom link object.
  * @constructor
  * @param options {LinkData} A {@link LinkData} object containing the link information
  */
var AtomLink = module.exports = exports = function AtomLink(options) {
  if (typeof options !== "object") {
    throw new Error("options must be an object");
  }

  if (!options.href) {
    throw new Error("a link must have a href");
  }
  this.href = options.href;

  if (options.rel) {
    this.rel = options.rel;
  }

  if (options.type) {
    this.type = options.type;
  }

  if (options.hreflang) {
    this.hreflang = options.hreflang;
  }

  if (options.title) {
    this.title = options.title;
  }

  if (options.length) {
    if (typeof options.length !== "number") {
      throw new Error("a link's length must be a number");
    }
    this.length = options.length;
  }
};

AtomLink.prototype.makeElement = function() {
  return {
    link: {
      "#href": this.href,
      "#rel": this.rel,
      "#type": this.type,
      "#hreflang": this.hreflang,
      "#title": this.title,
      "#length": this.length,
    },
  };
};
