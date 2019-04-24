var guid;
var startUploadInteval;
/**
 * @description 真正提交文件方法
 * @method
 * @param  * @param null
 * @return
 * @date: 2019/4/19 15:58
 * @author:yangfengming
 */
function uploadFiles(v) {
    var fd = new FormData();
    fd.append('files', v.files[0]);  //files为页面选取的文件
    $.ajax({
        url: 'https://39.108.125.225:8010/api/offline_decoder/send_voice_data_sync',
        type:'post',
        contentType: false,
        processData:false,
        data: fd,
        beforeSend: function(){
            $('#log').text(new Date().format('yyyy/MM/dd hh:mm:ss')+'开始上传');
            $('body').loading({
                loadingWidth:225,
                loadingHeight:135,
                title:'正在上传文件',
                name:'createScript',
                discription:'',
                titleColor:'#FFFFFF',
                direction:'column',
                type:'origin',
                originBg:'#FF7F50',
                originDivWidth:60,
                originDivHeight:60,
                originWidth:10,
                originHeight:10,
                smallLoading:false,
                loadingBg:'rgba(61,170,233,0.9)',
                loadingMaskBg:'rgba(0,0,0,0.2)'
            });
        },
        success: function (res) {
            console.log(res);
            if(res.err==0){ //res.err为0为操作成功，否则请求失败，res.errMsg为错误信息
                //res.data为转文本内容绑定到页面
                $("#log").text(new Date().format('yyyy/MM/dd hh:mm:ss')+"操作成功\n"+$("#log").text());
                $("#mainArea").val(res.data);
            }else {
                $("#log").text(new Date().format('yyyy/MM/dd hh:mm:ss')+"操作失败:"+res.errMsg+"\n"+$("#log").text());
                console.log(res.errMsg);
            }
        },
        error: function (data) {
        }
    })
}

/**
 * @description 点击图片触发file提交
 * @method
 * @param  * @param null
 * @return
 * @date: 2019/4/19 15:58
 * @author:yangfengming
 */
function clickUpload(){
    $("#headImg").click();
}