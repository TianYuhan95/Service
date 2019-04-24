var guid;
// var startUploadInteval;
var startUpTimeout;
/**
 * @description 真正提交文件方法
 * @method
 * @param  * @param null
 * @return
 * @date: 2019/4/19 16:01
 * @author:yangfengming
 */
function uploadFiles(v) {
    var fd = new FormData();
    fd.append('files', v.files[0]);  //files为页面选取的文件
    // var loading = this.$loading({
    //     lock: true,
    //     text: '语音合成中...',
    //     spinner: 'el-icon-loading'
    // });
    $.ajax({
        url: globalVariable.uploadFileAsyncAddress,
        type:'post',
        data: fd,
        dataType: 'json',
        contentType: false,
        processData:false,
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
        complete: function(){removeLoading('createScript')},
        success: function (res) {
            if(res.err==0){
                //res.err为0为操作成功，否则请求失败，res.errMsg为错误信息
                $("#log").text(new Date().format('yyyy/MM/dd hh:mm:ss')+"上传成功\n"+$("#log").text());
                guid = res.data;
                // loading.close();
                // startUploadInteval=self.setInterval("startUpload()",2000);
                setTimeout(startUpload,1000);
            }
            else {
                console.log(res.errMsg);
                $("#log").text(new Date().format('yyyy/MM/dd hh:mm:ss')+"上传错误"+res.errMsg+'\n'+$("#log").text());
            }
        },
        error: function (data) {
            $("#log").text(new Date().format('yyyy/MM/dd hh:mm:ss')+'上传错误,请检查文件格式\n'+$("#log").text());
        }
    })

}
/**
 * @description 转写之后操作
 * @method
 * @param  * @param null
 * @return
 * @date: 2019/4/19 16:02
 * @author:yangfengming
 */
function startUpload(){
    var i = 0;
    $.ajax({
        url: globalVariable.getChangeResultAddress,
        type:'post',
        data: { Guid:guid }, //res.data为返回的guid，用guid获取转写进度
        dataType: 'json',
        success: function (res) {
            if(res.err==0){
                //获取到转写进度和内容绑定到页面
                //res.data.rare表示转写进度
                //res.data.isFinish表示转写状态，0为正在转写，1为已完成
                //res.data.transcript表示转文本结果
                if(res.data.isFinish == 1){
                    console.log(res.data.transcript);
                    $("#log").text(new Date().format('yyyy/MM/dd hh:mm:ss ')+" 转写进度:"+res.data.rare+'\n'+$("#log").text());
                    $("#mainArea").val(res.data.transcript);
                    // clearInterval(startUploadInteval);
                    clearTimeout(startUpTimeout);
                }else if (i>=150){
                    alert("已超时，请重试");
                } else {
                    $("#log").text(new Date().format('yyyy/MM/dd hh:mm:ss ')+" 转写进度:"+res.data.rare+'\n'+$("#log").text());
                }
            }else{}
        },
        error: function (data, res) {
        }
    });
    i++;
    startUpTimeout = setTimeout(startUpload,500);
}

/**
 * @description 点击图片触发file提交
 * @method
 * @param  * @param null
 * @return
 * @date: 2019/4/19 16:01
 * @author:yangfengming
 */
function clickUpload(){
    $("#headImg").click();
}
