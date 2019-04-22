var fatherNowPage = "";
var fatherNowPageText = "";
$(document).ready(function(){
    /**首页复制自带特效代码，暂时无用，如果不需首页特效代码可以去掉---start**/
    $(".flexiselDemo3").flexisel({
        visibleItems: 4,
        animationSpeed: 1000,
        autoPlay: true,
        autoPlaySpeed: 3000,
        pauseOnHover: true,
        enableResponsiveBreakpoints: true,
        responsiveBreakpoints: {
            portrait: {
                changePoint:480,
                visibleItems: 1
            },
            landscape: {
                changePoint:640,
                visibleItems: 2
            },
            tablet: {
                changePoint:768,
                visibleItems: 3
            }
        }
    });
    $("#flexiselDemo4").flexisel({
        visibleItems: 1,
        animationSpeed: 1000,
        autoPlay: true,
        autoPlaySpeed: 3000,
        pauseOnHover: true,
        enableResponsiveBreakpoints: true,
        responsiveBreakpoints: {
            portrait: {
                changePoint:480,
                visibleItems: 1
            },
            landscape: {
                changePoint:640,
                visibleItems: 1
            },
            tablet: {
                changePoint:768,
                visibleItems: 1
            }
        }
    });
    /**首页复制自带特效代码，暂时无用，如果不需首页特效代码可以去掉---end**/
});

//“在线试用”小标题悬浮tab显示
function trialClickDown(){
    $("#trialClickDropDown").slideDown();
    $("#downloadDropDown").slideUp();
}

//悬浮窗消失
function sigUp(){
    $("#trialClickDropDown").slideUp();
    $("#downloadDropDown").slideUp();
}
//“下载”小标题悬浮tab显示
function downloadClickDown(){
    $("#downloadDropDown").slideDown();
    $("#trialClickDropDown").slideUp();
}

//点击悬浮窗的选项显示下面iframe的区域
function changeSub(e){
    e.style.color = "#fc5700";
    if(e.id == "mainPage"){
        $("#developerCenter").css("color","#ffffff");
    }else{
        $("#mainPage").css("color","#ffffff");
    }
    $("#trial").css("color","#ffffff");
    $("#downloadDropDownAble").css("color","#ffffff");
}


function showVoice(e,page){
    fatherNowPage = page;
    fatherNowPageText = e.innerText;
    var iframe = document.getElementById('external-frame');
    if(page != "main"){
        iframe.src = "toPage?page=main";
    }else{
        iframe.src = "toPage?page="+page+"";
    }
    $("#trial").css("color","#fc5700");
    $("#mainPage").css("color","#ffffff");
    $("#developerCenter").css("color","#ffffff");
    $("#downloadDropDownAble").css("color","#ffffff");
}