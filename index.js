// index.js

var debug = require('debug')('uuid-meta:index');

var EPOCH = (new Date("1582-10-15T00:00:00Z")).getTime()

var to_bytes = function(id) {

    var nodash = id.replace(/-/g, ''),
        parsed = new Array(16);

    for (var i = 0; i < 32; i += 2) {
        parsed[i/2] = parseInt(nodash.slice(i, i + 2), 16);
    }

    return parsed;
};

var lshift = function(value, bits) {
    debug(`lshift(${value}, ${bits})`);
    if (bits > 31) {
        var mp = Math.pow(2, bits);
        debug(`mp = ${mp}`);
        var result = (value * mp);
        debug(`result = ${result}`);
        return result;
    } else {
        return (value << bits) >>> 0;
    }
};

var rshift = function(value, bits) {
    return (value >>> bits) >>> 0;
};

var mask = function(value, m) {
    return (value & m) >>> 0;
};

var to_number = function(bytes) {
    var num = 0,
        len = bytes.length;
    debug(`bytes = ${bytes}, len = ${len}`);
    for (var i = 0; i < len; i++) {
        var bits = (8 * (len - i - 1));
        debug(`i = ${i}, len = ${len}, bits = ${bits}, byte = ${bytes[i]}`);
        var value = lshift(bytes[i], bits);
        debug(`value = ${value}`);
        num += value;
    }
    return num;
};

var to_mac_address = function(node) {
    var base = node.toString(16),
        addr;

    for (var i = 0; i < base.length; i += 2) {
        if (i == 0) {
            addr = base.slice(i, i + 2);
        } else {
            addr = addr + ':' + base.slice(i, i + 2);
        }
    }

    return addr;
};

var meta = function(id) {
    var parsed = to_bytes(id),
        results = {
            "bytes": parsed,
            "time_low": to_number(parsed.slice(0, 4)),
            "time_mid": to_number(parsed.slice(4, 6)),
            "time_hi_and_version": to_number(parsed.slice(6, 8)),
            "clock_seq_hi_and_reserved": to_number(parsed.slice(8, 9)),
            "clock_seq_low": to_number(parsed.slice(9, 10)),
            "node": to_number(parsed.slice(10, 16))
        };
        debug(`parsed = ${parsed}`);
        results.time_hi = mask(results.time_hi_and_version, 0x0FFF);
        results.version = rshift(results.time_hi_and_version, 12);
        results.clock_seq_hi = mask(results.clock_seq_hi_and_reserved, 0x3F);
        results.reserved = rshift(results.clock_seq_hi_and_reserved, 6);
        results.clock_seq = lshift(results.clock_seq_hi, 8) + results.clock_seq_low;
        results.time = lshift(results.time_hi, 48) +
            lshift(results.time_mid, 32) +
            (results.time_low);
        results.time_unix = Math.round((results.time / 10000) - 12219292800000);
        results.mac_address = to_mac_address(results.node);
        return results;
};

module.exports = meta;
