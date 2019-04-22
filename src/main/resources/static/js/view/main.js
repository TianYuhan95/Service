var nowPage = "";
function initPage(nowPage){
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
        document.getElementById("voiceAnother").className = "nav nav-second-level";
        document.getElementById("systemManage").className = "nav nav-second-level";
    }else if(nowPage == "自然语言处理" || nowPage == "机器翻译" || nowPage == "人机交互"  || nowPage == "文字识别"){
        document.getElementById("voiceRecognize").className = "nav nav-second-level";
        document.getElementById("voiceAnother").className = "nav nav-second-level collapse in";
        document.getElementById("systemManage").className = "nav nav-second-level";
    }else{
        document.getElementById("voiceRecognize").className = "nav nav-second-level";
        document.getElementById("voiceAnother").className = "nav nav-second-level";
        document.getElementById("systemManage").className = "nav nav-second-level collapse in";
    }
    console.log(nowPage)
}

//切换主要区域显示栏目的iframe内容
function showVoice(e,page){
    // $("#mainTitle").text(e.innerText);
    // document.getElementById('external-frame').src = "toPage?page="+page+"";
    $("#external-frame").load(page);
    var ul = e.parentElement.parentElement;
    for(var i = 0;i < ul.children.length;i++){
        ul.children[i].children[0].style.backgroundColor = "#82848a";
        ul.children[i].children[0].style.color = "#FFFFFF";
    }
    e.style.backgroundColor = '#FFFFFF';
    e.style.color = "#000000";
    nowPage = e.innerText;
}

//悬浮样式
function move(e){
    e.style.backgroundColor = '#FFFFFF';
    e.style.color = "#000000";
}

//悬浮样式
function out(e){
    if(e.innerText != nowPage){
        e.style.backgroundColor = '#82848a';
        e.style.color = "#FFFFFF";
    }
}

$(document).ready(function () {
    /**缩进符号点击事件--start**/
    var trigger = $('.hamburger'),
        overlay = $('.overlay');
        isClosed = true;
    // hamburger_cross();
    // $('#wrapper').toggleClass('toggled');

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
        if(isClosed == false && nowPage == "语音合成"){
            $("#external-frame").contents().find("#voice-listen").width("98%");
        }else if(isClosed == true && nowPage == "语音合成"){
            $("#external-frame").contents().find("#voice-listen").width("85%");
        }
        else if(isClosed == false && (nowPage == "语音听写" || nowPage == "语音转写" || nowPage == "一句话转写")){
            $("#external-frame").contents().find("#voiceFir").width("45%");
            $("#external-frame").contents().find("#voiceSec").width("45%");
        }else if(isClosed == true && (nowPage == "语音听写" || nowPage == "语音转写" || nowPage == "一句话转写")){
            $("#external-frame").contents().find("#voiceFir").width("40%");
            $("#external-frame").contents().find("#voiceSec").width("40%");
        }
        else if(isClosed == false && (nowPage == "自然语言处理")){
            $("#external-frame").contents().find("#voiceLanguage").width("95%");
        }else if(isClosed == true && (nowPage == "自然语言处理")){
            $("#external-frame").contents().find("#voiceLanguage").width("85%");
        }else if(isClosed == false && (nowPage == "机器翻译")){
            $("#external-frame").contents().find("#elRow").width("52%");
        }else if(isClosed == true && (nowPage == "机器翻译")){
            $("#external-frame").contents().find("#elRow").width("40%");
        }else if(isClosed == false && (nowPage == "文字识别")){
            $("#external-frame").contents().find("#leftPub").width("50%");
            $("#external-frame").contents().find("#rightPub").width("50%");
        }else if(isClosed == true && (nowPage == "文字识别")){
            $("#external-frame").contents().find("#leftPub").width("45%");
            $("#external-frame").contents().find("#rightPub").width("43%");
        }
        $('#wrapper').toggleClass('toggled');
    });
    /**缩进符号点击事件--end**/
});