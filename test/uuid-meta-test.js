// uuid-meta-test.js

var vows = require('perjury'),
  assert = vows.assert,
  uuid = require('uuid'),
  debug = require('debug')('uuid-meta:uuid-meta-test');

const FIXED = "2017-01-27T00:00:00Z",
    ADDR = "c8:f7:33:98:60:0c",
    CSEQ = 0x2BAD;

vows.describe("uuid-meta main test")
  .addBatch({
      "When we require the library": {
          topic: function() {
              return require("../index.js");
          },
          "it works": function(err, meta) {
              assert.ifError(err);
              assert.isFunction(meta);
          },
          "and we invoke it on a v1 UUID": {
              topic: function(meta) {
                  var id = uuid.v1({
                    "node": ADDR.split(':').map(function(byte) { return parseInt(byte, 16); }),
                    "msecs": Date.parse(FIXED),
                    "clockseq": CSEQ,
                    "nsecs": 0,
                  });
                  debug(`v1 ID = ${id}`);
                  return meta(id);
              },
              "it works": function(err, results) {
                  assert.ifError(err);
                  assert.isObject(results);
              },
              "it has the right version": function(err, results) {
                  assert.ifError(err);
                  assert.isObject(results);
                  debug(results);
                  assert.equal(results.version, 1);
              },
              "it has the right timestamp": function(err, results) {
                  assert.ifError(err);
                  assert.isObject(results);
                  assert.equal(results.time_unix, Date.parse(FIXED));
              },
              "it has the right MAC address": function(err, results) {
                  assert.ifError(err);
                  assert.isObject(results);
                  assert.equal(results.mac_address, ADDR);
              },
              "it has the right clock_seq": function(err, results) {
                  assert.ifError(err);
                  assert.isObject(results);
                  assert.equal(results.clock_seq, CSEQ);
              }
          },
          "and we invoke it on a v4 UUID": {
              topic: function(meta) {
                  return meta("ea3b9dad-6761-4939-9ac4-fa27baa38da2");
              },
              "it works": function(err, results) {
                  assert.ifError(err);
                  assert.isObject(results);
              },
              "it has the right version": function(err, results) {
                  assert.ifError(err);
                  assert.isObject(results);
                  assert.equal(results.version, 4);
              }
          }
      }
  })
  .export(module);
