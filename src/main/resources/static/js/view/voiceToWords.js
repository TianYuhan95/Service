// var guid;
// var startUploadInteval;
// /**
//  * @description 真正提交文件方法
//  * @method
//  * @param  * @param null
//  * @return
//  * @date: 2019/4/19 16:01
//  * @author:yangfengming
//  */
// function uploadFiles(v) {
//     var fd = new FormData();
//     fd.append('files', v.files[0]);  //files为页面选取的文件
//     // var loading = this.$loading({
//     //     lock: true,
//     //     text: '语音合成中...',
//     //     spinner: 'el-icon-loading'
//     // });
//     $.ajax({
//         url: globalVariable.uploadFileAsyncAddress,
//         type:'post',
//         data: fd,
//         dataType: 'json',
//         contentType: false,
//         processData:false,
//         success: function (res) {
//             console.log(res);
//             console.log(res.err);
//             if(res.err==0){
//                 //res.err为0为操作成功，否则请求失败，res.errMsg为错误信息
//                 guid = res.data;
//                 // loading.close();
//                 startUploadInteval=self.setInterval("startUpload()",2000);
//             }
//             else {
//                 alert("提交失敗:"+res.errMsg);
//             }
//         },
//         error: function (data) {
//             console.log(data)
//         }
//     })
// }
// /**
//  * @description 转写之后操作
//  * @method
//  * @param  * @param null
//  * @return
//  * @date: 2019/4/19 16:02
//  * @author:yangfengming
//  */
// function startUpload(){
//     $.ajax({
//         url: globalVariable.getChangeResultAddress,
//         type:'post',
//         data: { Guid:guid }, //res.data为返回的guid，用guid获取转写进度
//         dataType: 'json',
//         success: function (res) {
//             if(res.err==0){
//                 //获取到转写进度和内容绑定到页面
//                 //res.data.rare表示转写进度
//                 //res.data.isFinish表示转写状态，0为正在转写，1为已完成
//                 //res.data.transcript表示转文本结果
//                 if(res.data.isFinish == 1){
//                     console.log(res.data.transcript);
//                     $("#mainArea").val(res.data.transcript);
//                     clearInterval(startUploadInteval);
//                 }else{
//                     console.log("转写进度:"+res.data.rare);
//                 }
//             }else{}
//         },
//         error: function (data, res) {
//         }
//     })
// }
//
// /**
//  * @description 点击图片触发file提交
//  * @method
//  * @param  * @param null
//  * @return
//  * @date: 2019/4/19 16:01
//  * @author:yangfengming
//  */
// function clickUpload(){
//     $("#headImg").click();
// }
var guid;
var startUploadInteval;
var Main = {
}
var Ctor = Vue.extend(Main)

/**
 * @description 真正提交文件方法
 * @method
 * @param  * @param null
 * @return
 * @date: 2019/4/19 16:01
 * @author:yangfengming
 */
new Ctor({
    methods:{
        uploadFiles(v) {
            var fd = new FormData();
            fd.append('files', v.path[0].files[0]);  //files为页面选取的文件
            var loading = this.$loading({
                lock: true,
                text: '语音合成中...',
                spinner: 'el-icon-loading'
            });
            $.ajax({
                url: globalVariable.uploadFileAsyncAddress,
                type:'post',
                data: fd,
                contentType: false,
                processData:false,
                success: function (res) {
                    if(res.err==0){ //res.err为0为操作成功，否则请求失败，res.errMsg为错误信息
                        guid = res.data;
                        loading.close();
                        startUploadInteval=self.setInterval("startUpload()",2000)
                    }
                },
                error: function (data) {
                }
            })
        }
    }
}).$mount('#headImg')

/**
 * @description 转写之后操作
 * @method
 * @param  * @param null
 * @return
 * @date: 2019/4/19 16:02
 * @author:yangfengming
 */
function startUpload(){
    $.ajax({
        url: globalVariable.getChangeResultAddress,
        type:'post',
        data: { Guid:guid }, //res.data为返回的guid，用guid获取转写进度
        success: function (res) {
            if(res.err==0){
                //获取到转写进度和内容绑定到页面
                //res.data.rare表示转写进度
                //res.data.isFinish表示转写状态，0为正在转写，1为已完成
                //res.data.transcript表示转文本结果
                if(res.data.isFinish == 1){
                    console.log(res.data.transcript);
                    $("#mainArea").val(res.data.transcript);
                    clearInterval(startUploadInteval);
                }else{
                    console.log("转写进度:"+res.data.rare);
                }
            }else{}
        },
        error: function (data, res) {
        }
    })
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