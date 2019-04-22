var Main = {
}
var Ctor = Vue.extend(Main)
new Ctor({
    methods:{
        fuse() {
            var words = $("#mainAear").val();
            var loading = this.$loading({
                lock: true,
                text: '语音合成中...',
                spinner: 'el-icon-loading'
            });
            $.ajax({
                url: 'https://39.108.125.225:8010/api/tts/convert',
                type: 'post',
                data: {
                    word: words,
                    language: 1
                },
                success: function (res) {
                    if(res.err==0){
                        //res.data为合成的语音文件路径
                        loading.close();
                        document.getElementById("audioPlay").src = res.data;
                    }else{
                    }
                },
                error: function (err) {
                },
            });
        }
    }
}).$mount('#fus')