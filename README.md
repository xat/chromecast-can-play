# chromecast-can-play

Check if a certain media file is supported by Chromecast (requires ffprobe).
This library is work in progress and not on npm yet.
Contributers are welcome.

### Usage

```javascript
var canPlay = require('chromecast-can-play');

canPlay('./myvideo.mp4', function(err, meta) {
  if (meta.canPlay) {
    console.log('file is supported by chromecast');
  } else {
    console.log('file is not supported by chromecast');
  }
});

canPlay('./myvideo.mkv', function(err, meta) {
  if (meta.audioSupported === false) {
    console.log('audio must be converted...');
  }
});
```

## License
MIT
