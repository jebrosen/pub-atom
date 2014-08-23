"use strict";

/** @typedef {Object} ContentData
  * @property type {string} Type of content
  * @property src {string=} Location of the content
  * @property data {string=} Textual content
  * @memberof AtomContent
  */

/** Creates a new Atom content object.
  * @constructor
  * @param options {ContentData} A {@link ContentData} object to use when validating the content
  */
function AtomContent(options) {
  if (typeof options !== "object") {
    throw new Error("options must be an object");
  }
  
  this.type = options.type || "text";
  if (options.src) {
    this.src = options.src;
  } else {
    if (!options.data) {
      throw new Error("Either data or src must be specified for content");
    }
    this.data = options.data;
  }
}


/** @typedef {Object|string} TextData
  * @property type {string} Type of text
  * @property data {string} Text Content
  */

/** Creates a new Atom text object.
  * @constructor
  * @param options {TextData|string} A {@link TextData} object to use, or simple plain text
  */
function AtomText(options) {
  if (typeof options === "object") {
    this.type = options.type || "text";
    if (!options.data) {
      throw new Error("Must specify text data");
    }
    this.data = options.data;
  } else if (typeof options === "string") {
    this.type = "text";
    this.data = options;
  } else {
    throw new Error("options must be an object or string");
  }
}

/** @typedef {Object} PersonData
  * @property name {string} Name of the person
  * @property url {string=} URL of the person's website
  * @property email {string=} Person's email address
  * @memberof AtomPerson
  */

/** Creates a new Atom person object.
  * @constructor
  * @param options {PersonData} A {@link PersonData} object to use when validating the person
  */
function AtomPerson(options) {
  if (typeof options !== "object") {
    throw new Error("options must be an object");
  }
  
  if (!options.name) {
    throw new Error("a person must have a name");
  }
  this.name = options.name;
  
  if (options.uri) {
    this.uri = options.uri;
  }
  
  if (options.email) {
    this.email = options.email;
  }
}

module.exports = exports = {
  AtomContent: AtomContent,
  AtomText: AtomText,
  AtomPerson: AtomPerson,
  AtomLink: require("./AtomLink"),
};
