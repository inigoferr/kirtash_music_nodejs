window.onload = function(){

    $.ajax({
        type: "post",
        url: "/checkregistration",
        success: function (response) {
            if (response["result"] == 1){
                
                $.ajax({
                    type: "post",
                    url: "/v_showusername",
                    success: function (response) {
                        icon = "<i class='tim-icons icon-single-02'></i>";
                        result = icon.concat(response);

                        $('#button_username').html(result);
                    }
                });
            } else {
                window.location = "/";
            }
        }
    });
}