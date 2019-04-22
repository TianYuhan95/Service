var firSelect = "";
var useCtpn = false;
var Main = {
    data() {
        return {
            options: [{
                value: '中文',
                label: '中文'
            }, {
                value: '英语',
                label: '英语'
            }, {
                value: '维语',
                label: '维语'
            }],
            value: ''
        }
    }
}
var Ctor = Vue.extend(Main)
new Ctor({
    methods:{
        changeValueFir(value) {
            if(value == "中文"){
                firSelect = "zh";
            }else if(value == "英语"){
                firSelect = "en";
            }else if(value == "维语"){
                firSelect = "ug";
            }
        }
    }
}).$mount('#app')

var Scene = {
    data () {
        return{
            value1: '1'
        }
    }
}
var Ctor2 = Vue.extend(Scene)
new Ctor2({
    methods:{
        isSence (val) {
            useCtpn = val;
        }
    }
}).$mount('#app2');

//点击图片触发file提交
function clickUpload(){
    $("#importPic").click();
}

//file提交方法
function uploadFiles(v) {
    var fd = new FormData();
    fd.append('files', v.files[0]);  //files为页面选取的文件
    fd.append('useCtpn', useCtpn); //是否为复杂场景
    fd.append('languages', '["'+firSelect+'"]'); //识别语言
    $.ajax({
        url: 'https://39.108.125.225:8010/api/ocr/common_ocr ',
        type:'post',
        contentType: false,
        processData:false,
        data: fd,
        success: function (res) {
            if(res.err==0){
                //res.data.output为识别结果
                console.log("res:"+res.data.output);
            }else {
            }
        },
        error: function (data) {
        }
    })
}