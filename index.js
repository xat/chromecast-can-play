var ffmpeg = require('fluent-ffmpeg');
var path = require('path');

var toArray = function(arr) {
  return [].slice.call(arr);
};

var buildTester = function() {
  var arr = toArray(arguments);
  var memo = {};
  arr.forEach(function(val) {
    memo[val] = true;
  });
  return function(val) {
    return !!memo[val];
  };
};

// TODO: File Extension checking is lame... is there a better way?
var supportsImageExt = buildTester('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp');
var supportsVideoExt = buildTester('.mp4', '.mkv', '.webm'); // TODO: add missing ones
var supportsAudioExt = buildTester('.mp3', '.wav'); // TODO: add missing ones

var supportsVideoCodec = buildTester('h264', 'vp8');
var supportsAudioCodec = buildTester('mp3', 'aac'); // TODO: add missing ones

var find = function(arr, cb) {
  for (var i=0, len=arr.length; i<len; i++) {
    if (cb(arr[i])) return arr[i];
  }
};

var findVideo = function(arr) {
  return find(arr, function(entry) {
    return entry.codec_type === 'video';
  });
};

var findAudio = function(arr) {
  return find(arr, function(entry) {
    return entry.codec_type === 'audio';
  });
};

var run = function(arr, meta) {
  var res;
  for (var i=0, len=arr.length; i<len; i++) {
    if (res = arr[i](meta)) return res;
  }
  return {
    canPlay: false
  }
};

var tests = [

  // check if it is a supported image file
  function(meta) {
    if (!supportsImageExt(meta.fileExt)) return false;
    return {
      canPlay: true,
      type: 'image'
    };
  },

  // check if it is a supported audio extension
  function(meta) {
    if (!supportsAudioExt(meta.fileExt)) return false;
    return {
      canPlay: true,
      type: 'audio'
    };
  },

  // check if it is a supported video
  function(meta) {
    if (!supportsVideoExt(meta.fileExt)) return false;
    var videoData = findVideo(meta.streams);
    var audioData = findAudio(meta.streams);
    var videoSupported = supportsVideoCodec(videoData.codec_name);
    var audioSupported = supportsAudioCodec(audioData.codec_name);
    return {
      canPlay: videoSupported && audioSupported,
      type: 'video',
      videoSupported: videoSupported,
      audioSupported: audioSupported
    };
  }

];

module.exports = function(file, cb) {
  ffmpeg.ffprobe(file, function(err, meta) {
    if (err) return cb(err);
    meta.fileExt = path.extname(file).toLowerCase();
    cb(null, run(tests, meta), meta);
  })
};
