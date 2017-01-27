uuid-meta
=========

Gets metadata about a [UUID](https://en.wikipedia.org/wiki/UUID).

License
-------

Copyright 2017 [Fuzzy.ai](https://fuzzy.ai/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Usage
-----

Requiring the module returns a function to use for getting metadata about a
UUID.

```javascript
  var uuidMeta = require('uuid-meta');
```

Calling the function will return an object with properties about the UUID.

```javascript
  var metadata = uuidMeta("ea3b9dad-6761-4939-9ac4-fa27baa38da2");
  console.log(metadata.version); // 4
```

The interesting properties of the object returned are:

* `version`: The version of the UUID standard used. Should be an integer
  between 0 and 5.
* `time_unix`: For v1 UUIDs, the milliseconds since 1 Jan 1970 when the UUID
  was minted. Probably not valid for other versions.
* `mac_address`: For v1 UUIDs, the [MAC address](https://en.wikipedia.org/wiki/MAC_address)
  used for minting the UUID. It's a string of 6 hexadecimal bytes separated by
  colons (':').
* `time`: Time value for all UUIDs, counting 100 nanosecond periods since
  15 Oct 1582. Might not be an actual time for most types of UUIDs.
* `node`: Node identifier for minting of UUIDs. May or may not be a MAC address.
* `clock_seq`: Clock sequence value.

There are a few other properties that come from the parsing process, but
they're probably not interesting unless you're debugging the parsing process.
