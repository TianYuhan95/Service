/**
 * Created by user on 2018-05-25.
 * 支持html5 audio api录音上传，不支持audio api的则用flash录音，录音完成后生成文件用于上传
 */

//定义全局的麦克风录音上传wav文件接口
(function (global) {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  window.URL = window.URL || window.webkitURL;
  window.OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;

  var err_msg = function (msg) {
    console.log(msg);
  };

  function base64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
  }

  var WORKER_PATH = '/static/js/record-upload/mic-recorder-worker.js';

  //录音对象封装
  var Recorder = function (source, cfg) {
    var config = cfg || {};
    var bufferLen = config.bufferLen || 4096;
    var outSampleRate = config.outSampleRate;
    this.context = source.context;
    this.node = this.context.createScriptProcessor(bufferLen, 1, 1);
    var worker = new Worker(config.workerPath || WORKER_PATH);
    worker.postMessage({
      command: 'init',
      config: {
        outSampleRate: config.outSampleRate,
        outSampleBits: 16
      }
    });

    var recording = false, currCallback;

    this.node.onaudioprocess = function (e) {
      if (!recording) return;
      var inputBuffer = e.inputBuffer;
      var numChannels = inputBuffer.numberOfChannels;
      var numFrames = inputBuffer.length * outSampleRate / inputBuffer.sampleRate;
      var offlineContext = new OfflineAudioContext(numChannels, numFrames, outSampleRate);
      var bufferSource = offlineContext.createBufferSource();
      bufferSource.buffer = inputBuffer;
      offlineContext.oncomplete = function (e) {
        worker.postMessage({
          command: 'record',
          buffer: [
            e.renderedBuffer.getChannelData(0)
          ]
        });
      };
      bufferSource.connect(offlineContext.destination);
      bufferSource.start(0);
      offlineContext.startRendering();
    };

    var timerWave = null;

    this.start = function () {
      recording = true;
      source.connect(this.node);
      this.node.connect(this.context.destination);
      if(!window.sampleBox){
        timerWave = setInterval(drawWave,20);
      }
    };

    this.stop = function () {
      this.node.disconnect();
      recording = false;
      if(!window.sampleBox){
        clearInterval(timerWave);
      }
    };

    this.clear = function () {
      worker.postMessage({command: 'clear'});
    };

    this.exportWAV = function (cb, type) {
      currCallback = cb || config.callback;
      type = type || config.type || 'audio/wav';
      if (!currCallback) throw new Error('Callback not set');
      worker.postMessage({
        command: 'exportWAV',
        type: type
      });
    };

    worker.onmessage = function (e) {
      var blob = e.data;
      currCallback(blob);
    };
  };
  //flash的录音对象封装
  var FlashRecorder = {
    recorder: null,
    recorderOriginalWidth: 0,
    recorderOriginalHeight: 0,

    connect: function (objName, attempts) {
      if (navigator.appName.indexOf("Microsoft") != -1) {
        FlashRecorder.recorder = window[objName];
      } else {
        FlashRecorder.recorder = document[objName];
      }
      if (attempts >= 40) {
        err_msg('初始化录音设备失败');
        this.isReady = false;
        return;
      }
      // flash app needs time to load and initialize
      if (FlashRecorder.recorder && FlashRecorder.recorder.init) {
        recorderOriginalWidth = FlashRecorder.recorder.width;
        recorderOriginalHeight = FlashRecorder.recorder.height;
        FlashRecorder.isReady = true;
        return;
      }

      var that = this;
      setTimeout(function () {
        that.connect(objName, attempts + 1);
      }, 100);
    },

    start: function (name) {
      FlashRecorder.recorder.record(name, 'temp.wav');
    },

    stop: function () {
      FlashRecorder.recorder.stopRecording();
    },

    getBase64: function (name) {
      var data = FlashRecorder.recorder.getBase64(name);
      return 'data:audio/wav;base64,' + data;
    },

    exportWAV: function (name, cb) {
      var base64Data = this.getBase64(name).split(',')[1];
      if (cb) {
        cb(base64toBlob(base64Data, 'audio/wav'));
      }
    },

    resize: function (width, height) {
      FlashRecorder.recorder.width = width + "px";
      FlashRecorder.recorder.height = height + "px";
    },

    defaultSize: function () {
      FlashRecorder.resize(FlashRecorder.recorderOriginalWidth, FlashRecorder.recorderOriginalHeight);
    },

    showPermissionWindow: function (options) {
      FlashRecorder.resize(240, 160);
      // need to wait until app is resized before displaying permissions screen
      var permissionCommand = function () {
        if (options && options.permanent) {
          FlashRecorder.recorder.permitPermanently();
        } else {
          FlashRecorder.recorder.permit();
        }
      };
      setTimeout(permissionCommand, 1);
    },

    isMicrophoneConnected: function () {
      return FlashRecorder.recorder.isMicrophoneConnected();
    },

    isMicrophoneAccessible: function () {
      return FlashRecorder.recorder.isMicrophoneAccessible();
    }
  };

  function drawWave() {
    userSpeechAnalyser.getByteTimeDomainData(dataArray);
    var prev = canvasCtx.globalCompositeOperation;
    canvasCtx.globalCompositeOperation = 'destination-in';
    canvasCtx.globalAlpha = 0.4; //0.4
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    canvasCtx.globalCompositeOperation = prev;
    for (var i = 0; i < bufferLength; i++) {
      var v = dataArray[i] / 128.0;
      var radius = parseInt(v * canvas.height / 3.2);
      if (radius < 60) {
        radius = 60;
      } else if (radius > 80) {
        radius = 80;
      }
      canvasCtx.beginPath();
      canvasCtx.arc(canvas.width/2, canvas.height/2, radius, 0, 2 * Math.PI);
      canvasCtx.closePath();
      canvasCtx.fillStyle = '#fa4a4b';
      canvasCtx.fill();
    }
    canvasCtx.lineWidth = 4;
    canvasCtx.strokeStyle = '#fa4a4b';
    canvasCtx.stroke();
  }

  window.fwru_event_handler = function fwr_event_handler() {
    switch (arguments[0]) {
      case "ready":
        var width = parseInt(arguments[1]);
        var height = parseInt(arguments[2]);
        FlashRecorder.connect("recorder", 0);
        FlashRecorder.recorderOriginalWidth = width;
        FlashRecorder.recorderOriginalHeight = height;
        break;
      case "microphone_user_request":
        $('#recorder').css({
          "position": "absolute",
          "top": "50%",
          "left": "50%",
          "margin-left": "-120px",
          "margin-top": "-80px"
        });
        FlashRecorder.showPermissionWindow({permanent: true}, arguments[1]);
        break;
      case "permission_panel_closed":
        FlashRecorder.defaultSize();
        $('#recorder').css("position", "absolute");
        break;
    }
  };

  //对外接口对象
  var MicRecorderUpload = function (cfg) {
    var config = cfg || {};
    config.outSampleBits = config.outSampleBits || 16; //目标采样位数
    config.outSampleRate = config.outSampleRate || 8000; //目标采样频率
    var errorHandler = config.errorHandler || err_msg;
    var flashRec = false;
    var recorder = null;
    var name = ''; //录音名，flash接口使用
    //初始化录音
    var init = function () {
      if (navigator.getUserMedia) {
        navigator.getUserMedia(
          {audio: true}, //只启用音频
          function (stream) {
            try {
              var audioContext = new AudioContext();
              var audioInput = audioContext.createMediaStreamSource(stream);
              recorder = new Recorder(audioInput, config);
              //获取音频波动信息，用于绘制声纹
              window.source = audioInput;
              window.userSpeechAnalyser = audioContext.createAnalyser();
              userSpeechAnalyser.fftSize = 2048;
              window.bufferLength = userSpeechAnalyser.frequencyBinCount;
              window.dataArray = new Uint8Array(bufferLength);
            } catch (e) {
              errorHandler("初始化浏览器音频处理功能(Web Audio)失败: " + e);
            }
          },
          function (error) {
            switch (error.code || error.name) {
              case 'PERMISSION_DENIED':
              case 'PermissionDeniedError':
                errorHandler('用户拒绝麦克风使用权限');
                break;
              case 'NOT_SUPPORTED_ERROR':
              case 'NotSupportedError':
                errorHandler('浏览器不支持录音设备');
                break;
              case 'MANDATORY_UNSATISFIED_ERROR':
              case 'MandatoryUnsatisfiedError':
                errorHandler('无法发现指定的录音设备。');
                break;
              default:
                errorHandler('没有可用麦克风');
                break;
            }
          }
        );
      } else {
        flashRec = true;
        name = new Date().toISOString();
        var appWidth = 1;
        var appHeight = 1;
        var params = {};
        var attributes = {'id': "recorder", 'name': "recorder", 'align': "middle"};
        swfobject.embedSWF("/static/js/record-upload/flash-upload.swf", "flashcontent", appWidth, appHeight, "11.0.0", "", {'mic_index': 0}, params, attributes);
        recorder = FlashRecorder;
      }
    };
    init();
    //开始录音
    this.recording = function () {
      if (flashRec) {
        try {
          if (!recorder.isMicrophoneConnected()) {
            errorHandler("无录音设备");
            return false;
          } else if (!recorder.isMicrophoneAccessible()) {
            recorder.start(name);
            return false;
          } else {
            recorder.start(name);
          }
        } catch (e) {
          errorHandler("初始化录音失败");
          return false;
        }
      } else if (!recorder) {
        errorHandler("无录音设备");
        return false;
      } else {
        recorder.clear();
        recorder.start();
      }
      return true;
    };

    //停止录音
    this.stopRecording = function () {
      if (recorder) {
        recorder.stop();
      }
    };

    this.exportWav = function (cb) {
      if (flashRec) {
        recorder.stop();
        recorder.exportWAV(name, function (blob) {
          cb(blob);
        });
      } else if (recorder) {
        recorder.stop();
        recorder.exportWAV(function (blob) {
          cb(blob);
        }, 'audio/wav');
      }
    };

    //上传wav文件到服务器
    this.upload = function (url, callback) {
      if (recorder) {
        recorder.stop();
        recorder.exportWAV(function (blob) {
          if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, 'flash.wav');
          } else {
            var url = (window.URL || window.webkitURL).createObjectURL(blob);
            var link = window.document.createElement('a');
            link.href = url;
            link.download = 'output.wav';
            var click = document.createEvent("HTMLEvents");
            click.initEvent("click", true, true);
            link.dispatchEvent(click);
            link.click();
          }

          /*var fd = new FormData();
           fd.append('audioData', blob);
           var xhr = new XMLHttpRequest();
           if (callback) {
           xhr.upload.addEventListener('progress', function (e) {
           callback('uploading', e);
           }, false);
           xhr.addEventListener('load', function (e) {
           callback('ok', e, blob);
           }, false);
           xhr.addEventListener('error', function (e) {
           callback('error', e);
           }, false);
           xhr.addEventListener('abort', function (e) {
           callback('cancel', e);
           }, false);
           }
           xhr.open('POST', url);
           xhr.send(fd);*/
        }, 'audio/wav');
      }
    };
  };

  window.MicRecorderUpload = MicRecorderUpload;
})(this);


