(function(global) {
  var configserver = WEB_SOCKET_SERVER;
  var CONTENT_TYPE = "content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)8000,+format=(string)S16LE,+channels=(int)1";
  global.showConfig = function() {
    return "服务地址: " + configserver;
  };

  $(function () {
    //flash初始化

//  Embedding flash object ---------------------------------------------------------------------------------------------
    //setUpFormOptions();
    var appWidth = 1;
    var appHeight = 1;
    var params = {};
    var attributes = {'id': "recorder0", 'name': "recorder0", 'align' : "middle"};
    swfobject.embedSWF("/static/js/flash-lib/flashrecorder.swf", "flashcontent", appWidth, appHeight, "11.0.0", "", {'mic_index': 0}, params, attributes);

    //处理识别结果，支持结果类似动画显示
    window.Transcription = function() {
      var index = 0;
      var list = [];
      var textRs = "";

      this.add = function(text, isFinal) {
        list[index] = text;
        if (isFinal) {
          textRs += list.join('');
          index = 0;
          list = [];
        }
      };

      this.toString = function() {
        return textRs + list.join('');
      };

      this.clear = function(){
        index = 0;
        list = [];
        textRs = '';
      };
    };

    window.TempBuffer = function(){
      var buffer = [];
      this.add = function(tempData){
        this.buffer.push(tempData);
      };
      this.getData = function(){
        var tmp = this.buffer.splice(0, 20);
        var rs = [];
        for(var i = 0; i < tmp.length; ++i){
          for(var j = 0; j < tmp[i].length; ++j){
            rs.push(tmp[i][j]);
          }
        }
        return rs;
      };
      this.clear = function(){
        this.buffer = [];
      }
    };

    var wsArray = []; //websocket连接池
    var intervalKey = []; //定时检测发送数据
    var tt = [new Transcription(), new Transcription()];
    var audiobuffer = [new TempBuffer(), new TempBuffer()];
    //  Handling FWR events ------------------------------------------------------------------------------------------------
    window.fwr_event_handler = function fwr_event_handler() {
      switch (arguments[0]) {
        case "ready":
          //请求麦克风使用权限
          var args = arguments;
          window.onload = function(){
            if(!FWRecorder.isMicrophoneAccessible(args[3]) && FWRecorder.isMicrophoneConnected(args[3])){
              recorderEl(args[3]).addClass("floating");
              FWRecorder.showPermissionWindow({permanent: true}, args[3]);
            }
          };
          var width = parseInt(arguments[1]);
          var height = parseInt(arguments[2]);
          FWRecorder.connect("recorder" + arguments[3], 0, arguments[3]);
          FWRecorder.recorderOriginalWidth = width;
          FWRecorder.recorderOriginalHeight = height;
          break;

        case "no_microphone_found":
          __message('没有可用麦克风');
          break;

        case "microphone_samples":
          try {
            audiobuffer[arguments[2]].add(arguments[1]);
          }
          catch (e) {
            console.log(e);
          }
          break;

        case "microphone_user_request":
          recorderEl(arguments[1]).addClass("floating");
          FWRecorder.showPermissionWindow({permanent: true}, arguments[1]);
          break;

        case "microphone_connected":
          FWRecorder.isReady = true;
          break;

        case "permission_panel_closed":
          FWRecorder.defaultSize(arguments[1]);
          recorderEl(arguments[1]).removeClass("floating");
          break;

        case "recording":
          var micIndex = arguments[2];
          console.log('当前使用的麦克风名:' + arguments[3]);
          FWRecorder.hide(arguments[2]);
          $('.text-area').focus();
          $('.voice-box img').addClass('activeImg');
          $('.text-center').text('停止语音转写');

          if (wsArray[micIndex]) {
            wsArray[micIndex].close();
            wsArray[micIndex] = null;
          }
          try {
            audiobuffer[micIndex].clear();
            wsArray[micIndex] = createWebSocket(micIndex);
            __message('开始录音');
          } catch (e) {
            __message("此浏览器不支持Web Socket,无法向服务发送语音数据!");
          }
          break;

        case "recording_stopped":
          var micIndex = arguments[3];
          clearInterval(intervalKey[micIndex]);
          //发送剩余数据
          var rs = audiobuffer[micIndex].getData();
          while(rs.length > 0){
            try {
              socketSend(wsArray[micIndex], rs);
            }
            catch (e) {
              __message(e);
            }
            rs = audiobuffer[micIndex].getData();
          }
          if (wsArray[micIndex] && wsArray[micIndex].readyState == 1) {
            wsArray[micIndex].send('EOS');
            wsArray[micIndex].close();
            wsArray[micIndex] = null;
          }
          var duration = arguments[2];
          FWRecorder.show(micIndex);
          $('.voice-box img').removeClass('activeImg');
          $('.text-center').text('开始语音转写');
          __message('停止录音');
          break;
      }
    };

    window.clearResult = function(){
      $("#trans").val("");
      tt[0].clear();
      tt[1].clear();
    };
//  Helper functions ---------------------------------------------------------------------------------------------------

    function recorderEl(index) {
      return $('#recorder' + index);
    }

    //---------websocket连接以及语音数据处理函数-----------------------------------------

    //创建连接
    function createWebSocket(index) {
      // TODO: do we need to use a protocol?
      let url = configserver + '?' + CONTENT_TYPE;
      let ws = new WebSocket(url);
      //处理引擎返回的识别结果
      ws.onmessage = function (e) {
        var id = "#trans"; // 页面中textarea的id
        //处理引擎返回的识别结果
        var data = e.data;
        //config.onEvent(MSG_WEB_SOCKET, data);
        if (data instanceof Object && !(data instanceof Blob)) {
          __message('WebSocket: onEvent: got Object that is not a Blob');
        } else if (data instanceof Blob) {
          __message('WebSocket: got Blob');
        } else {
          try{
            var res = JSON.parse(data);
            if (res.status == 0) {
              if (res.result) {
                if (res.result.final) {
                  tt[index].add(res.result.hypotheses[0].transcript, true);
                  $(id).val(tt[index].toString());
                  console.log(res.result.hypotheses[0].transcript);
                } else {
                  tt[index].add(res.result.hypotheses[0].transcript, false);
                  $(id).val(tt[index].toString());
                  console.log(res.result.hypotheses[0].transcript);
                }
              }
            } else {
              __error_message('服务端错误: ' + res.status + ': ' + getDescription(res.status));
            }
          }catch(error){
            console.log(data);
          }
        }
      };
      // Start recording only if the socket becomes open
      ws.onopen = function (e) {
        intervalKey[index] = setInterval(function () {
          var rs = audiobuffer[index].getData();
          if(rs.length > 0){
            try {
              socketSend(ws, rs);
            }
            catch (e) {
              __error_message(e);
            }
          }
        }, SEND_INTERVAL);
      };

      // This can happen if the blob was too big
      // E.g. "Frame size of 65580 bytes exceeds maximum accepted frame size"
      // Status codes
      // http://tools.ietf.org/html/rfc6455#section-7.4.1
      // 1005:
      // 1006:
      ws.onclose = function (e) {
        var code = e.code;
        var reason = e.reason;
        var wasClean = e.wasClean;
        // The server closes the connection (only?)
        // when its endpointer triggers.
        __message("会话结束！");
        FWRecorder.stopRecording('audio', index);//停止语音监听
        __message(e.code + "/" + e.reason + "/" + e.wasClean);
      };

      ws.onerror = function (e) {
        __error_message('websocket连接错误');
      };
      return ws;
    }
    //发送数据
    function socketSend(ws, item) {
      if (ws) {
        var state = ws.readyState;
        if (state == 1) {
          // If item is an audio blob
          if (item instanceof Array) {
            if (item.length > 0) {
              var tembuf = exportRAW(item);
              try {
                ws.send(tembuf);
                __message('发送: blob: ' + tembuf.type + ', ' + tembuf.size);
              }
              catch (e) {
                __message(e);
              }
            } else {
              console.log('send: blob: , EMPTY');
            }
          } else {
            ws.send(item);
            console.log('send biaoji: ' + item);
          }
        } else {
          __error_message('WebSocket: readyState!=1: ' + state + ": 发送失败");
        }
      } else {
        __error_message('无Web socket连接: 发送失败: ' + item);
      }
    }

    function floatTo16BitPCM(output, offset, input) {
      for (var i = 0; i < input.length; i++, offset += 2) {
        var s = input[i]
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }
    }

    function encodeRAW(samples) {
      var buffer = new ArrayBuffer(samples.length * 2);
      var view = new DataView(buffer);
      floatTo16BitPCM(view, 0, samples);
      return view;
    }

    function exportRAW(recBuffers) {
      var buffer = new Float32Array(recBuffers);
      var dataview = encodeRAW(buffer);
      var audioBlob = new Blob([dataview.buffer], {type: 'audio/x-raw'});
      return audioBlob;
    }

    var SERVER_STATUS_CODE = {
      0: 'Success', // Usually used when recognition results are sent
      1: 'No speech', // Incoming audio contained a large portion of silence or non-speech
      2: 'Aborted', // Recognition was aborted for some reason
      9: 'No available', // Recognizer processes are currently in use and recognition cannot be performed
    };
    function getDescription(code) {
      if (code in SERVER_STATUS_CODE) {
        return SERVER_STATUS_CODE[code];
      }
      return "Unknown error";
    }

    function __message(data) {
      $("#log").text("信息: " + (data || '') + "\n" + $("#log").text());
    }

    function __error_message(data) {
      $("#log").text("错误: " + (data || '') + "\n" + $("#log").text());
    }
  });
})(this);
