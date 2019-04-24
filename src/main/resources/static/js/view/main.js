var pathname = window.document.location.pathname;
var realPath = pathname.substr(pathname.indexOf('/',pathname.substr(1).indexOf('/')+2)+1);
var nowPage;
switch (realPath) {
    case 'voiceDictation':nowPage='语音听写';break;
    case 'voiceToWords':nowPage='语音转写';break;
    case 'voiceOneSentence':nowPage='一句话转写';break;
    default:
}
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
function initPage(){
    var choseMenu = "";
    var url = window.location.href;
    // //根据栏目代码来改变右侧iframe的显示内容
    // if(fatherNowPage=="main"){
    //     document.getElementById('external-frame').src = "toPage?page=voiceDictation";
    //     choseMenu = $("#voiceChange");
    // }else{
    //     document.getElementById('external-frame').src = "toPage?page="+fatherNowPage+"";
    //     choseMenu = $("#"+window.parent.fatherNowPage+"");
    // }
    //更改选中和没选中项目的样式
    // var ul = choseMenu[0].parentElement.parentElement;
    // for(var i = 0;i < ul.children.length;i++){
    //     ul.children[i].children[0].style.backgroundColor = "#82848a";
    //     ul.children[i].children[0].style.color = "#FFFFFF";
    // }
    // nowPage = window.parent.fatherNowPageText;
    // choseMenu[0].style.backgroundColor = '#FFFFFF';
    // choseMenu[0].style.color = "#000000";
    if(nowPage == "语音听写" || nowPage == "语音转写" || nowPage == "一句话转写"  || nowPage == "语音合成"  || nowPage == "声纹识别" ){
        document.getElementById("voiceRecognize").className = "nav nav-second-level collapse in";
        document.getElementById("voiceAnother").className = "nav nav-second-level collapse";
        document.getElementById("systemManage").className = "nav nav-second-level collapse";
    }else if(nowPage == "自然语言处理" || nowPage == "机器翻译" || nowPage == "人机交互"  || nowPage == "文字识别"){
        document.getElementById("voiceRecognize").className = "nav nav-second-level collapse";
        document.getElementById("voiceAnother").className = "nav nav-second-level collapse in";
        document.getElementById("systemManage").className = "nav nav-second-level collapse";
    }else{
        document.getElementById("voiceRecognize").className = "nav nav-second-level collapse";
        document.getElementById("voiceAnother").className = "nav nav-second-level collapse";
        document.getElementById("systemManage").className = "nav nav-second-level collapse in";
    }

}

//悬浮样式
function move(e){
    e.style.backgroundColor = '#FFFFFF';
    e.style.color = "#000000";
}

//悬浮样式
function out(e){
    if(e.innerText != nowPage){
        e.style.backgroundColor = '#98bbe6';
        e.style.color = "#FFFFFF";
    }
}

$(document).ready(function () {
    /**缩进符号点击事件--start**/
    $('#'+realPath).css("background-color","#FFFFFF");
    var trigger = $('.hamburger'),
        overlay = $('.overlay');
        isClosed = false;
        hamburger_cross();
        $('#wrapper').toggleClass('toggled');
    if (isClosed){
        $('#page-content-wrapper').css("width","85%");
    }
    else
        $('#page-content-wrapper').css("width","100%");
    trigger.click(function () {
        hamburger_cross();
    });

    function hamburger_cross() {

        if (isClosed == true) {
            //overlay.hide();
            trigger.removeClass('is-open');
            trigger.addClass('is-closed');
            isClosed = false;
        } else {
            //overlay.show();
            trigger.removeClass('is-closed');
            trigger.addClass('is-open');
            isClosed = true;
        }
    }

    $('[data-toggle="offcanvas"]').click(function () {
        //根据isClosed判断是否缩进状态，并且根据页面不同来修改子页面元素的状态
        if (isClosed){
            $('#page-content-wrapper').css("width","85%");
        }
        else
            $('#page-content-wrapper').css("width","100%");
        $('#wrapper').toggleClass('toggled');
    });
    /**缩进符号点击事件--end**/
});