//提交文本
function upWords(){
    var words = $("#toDealWithWords").val();
    //分词与词性标注
    $.ajax({
        url: 'https://39.108.125.225:8010/api/nlp_analysis/tag',
        type:'post',
        data: {
            doc: words //待处理文本内容
        },
        success: function (res) {
            if(res.err==0){
                //res.data返回分析结果列表
                var result = "";
                var type = "";
                var typeString = "";
                $.each(res.data,function (i,v) {
                    //v.strWord为分词内容
                    //v.strTaggerType为词性类别
                    result += "<span class=\"el-tag\" title=\""+getWordType(v.strTaggerType).name+"\" style=\"background-color: "+getWordType(v.strTaggerType).rgb+"; margin: 3px; color: rgb(0, 0, 0);\">"+v.strWord+"</span>";
                    if(typeString.indexOf(getWordType(v.strTaggerType).name) == -1){
                        if(i != res.data.length - 1){
                            typeString += getWordType(v.strTaggerType).name+",";
                            type += "<span class=\"el-tag\" title=\""+getWordType(v.strTaggerType).name+"\" style=\"background-color: "+getWordType(v.strTaggerType).rgb+"; margin: 3px; color: rgb(0, 0, 0);\">"+getWordType(v.strTaggerType).name+"</span>";
                        }else{
                            typeString += getWordType(v.strTaggerType).name;
                            type += "<span class=\"el-tag\" title=\""+getWordType(v.strTaggerType).name+"\" style=\"background-color: "+getWordType(v.strTaggerType).rgb+"; margin: 3px; color: rgb(0, 0, 0);\">"+getWordType(v.strTaggerType).name+"</span>";
                        }
                    }
                })
                $("#resultWords").empty();
                $("#resultWords").html(result);
                $("#wordType").empty();
                $("#wordType").html(type);
            }else {
            }
        },
        error: function (data) {
        }
    });

    //实体识别
    $.ajax({
        url: 'https://39.108.125.225:8010/api/nlp_analysis/ner',
        type:'post',
        data: {
        doc: words //待处理文本内容
    },
    success: function (res) {
        if(res.err==0){
            //res.data返回分析结果列表
            var result = "";
            var type = "";
            var typeString = "";
            $.each(res.data,function (i,v) {
                //v.nerSet为实体名称列表
                //v.strNerType为实体标签
                result += "<span class=\"el-tag\" title=\""+getWordType(v.strNerType).name+"\" style=\"background-color: "+getWordType(v.strNerType).rgb+"; margin: 3px; color: rgb(0, 0, 0);\">"+v.nerSet+"</span>";
                if(typeString.indexOf(getWordType(v.strNerType).name) == -1){
                    if(i != res.data.length - 1){
                        typeString += getWordType(v.strNerType).name+",";
                        type += "<span class=\"el-tag\" title=\""+getWordType(v.strNerType).name+"\" style=\"background-color: "+getWordType(v.strNerType).rgb+"; margin: 3px; color: rgb(0, 0, 0);\">"+getWordType(v.strNerType).name+"</span>";
                    }else{
                        typeString += getWordType(v.strNerType).name;
                        type += "<span class=\"el-tag\" title=\""+getWordType(v.strNerType).name+"\" style=\"background-color: "+getWordType(v.strNerType).rgb+"; margin: 3px; color: rgb(0, 0, 0);\">"+getWordType(v.strNerType).name+"</span>";
                    }
                }
            })
            $("#entity").empty();
            $("#entity").html(result);
            $("#entityIcon").empty();
            $("#entityIcon").html(type);
        }else {
        }
    },
    error: function (data) {
    }
});
    var keywordMap= "[";
    //关键词提取
    $.ajax({ //top_k为提取关键词个数
        url: 'https://39.108.125.225:8010/api/nlp_analysis/keywords?top_k=10',
        type:'post',
        data: {
        doc: words //待处理文本内容
    },
    success: function (res) {
        if(res.err==0){
            //res.data返回分析结果列表
            var result = "";
            $.each(res.data,function (i,v) {
                //v.strKeyWordText为关键词
                //v.fWeight为关键词相应的权重
                result += "<tr data-v-3fdafd60=\"\"><td data-v-3fdafd60=\"\">"+v.strKeyWordText+"</td><td data-v-3fdafd60=\"\">"+v.fWeight.toFixed(4)+"</td></tr>";
                if(i == res.data.length -1){
                    keywordMap += '"'+v.strKeyWordText+'"'
                    keywordMap += "]"
                    //语义联想
                    $.ajax({ //top_k为提取关键词个数
                        url: 'https://39.108.125.225:8010/api/nlp_analysis/relation?top_k=10',
                        type:'post',
                        data: {
                            keywords: keywordMap //待处理文本内容
                        },
                        success: function (res) {
                            if(res.err==0){
                                //res.data返回分析结果列表
                                var wordConnectResult = "";
                                $.each(res.data,function (i,v) {
                                    //v.strKeyWordText为联想的分词
                                    //v.fWeight为联想的分词相应的权重
                                    wordConnectResult += "<div data-v-14423d28=\"\" class=\"el-col el-col-12\" style=\"padding: 0px 30px 30px 0px;\"><h5 data-v-14423d28=\"\" style=\"margin-bottom: 5px;\">关键词："+i+"</h5>";
                                    wordConnectResult += "<table data-v-14423d28=\"\">"
                                    wordConnectResult += "<thead data-v-14423d28=\"\">"
                                    wordConnectResult += "<tr data-v-14423d28=\"\">"
                                    wordConnectResult += "<td data-v-14423d28=\"\">名称</td>"
                                    wordConnectResult += "<td data-v-14423d28=\"\">相关性</td>"
                                    wordConnectResult += "</tr>"
                                    wordConnectResult += "</thead>"
                                    wordConnectResult += "<tbody data-v-14423d28=\"\">"
                                    $.each(v,function (i,v) {
                                        wordConnectResult += "<tr data-v-14423d28=\"\">";
                                        wordConnectResult += "<td data-v-14423d28=\"\">"+v.strKeyWordText+"</td>";
                                        wordConnectResult += "<td data-v-14423d28=\"\">"+v.fWeight.toFixed(4)+"</td>";
                                        wordConnectResult += "</tr>";
                                    });
                                    wordConnectResult += "</tbody>";
                                    wordConnectResult += "</table>";
                                    wordConnectResult += "</div>";
                                })
                                $("#wordConnect").empty();
                                $("#wordConnect").html(wordConnectResult);
                            }else {
                            }
                        },
                        error: function (data) {
                        }
                    });
                }else{
                    keywordMap += '"'+v.strKeyWordText+'",'
                }
            })
            $("#keyword").empty();
            $("#keyword").html(result);
        }else {
        }
    },
    error: function (data) {
    }
});
    //文本摘要
    $.ajax({
        url: 'https://39.108.125.225:8010/api/nlp_analysis/abstract',
        type:'post',
        data: {
        doc: words //待处理文本内容
    },
    success: function (res) {
        if(res.err==0){
            //res.data返回JSON格式的摘要结果文本
            $("#wordsImport").html(res.data);
        }else {
        }
    },
    error: function (data) {
    }
});
    //文本分类
    $.ajax({
        url: 'https://39.108.125.225:8010/api/nlp_analysis/classify',
        type:'post',
        data: {
        doc: words //待处理文本内容
    },
    success: function (res) {
        if(res.err==0){
            //res.data返回分类编号（ 0 到 13 之间的数字）
        }else {
        }
    },
    error: function (data) {
    }
});
}

//修改图标样式
function getWordType(type){
    var word = {name:"",rgb:""};
    if(type == "VA"){
        word.name = "形容词";
        word.rgb = "rgb(131,145,165)";
    }else if(type == "VC"){
        word.name = "动词";
        word.rgb = "rgb(228,232,241)";
    }else if(type == "VE"){
        word.name = "动词";
        word.rgb = "rgb(228,232,241)";
    }else if(type == "VV"){
        word.name = "动词";
        word.rgb = "rgb(228,232,241)";
    }else if(type == "NR"){
        word.name = "名词";
        word.rgb = "rgb(32,160,255)";
    }else if(type == "NN"){
        word.name = "名词";
        word.rgb = "rgb(32,160,255)";
    }else if(type == "NNS"){
        word.name = "名词";
        word.rgb = "rgb(32,160,255)";
    }else if(type == "NNP"){
        word.name = "名词";
        word.rgb = "rgb(32,160,255)";
    }else if(type == "NNPS"){
        word.name = "名词";
        word.rgb = "rgb(32,160,255)";
    }else if(type == "NT"){
        word.name = "时间";
        word.rgb = "rgb(19,206,102)";
    }else if(type == "NC"){
        word.name = "方位词";
        word.rgb = "rgb(247,186,42)";
    }else if(type == "PN"){
        word.name = "代词";
        word.rgb = "rgb(255,73,73)";
    }else if(type == "DT"){
        word.name = "限定词";
        word.rgb = "#ff9899";
    }else if(type == "CD"){
        word.name = "基数词";
        word.rgb = "#986699";
    }else if(type == "OD"){
        word.name = "序列词";
        word.rgb = "#99cc67";
    }else if(type == "M"){
        word.name = "度量词";
        word.rgb = "#4dd9e6";
    }else if(type == "AD"){
        word.name = "副词";
        word.rgb = "#f48363";
    }else if(type == "P"){
        word.name = "介词";
        word.rgb = "#9acccd";
    }else if(type == "CC"){
        word.name = "连词";
        word.rgb = "#cac993";
    }else if(type == "CS"){
        word.name = "连词";
        word.rgb = "#cac993";
    }else if(type == "DEC"){
        word.name = "助词";
        word.rgb = "#8ea4de";
    }else if(type == "DEG"){
        word.name = "助词";
        word.rgb = "#8ea4de";
    }else if(type == "DEER"){
        word.name = "助词";
        word.rgb = "#8ea4de";
    }else if(type == "DEV"){
        word.name = "助词";
        word.rgb = "#8ea4de";
    }else if(type == "SP"){
        word.name = "助词";
        word.rgb = "#8ea4de";
    }else if(type == "AS"){
        word.name = "助词";
        word.rgb = "#8ea4de";
    }else if(type == "ETC"){
        word.name = "助词";
        word.rgb = "#8ea4de";
    }else if(type == "MSP"){
        word.name = "助词";
        word.rgb = "#8ea4de";
    }else if(type == "IJ"){
        word.name = "其他";
        word.rgb = "#d0f7fe";
    }else if(type == "ON"){
        word.name = "其他";
        word.rgb = "#d0f7fe";
    }else if(type == "PU"){
        word.name = "其他";
        word.rgb = "#d0f7fe";
    }else if(type == "JJ"){
        word.name = "其他";
        word.rgb = "#d0f7fe";
    }else if(type == "FW"){
        word.name = "其他";
        word.rgb = "#d0f7fe";
    }else if(type == "LB"){
        word.name = "其他";
        word.rgb = "#d0f7fe";
    }else if(type == "SB"){
        word.name = "其他";
        word.rgb = "#d0f7fe";
    }else if(type == "BA"){
        word.name = "其他";
        word.rgb = "#d0f7fe";
    }else if(type == "MISC"){
        word.name = "时间";
        word.rgb = "#ff9899";
    }else if(type == "PERSON"){
        word.name = "人名";
        word.rgb = "#986699";
    }else if(type == "LOCATION"){
        word.name = "地名";
        word.rgb = "#99cc67";
    }else if(type == "FACILITY"){
        word.name = "机构";
        word.rgb = "#4dd9e6";
    }else if(type == "ORGANIZATION"){
        word.name = "机构";
        word.rgb = "#4dd9e6";
    }else if(type == "GPE"){
        word.name = "省份";
        word.rgb = "#9acccd";
    }else if(type == "DEMONYM"){
        word.name = "语种";
        word.rgb = "#f48363";
    }else if(type == "EMAIL"){
        word.name = "邮箱";
        word.rgb = "#cac993";
    }else if(type == "IDENTITYCODE"){
        word.name = "身份证";
        word.rgb = "#8ea4de";
    }else if(type == "CARCODE"){
        word.name = "车牌号";
        word.rgb = "#d0f7fe";
    }
    return word;
}

/**
 * @description 修改左侧导航栏的选中样式，代码解析到此并不完善，目前根据大致距离判断可修改样式，is-active是关键
 * @method
 * @param  * @param null
 * @return
 * @date: 2019/4/19 15:56
 * @author:yangfengming
 */
$(window).scroll(function(){
    var topNum = $(document).scrollTop();
    if(topNum < 100){
        document.getElementById("first").className = "el-menu-item is-active";
        document.getElementById("second").className = "el-menu-item";
        document.getElementById("third").className = "el-menu-item";
        document.getElementById("forth").className = "el-menu-item";
        document.getElementById("fifth").className = "el-menu-item";
        document.getElementById("sixth").className = "el-menu-item";
    }else if(topNum >= 100 && topNum < 300){
        document.getElementById("first").className = "el-menu-item";
        document.getElementById("second").className = "el-menu-item is-active";
        document.getElementById("third").className = "el-menu-item";
        document.getElementById("forth").className = "el-menu-item";
        document.getElementById("fifth").className = "el-menu-item";
        document.getElementById("sixth").className = "el-menu-item";
    }else if(topNum >= 300 && topNum < 400){
        document.getElementById("first").className = "el-menu-item";
        document.getElementById("second").className = "el-menu-item";
        document.getElementById("third").className = "el-menu-item is-active";
        document.getElementById("forth").className = "el-menu-item";
        document.getElementById("fifth").className = "el-menu-item";
        document.getElementById("sixth").className = "el-menu-item";
    }else if(topNum >= 400 && topNum < 600){
        document.getElementById("first").className = "el-menu-item";
        document.getElementById("second").className = "el-menu-item";
        document.getElementById("third").className = "el-menu-item";
        document.getElementById("forth").className = "el-menu-item is-active";
        document.getElementById("fifth").className = "el-menu-item";
        document.getElementById("sixth").className = "el-menu-item";
    }else if(topNum >= 600 && topNum < 800){
        document.getElementById("first").className = "el-menu-item";
        document.getElementById("second").className = "el-menu-item";
        document.getElementById("third").className = "el-menu-item";
        document.getElementById("forth").className = "el-menu-item";
        document.getElementById("fifth").className = "el-menu-item is-active";
        document.getElementById("sixth").className = "el-menu-item";
    }else if(topNum >= 800){
        document.getElementById("first").className = "el-menu-item";
        document.getElementById("second").className = "el-menu-item";
        document.getElementById("third").className = "el-menu-item";
        document.getElementById("forth").className = "el-menu-item";
        document.getElementById("fifth").className = "el-menu-item";
        document.getElementById("sixth").className = "el-menu-item is-active";
    }
});