var projectName = "";

initMain();

function initMain(){
    var pathName=window.document.location.pathname;
    projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    console.log(projectName);
}

//websocket连接地址
var WEB_SOCKET_SERVER = 'wss://39.108.125.225:8010/api/online_decoder';
// var WEB_SOCKET_SERVER = 'wss://' + window.location.hostname + ':8101/api/online_decoder';
//var WEB_SOCKET_SERVER = 'wss://192.168.6.2:8101/api/online_decoder';
var SEND_INTERVAL = '150';

//判断浏览器类型
var userAgent = navigator.userAgent;
var isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1;
var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; // 判断是否为IE<11浏览器
var isEdge = userAgent.indexOf('Edge') > -1 && !isIE; // 判断是否为IE的Edge浏览器
var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
if (isChrome) {
    document.write('<script type="text/javascript" src="'+projectName+'/js/lib/dictate.js"></script>');
    document.write('<script type="text/javascript" src="'+projectName+'/js/lib/recorder.js"></script>');
    document.write('<script type="text/javascript" src="'+projectName+'/js/lib/demo.js"></script>');
} else if (isIE11) {
    var divObj = document.createElement("div");
    divObj.innerHTML = '<span id="flashcontent"><p>Your browser must have JavaScript enabled and the Adobe Flash Player installed.</p></span>';
    document.body.insertBefore(divObj, document.body.firstChild);
    document.write('<script type="text/javascript" src="'+projectName+'/js/flash-lib/swfobject.js"></script>');
    document.write('<script type="text/javascript" src="'+projectName+'/js/flash-lib/recorder.js"></script>');
    document.write('<script type="text/javascript" src="'+projectName+'/js/flash-lib/dictate_flash.js"></script>');
}

function handleVoice2() {
    if (isChrome) {
        handleVoice();
    } else if (isIE11) {
        console.log('isIE11！');
        if (!FWRecorder.isMicrophoneConnected(0)) {
            $("#log").text("信息: 没有可用麦克风" + "\n" + $("#log").text());
            return;
        }
        FWRecorder.handleVoice('audio', 'audio.wav', 0);
    } else if (isIE || isEdge) {
        alert('您的IE版本不支持！');
    }
}

function cancel2() {
    if (isChrome) {
        cancel();
    } else if (isIE11) {
        alert('isIE11！');
    } else if (isIE || isEdge) {
        alert('您的IE版本不支持！');
    }
}

function init2() {
    if (isChrome) {
        init();
    } else if (isIE11) {
        alert('isIE11！');
    } else if (isIE || isEdge) {
        alert('您的IE版本不支持！');
    }
}

function showConfig2() {
    if (isChrome) {
        showConfig();
    } else if (isIE11) {
        $("#log").html(showConfig());
    } else if (isIE || isEdge) {
        alert('您的IE版本不支持！');
    }
}

function clearLog2() {
    if (isChrome) {
        clearLog();
    } else if (isIE11) {
        $("#log").html('');
    } else if (isIE || isEdge) {
        alert('您的IE版本不支持！');
    }
}

function exportVoice2() {
    if (isChrome) {
        exportVoice();
    } else if (isIE11) {
        var blob = FWRecorder.getBlob('audio', 0);//获取音频文件
        window.navigator.msSaveBlob(blob, 'flash.wav');
        return;
    }
}

function clearResult2() {
    clearResult();
}
