// Global UI elements:
//  - log: event log
//  - trans: transcription window

// Global objects:
//  - tt: simple structure for managing the list of hypotheses
//  - dictate: dictate object with control methods 'init', 'startListening', ...
//       and event callbacks onResults, onError, ...
var tt = new Transcription();

var dictate = null;

//读取设备
navigator.mediaDevices.enumerateDevices().then(device=>{
  var deviceInfo = [];

  for(var i=0; i<device.length; i++){
    if(device[i].kind === 'audioinput'){
      deviceInfo.push(device[i]);
    }
  }
  window.deviceId = deviceInfo.length>2 ? deviceInfo[2].deviceId : '';

  dictate = new Dictate({
    interval: SEND_INTERVAL,
    //audioSourceId: window.deviceId,
    server: WEB_SOCKET_SERVER,
    //serverStatus : SERVER_STATUS,
    recorderWorkerPath: '/static/js/lib/recorderWorker.js',
    onReadyForSpeech: function () {
      __message("准备就绪,等待语音！");
      __status("准备就绪,等待语音！");
    },
    onEndOfSpeech: function () {
      __message("语音结束！");
      __status("语音结束!");
    },
    onEndOfSession: function () {
      __message("会话结束！");
      __status("会话结束");
      stopListening();
      /*停止监听*/
    },
    onServerStatus: function (json) {
      __serverStatus(json.num_workers_available + ':' + json.num_requests_processed);
      if (json.num_workers_available == 0) {
        $("#buttonStart").prop("disabled", true);
        $("#serverStatusBar").addClass("highlight");
      } else {
        $("#buttonStart").prop("disabled", false);
        $("#serverStatusBar").removeClass("highlight");
      }
    },
    onPartialResults: function (hypos) {
      // TODO: demo the case where there are more hypos
      tt.add(hypos[0].transcript, false);
      __updateTranscript(tt.toString());
    },
    onResults: function (hypos) {
      // TODO: demo the case where there are more results
      tt.add(hypos[0].transcript, true);
      __updateTranscript(tt.toString());
      // diff() is defined only in diff.html
      if (typeof(diff) == "function") {
        diff();
      }
    },
    onError: function (code, data) {
      if (typeof(data) == 'string' && data.indexOf('No live audio input in this browser') != -1) {
        $('.text-center').text('麦克风未初始化!');
        $('.coverBox').show();
      }
      __error(code, data);
      __status("Viga: " + code);
      dictate.cancel();
    },
    onEvent: function (code, data) {
      __message(code, data);
    }
  });
});

// Private methods (called from the callbacks)
function __message(code, data) {
    //log.innerHTML = "信息: " + code + ": " + (data || '') + "\n" + log.innerHTML;
    $("#log").text("信息: " + code + ": " + (data || '') + "\n" + $("#log").text());
    console.log("信息: " + code + ": " + (data || ''));
}

function __error(code, data) {
    //log.innerHTML = "错误: " + code + ": " + (data || '') + "\n" + log.innerHTML;
    $("#log").text("错误: " + code + ": " + (data || '') + "\n" + $("#log").text());
    console.log("错误: " + code + ": " + (data || ''));
}

function __status(msg) {
    //statusBar.innerHTML = msg;
}

function __serverStatus(msg) {
    serverStatusBar.innerHTML = msg;
}

function __updateTranscript(text) {
    $("#trans").val(text);
    $('#trans').scrollTop($('#trans')[0].scrollHeight);
}

// Public methods (called from the GUI)
function toggleLog() {
    $(log).toggle();
}
function clearLog() {
    $("#log").text("");
}

function clearTranscription() {
    tt = new Transcription();
    $("#trans").val("");
}

function cancel() {
    dictate.cancel();
}

function init() {
  dictate.init();
}

function showConfig() {
    var pp = JSON.stringify(dictate.getConfig(), undefined, 2);
    var data;
    if (pp) {
        try {
            data = JSON.parse(pp);
        } catch (err) {
            data = null;
        }
    } else {
        data = null;
    }
    if (data) {
        /*log.innerHTML = "服务地址: " + data.server+ "\n" +"服务状态: " + data.serverStatus+ "\n"
         +"\n"+"语音数据格式: "+data.contentType+"\n"+
         "语音数据发送时间间隔: "+data.interval;*/

        $("#log").text("服务地址: " + data.server);
    }
    // log.innerHTML = pp + "\n" + log.innerHTML;
    $(log).show();
    console.log(pp)
}
//立即试用
function startFocus() {
    $('.text-area').focus();
    $('body,html').animate({'scrollTop': $('.voice-listen').offset().top - 40}, 500);
}
//处理语音操作
var flag = false;
function handleVoice() {
    if (!flag) {
        if (startListening()) { //开始语音监听
            flag = !flag;
        }
    } else {
        flag = !flag;
        stopListening();//停止语音监听
    }
}

function startListening() {
    if (dictate.startListening()) {
        $('.text-area').focus();
        //$('.voice-box img').addClass('activeImg');
        $('.text-center').text('停止语音转写');
        return true;
    }
    return false;
}

function stopListening() {
    dictate.stopListening();
    //$('.voice-box img').removeClass('activeImg');
    $('.text-center').text('开始语音转写');
    flag = false;
}

//导出音频文件
function exportVoice() {
    var temp = dictate.getBlobs();
    var rs = new Blob(temp, {type: 'audio/x-raw'});
    var reader = new FileReader();
    reader.onload = function () {
        var view = encodeWAV(reader.result);
        Recorder.forceDownload(new Blob([view], {type: 'audio/x-raw'}), 'html5.wav');
    }
    reader.readAsArrayBuffer(rs);
}

function writeString(view, offset, string) {
    for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function encodeWAV(samples) {
    var buffer = new ArrayBuffer(44 + samples.byteLength);
    var view = new DataView(buffer);
    var numChannels = 1;
    var bitsPerSampe = 16;
    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 32 + samples.byteLength, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, numChannels, true);
    /* sample rate */
    view.setUint32(24, 8000, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, 8000 * numChannels * bitsPerSampe / 8, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, numChannels * bitsPerSampe / 8, true);
    /* bits per sample */
    view.setUint16(34, bitsPerSampe, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.byteLength, true);

    var oldView = new DataView(samples);
    for (var i = 0, offset = 44; i < oldView.byteLength; ++i, ++offset) {
        view.setInt8(offset, oldView.getInt8(i));
    }

    return view;
}

window.onload = function () {
    // var location = window.document.location.href.split("=")[1];
    // if(location.indexOf("voiceDictation") != -1){
//创建canvas画布，绘制初始录音图标
        window.canvas = document.querySelector('.circle-wave');
        window.canvasCtx = canvas.getContext("2d");
        canvas.width = 200;
        canvas.height = 200;
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.globalAlpha = 1;
        canvasCtx.beginPath();
        canvasCtx.arc(canvas.width/2, canvas.height/2, 65, 0, 2 * Math.PI);
        canvasCtx.closePath();
        canvasCtx.lineWidth = 4;
        canvasCtx.fillStyle = '#fa4a4b';
        canvasCtx.strokeStyle = '#fa4a4b';
        canvasCtx.fill();
        canvasCtx.stroke();
        var timer = setInterval(()=>{
            if(window.deviceLable){
            this.deviceLable = window.deviceLable;
            clearInterval(timer);
        }
    },100)
        //录音初始化
        init();
    // }

};
