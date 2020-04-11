window.onload = function () {

    //$view->v_showUsername();
    $.ajax({
        type: "post",
        url: "/v_showusername",
        success: function (response) {
            $('#box_username').html(response);
            $('#username_edit_modal_input').val(response);
        }
    });

    //$view->v_showDescriptionUser();
    $.ajax({
        type: "post",
        url: "/v_showDescriptionUser",
        success: function (response) {
            $('#description-user').html(response);
            $('#description_edit_modal').val(response);
        }
    });

    //$view->v_showInfoSessionsUser();
    $.ajax({
        type: "post",
        url: "/v_showInfoSessionsUser",
        success: function (response) {
            $('#info_sessions_user').html(response);
        }
    });

    //$view->v_showActiveSessions();
    $.ajax({
        type: "post",
        url: "/v_showActiveSessions",
        success: function (response) {
            $('#show_active_sessions').html(response);
        }
    });


}
