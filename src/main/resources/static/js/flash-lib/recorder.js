
(function(global) {
  var Recorder;

  var RECORDED_AUDIO_TYPE = "audio/wav";

  Recorder = {
        recorder: [],
        recorderOriginalWidth: 0,
        recorderOriginalHeight: 0,
        uploadFormId: null,
        uploadFieldName: null,
        flag: [false, false],

        connect: function(name, attempts, micIndex) {
            if(navigator.appName.indexOf("Microsoft") != -1) {
                Recorder.recorder[micIndex] = window[name];
            } else {
                Recorder.recorder[micIndex] = document[name];
            }

            if(attempts >= 40) {
                return;
            }

            // flash app needs time to load and initialize
            if(Recorder.recorder[micIndex] && Recorder.recorder[micIndex].init) {
                Recorder.recorderOriginalWidth = Recorder.recorder[micIndex].width;
                Recorder.recorderOriginalHeight = Recorder.recorder[micIndex].height;
                if(Recorder.uploadFormId && $) {
                    var frm = $(Recorder.uploadFormId);
                    Recorder.recorder[micIndex].init(frm.attr('action').toString(), Recorder.uploadFieldName, frm.serializeArray());
                }
                return;
            }

            setTimeout(function() {Recorder.connect(name, attempts+1, micIndex);}, 100);
        },

        playBack: function(name, micIndex) {
            // TODO: Rename to `playback`
            Recorder.recorder[micIndex].playBack(name);
        },

        pausePlayBack: function(name, micIndex) {
            // TODO: Rename to `pausePlayback`
            Recorder.recorder[micIndex].pausePlayBack(name);
        },

        playBackFrom: function(name, time, micIndex) {
            // TODO: Rename to `playbackFrom`
            Recorder.recorder[micIndex].playBackFrom(name, time);
        },

        handleVoice: function(name, filename, micIndex){
          if(!Recorder.recorder[micIndex].isMicrophoneAccessible()){
            Recorder.recorder[micIndex].record(name, filename);//触发授权对话框
            return;
          }
          Recorder.flag[micIndex] = ! Recorder.flag[micIndex];
          if(Recorder.flag[micIndex]){
            Recorder.recorder[micIndex].record(name, filename);
            Recorder.recorder[micIndex].observeSamples();
          }else{
            Recorder.recorder[micIndex].stopRecording();
            Recorder.recorder[micIndex].stopObservingSamples();
          }
        },

        record: function(name, filename, micIndex) {
          Recorder.recorder[micIndex].record(name, filename);
          Recorder.recorder[micIndex].observeSamples();
          Recorder.flag[micIndex] = true;
        },

        stopRecording: function(name, micIndex) {
          Recorder.recorder[micIndex].stopRecording();
          Recorder.recorder[micIndex].stopObservingSamples();
          Recorder.flag[micIndex] = false;
        },

        stopPlayBack: function(micIndex) {
            // TODO: Rename to `stopPlayback`
            Recorder.recorder[micIndex].stopPlayBack();
        },

        observeLevel: function(micIndex) {
            Recorder.recorder[micIndex].observeLevel();
        },

        stopObservingLevel: function(micIndex) {
            Recorder.recorder[micIndex].stopObservingLevel();
        },

        observeSamples: function(micIndex) {
            Recorder.recorder[micIndex].observeSamples();
        },

        stopObservingSamples: function(micIndex) {
            Recorder.recorder[micIndex].stopObservingSamples();
        },

        resize: function(width, height, micIndex) {
            Recorder.recorder[micIndex].width = width + "px";
            Recorder.recorder[micIndex].height = height + "px";
        },

        defaultSize: function(micIndex) {
            Recorder.resize(Recorder.recorderOriginalWidth, Recorder.recorderOriginalHeight, micIndex);
        },

        show: function(micIndex) {
            Recorder.recorder[micIndex].show();
        },

        hide: function(micIndex) {
            Recorder.recorder[micIndex].hide();
        },

        duration: function(name, micIndex) {
            // TODO: rename to `getDuration`
            return Recorder.recorder[micIndex].duration(name || Recorder.uploadFieldName);
        },

        getBase64: function(name, micIndex) {
            var data = Recorder.recorder[micIndex].getBase64(name);
            return 'data:' + RECORDED_AUDIO_TYPE + ';base64,' + data;
        },

        getBlob: function(name, micIndex) {
            var base64Data = Recorder.getBase64(name, micIndex).split(',')[1];
            return base64toBlob(base64Data, RECORDED_AUDIO_TYPE);
        },

        getCurrentTime: function(name, micIndex) {
            return Recorder.recorder[micIndex].getCurrentTime(name);
        },

        isMicrophoneAccessible: function(micIndex) {
            return Recorder.recorder[micIndex].isMicrophoneAccessible();
        },

        isMicrophoneConnected: function(micIndex) {
          return Recorder.recorder[micIndex].isMicrophoneConnected();
        },

        updateForm: function(micIndex) {
            var frm = $(Recorder.uploadFormId);
            Recorder.recorder[micIndex].update(frm.serializeArray());
        },

        showPermissionWindow: function(options, micIndex) {
            Recorder.resize(240, 160, micIndex);
            // need to wait until app is resized before displaying permissions screen
            var permissionCommand = function() {
                if (options && options.permanent) {
                    Recorder.recorder[micIndex].permitPermanently();
                } else {
                    Recorder.recorder[micIndex].permit();
                }
            };
            setTimeout(permissionCommand, 1);
        },

        configure: function(rate, gain, silenceLevel, silenceTimeout, micIndex) {
            rate = parseInt(rate || 22);
            gain = parseInt(gain || 100);
            silenceLevel = parseInt(silenceLevel || 0);
            silenceTimeout = parseInt(silenceTimeout || 4000);
            switch(rate) {
                case 44:
                case 22:
                case 11:
                case 8:
                case 5:
                    break;
                default:
                    throw("invalid rate " + rate);
            }

            if(gain < 0 || gain > 100) {
                throw("invalid gain " + gain);
            }

            if(silenceLevel < 0 || silenceLevel > 100) {
                throw("invalid silenceLevel " + silenceLevel);
            }

            if(silenceTimeout < -1) {
                throw("invalid silenceTimeout " + silenceTimeout);
            }

            Recorder.recorder[micIndex].configure(rate, gain, silenceLevel, silenceTimeout);
        },

        setUseEchoSuppression: function(val, micIndex) {
            if(typeof(val) != 'boolean') {
                throw("invalid value for setting echo suppression, val: " + val);
            }

            Recorder.recorder[micIndex].setUseEchoSuppression(val);
        },

        setLoopBack: function(val, micIndex) {
            if(typeof(val) != 'boolean') {
                throw("invalid value for setting loop back, val: " + val);
            }

            Recorder.recorder[micIndex].setLoopBack(val);
        }
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

  global.FWRecorder = Recorder;

})(this);
