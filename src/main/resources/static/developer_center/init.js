window.onload = function (ev) {
    $(".header").load("header.html",function () {
        hideLogin();
});
}

function hideLogin() {
    if (sessionStorage.getItem("flag")==1) {
        $("#login").hide();
        $("#regist").hide();
    }
    else {
        $("#logout").hide();
        $("#user-center").hide();
    }

    $("#company_serial_number").text(sessionStorage.getItem("company_serial_number"));

}


