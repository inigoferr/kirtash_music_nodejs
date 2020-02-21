window.onload = function(){

    $.ajax({
        type: "post",
        url: "/checkregistration",
        success: function (response) {
            if (response["result"] == 1){
                //$view->v_showUsername();
                $.ajax({
                    type: "post",
                    url: "/v_showusername",
                    success: function (response) {
                        icon = "<i class='tim-icons icon-single-02'></i>";
                        result = icon.concat(response);

                        $('#button_username').html(result);
                    }
                });

                //$view->v_showListSessions(0); 
                $.ajax({
                    type: "post",
                    url: "/v_showlistsessions",
                    data: {"number":0},
                    success: function (response) {
                        $('#session_list').html(response);
                    }
                });

                //$view->v_showFollowedSessions(0);
                $.ajax({
                    type: "post",
                    url: "/v_showfollowedsessions",
                    data: {"number":0},
                    success: function (response) {
                        $('#follow_list').html(response);
                    }
                });
            } else {
                window.location = "/index.html";
            }
        }
    });

}