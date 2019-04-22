var firSelect = "";
var secSelect = "";
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
//两个下拉框的change事件
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
new Ctor({
    methods:{
        changeValueSec(value) {
            if(value == "中文"){
                secSelect = "zh";
            }else if(value == "英语"){
                secSelect = "en";
            }else if(value == "维语"){
                secSelect = "ug";
            }
        }
    }
}).$mount('#app2')

//翻译方法
new Ctor({
    methods:{
        trans() {
            if(secSelect != "" && firSelect != ""){
                var loading = this.$loading({
                    lock: true,
                    text: '结果翻译中...',
                    spinner: 'el-icon-loading'
                });
                var word = $("#translateVal").val();
                $.ajax({
                    url: 'https://39.108.125.225:8010/api/translate/translate_by_language',
                    type: 'post',
                    data: {
                        oriText: word, //需要翻译的文本内容
                        oriLanguageId: firSelect, //翻译前的语种
                        destLanguageId: secSelect //翻译后的语种
                    },
                    success: function (res) {
                        if(res.err==0){
                            //res.data返回翻译生成的译文
                            loading.close();
                            document.getElementById("elRow").style.display = "block";
                            $("#translateResult").text(res.data);
                        }else{
                        }
                    },
                    error: function (res) {
                    },
                });
            }
        }
    }
}).$mount('#translate')

//修改输入文字后翻译按钮的样式
function onTranslate(v){
    if(v.value.length != 0){
        document.getElementById("translate").className = "el-button el-button--primary";
        document.getElementById("translate").disabled = "";
    }else{
        document.getElementById("translate").className = "el-button el-button--primary is-disabled";
        document.getElementById("translate").disabled = "disabled";
    }
}