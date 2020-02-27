function checkSignUp() {
    var username = $('#username_signup').val();
    var pass_user = $('#pass_user_signup').val();
    var pass_user2 = $('#pass_user_signup2').val()
    var email = $('#email_user').val();
    /*
    * Perform some validation here.
    */
    $.ajax({
        url: '/checksignup',
        data: { username: username, pass_user: pass_user, pass_user2: pass_user2, email: email },
        type: "post",
        success: function (result) {
            result = result["result"];
            var alert = "<div class='alert alert-warning alert-with-icon'>" +
                "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                "<i class='tim-icons icon-simple-remove'></i>" +
                "</button>" +
                "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                "<span>" +
                "<b> Warning! - </b>##MSG##</span>" +
                "</div>";
            if (result == -1) {
                $('#result').html(alert.replace("##MSG##", "An error has ocurred, please try later"));
            } else if (result == -2) {
                $('#result').html(alert.replace("##MSG##", "Choose another username"));
            } else if (result == -3) {
                $('#result').html(alert.replace("##MSG##", "The passwords must be equal"));
            } else if (result == -4) {
                $('#result').html(alert.replace("##MSG##", "Fill all the boxes"));
            } else if (result == -5) {
                $('#result').html(alert.replace("##MSG##", "The password must have at least 5 characters without spaces"));
            } else if (result == -6) {
                $('#result').html(alert.replace("##MSG##", "The username must have at least 5 characters, without spaces"));
            } else if (result == -7) {
                $('#result').html(alert.replace("##MSG##", "This e-mail is already used"));
            } else if (result == -8) {
                $('#result').html(alert.replace("##MSG##", "You have to write an e-mail"));
            } else if (result == 1) {
                let params = new URLSearchParams(location.search);
                if (params.get('id_session') != null) {
                    window.location = "/public/session.html?id_session=" + params.get('id_session');
                    //$.get("/session",{id_session: params.get('id_session')});
                } else {
                    //window.location = "/menu.html";
                    $.ajax({
                        type: "get",
                        url: "/menu",
                        success: function (response) {
                            console.log(response);
                        }
                    });
                }
            }
        }
    });
}

function checkSignIn() {
    console.log($('#username_signin').val());
    $.ajax({
        url: '/checksignin',
        data: { username: $('#username_signin').val(), pass_user: $('#pass_user_signin').val() },
        type: "post",
        success: function (result) {
            result = result["result"];
            if (result == -1) {

                var alert = "<div class='alert alert-warning alert-with-icon'>" +
                    "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                    "<i class='tim-icons icon-simple-remove'></i>" +
                    "</button>" +
                    "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                    "<span>" +
                    "<b> Warning! - </b>##MSG##</span>" +
                    "</div>";
                $('#result2').html(alert.replace("##MSG##", "Username or password are not correct"));
            } else if (result == 1) {
                let params = new URLSearchParams(location.search);
                if (params.get('id_session') != null) {
                    window.location = "/session.html?id_session=" + params.get('id_session');
                    //$.get("/session",{id_session: params.get('id_session')});
                } else {
                    //window.location = "/menu.html";
                    //$.get('/menu');
                    window.location = "/menu.html";
                }
            }
        },
        error: function (result) {
            console.log(result);
        }
    });
}

function openSession(id_session) {
    window.location = "/session.html?id_session=" + id_session;
}

function createSessionMenu() {
    window.location = "/create_session.html";
}

function createSession() {
    selected = $('input[name=inlineRadioOptions]:checked', '#type_session').val();
    $.ajax({
        url: "/create_session",
        data: {
            name_session: $('#name_session').val(), pass_session: $('#pass_session').val(), pass_session2: $('#pass_session2').val(),
            description: $('#description_session').val(), type_session: selected,
            min_votes: $('#min_votes').val(), min_users: $('#min_users').val()
        },
        type: "post",
        success: function (result) { //We received the information from the server
            result = result["result"];
            if (result == -1) {
                $('#result').html("The name of the session is empty");
            } else if (result == -2) {
                $('#result').html("The password must be of minimum 5 characters (without spaces)");
            } else if (result == -3) {
                $('#result').html("The passwords must be equal");
            } else if (result == -4) {
                $('#result').html("Try again, something went wrong");
            } else if (result == -5) {
                $('#result').html("Minimum Votes must be less or equal to Minimum Users");
            } else if (result == 1) {
                //location.href = "menu.php";
                window.location = "/menu.html";
            } else {
                $('#result').html("Try again, something went wrong");
            }
        }
    });
}

function closeSession() {
    $.ajax({
        url: "/close_session",
        type: "post",
        success: function (result) { //We received the information from the server
            if (result["result"] == 1) {
                window.location = "/index.html";
            }
        }
    });
}

function toRegister() {
    let params = new URLSearchParams(location.search);
    window.location = "/index.html?id_session=" + params.get('id_session');
}

function onKeyUpSignUp() {
    var keycode = event.keyCode;
    if (keycode == '13') {
        checkSignUp();
    }
}

function onKeyUpSignIn() {
    var keycode = event.keyCode;
    if (keycode == '13') {
        checkSignIn();
    }
}

function deleteSession(id_session) {
    $.ajax({
        url: "/deletesession",
        data: { id_session: id_session, accion: "deleteSession" },
        type: "post",
        success: function (result) {
            //Update the list of sessions of the user
            result = result["result"];
            if (result == 1) {
                $.ajax({
                    url: "/v_showlistsessions",
                    data: { number: 1 },
                    type: "post",
                    success: function (result) {
                        $('#session_list').html(result);
                    }
                });
            }
        }
    });
}

function cancelCreation() {
    window.location = "/menu.html";
}

function unfollowSessionFromMenu(id_session) {
    $.ajax({
        url: "/unfollowSession",
        data: { id_session: id_session },
        type: "post",
        success: function (result) {
            result = result["result"];
            if (result == 1) {
                $.ajax({
                    url: "/v_showfollowedsessions",
                    data: { number: 1 },
                    type: "post",
                    success: function (result) {
                        $('#follow_list').html(result);
                    }
                });
            }
        }
    });
}

function searchAdmins() {
    let params = new URLSearchParams(location.search);
    $.ajax({
        url: "/searchTextAdmins",
        data: { text: $('#autocomplete').val(), id_session: params.get('id_session') },
        type: "post",
        success: function (result) {
            $('#result_search_admin').html(result);
        }
    });
}

function addAdmins() {
    //We get all the usernames selected by the user
    var array = [];
    $('#checkbox input:checked').each(
        function () {
            array.push($(this).attr('name'));
        }
    );

    let params = new URLSearchParams(location.search);

    var num_admins = 0;
    var num_admins_total = array.length;

    //We make the changes in the BBDD
    array.forEach(function (elem) {
        num_admins++;
        $.ajax({
            url: "/insertNewAdmin",
            data: { admin: elem, id_session: params.get('id_session') },
            type: "post",
            success: function (result) {
                if (num_admins == num_admins_total) {
                    location.reload();
                }
            }
        });
    });
}

function deleteAdmin(username_admin) {
    let params = new URLSearchParams(location.search);

    console.log(username_admin);
    $.ajax({
        url: "/deleteAdmin",
        data: { username: username_admin, id_session: params.get('id_session') },
        type: "post",
        success: function (result) {
            location.reload();
        }
    });
}

function goToProfile() {
    window.location = "profile.html";
}

function editProfile() {
    //Obtain username
    $.ajax({
        url: "/checkUsername",
        data: { username: $('#username_edit_modal_input').val() },
        type: "post",
        success: function (result) {
            //Obtain passwords
            if (($('#pass_actual').val()).localeCompare('') != 0) {
                //Check if the password typed is the actual password of the user
                $.ajax({
                    url: "/checkActualPassword",
                    data: { pass_actual: $('#pass_actual').val() },
                    type: "post",
                    success: function (result) {
                        result = result["result"];
                        //Check if the pass entered is correct

                        if (result == 1) { //Password correct

                            pass1 = $('#new_pass_1').val();
                            pass2 = $('#new_pass_2').val();

                            length1 = $('#new_pass_1').val().replace(/\s/g, "").length;
                            length2 = $('#new_pass_2').val().replace(/\s/g, "").length;

                            if ((length1 < 5) || (length2 < 5)) {
                                //Show wrong length passwords
                                content = "<div class='alert alert-warning alert-with-icon'>" +
                                    "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                                    "<i class='tim-icons icon-simple-remove'></i>" +
                                    "</button>" +
                                    "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                                    "<span>" +
                                    "<b> Warning! - </b> New password: Min. 5 characters  and without spaces</span>" +
                                    "</div>";
                                $('#alert_modal').html(content);
                            } else {
                                if ((pass1.localeCompare(pass2) == 0) && (length1 == length2)) {
                                    //Modify password of the user
                                    $.ajax({
                                        url: "/modifyPassword",
                                        data: { new_pass: pass1 },
                                        type: "post",
                                        success: function (result) {
                                            result = result["result"];
                                            if (result == 1) {
                                                //Password correctly modified, now...
                                                //Update description if necessary
                                                description = $('#description_edit_modal').val();
                                                $.ajax({
                                                    url: "/modifyDescription",
                                                    data: { description: description },
                                                    type: "post",
                                                    success: function (result) {
                                                        result = result["result"];
                                                        if (result == -1) {
                                                            //Something went wrong
                                                            content = "<div class='alert alert-warning alert-with-icon'>" +
                                                                "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                                                                "<i class='tim-icons icon-simple-remove'></i>" +
                                                                "</button>" +
                                                                "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                                                                "<span>" +
                                                                "<b> Warning! - </b> Something went wrong... Try again</span>" +
                                                                "</div>";
                                                            $('#alert_modal').html(content);
                                                        } else {
                                                            location.reload();
                                                        }
                                                    }
                                                });
                                            } else {
                                                //Something went wrong
                                                content = "<div class='alert alert-warning alert-with-icon'>" +
                                                    "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                                                    "<i class='tim-icons icon-simple-remove'></i>" +
                                                    "</button>" +
                                                    "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                                                    "<span>" +
                                                    "<b> Warning! - </b> Something went wrong... Try again</span>" +
                                                    "</div>";
                                                $('#alert_modal').html(content);
                                            }
                                        }
                                    });
                                } else {
                                    //Show alert that passwords are not equal
                                    content = "<div class='alert alert-warning alert-with-icon'>" +
                                        "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                                        "<i class='tim-icons icon-simple-remove'></i>" +
                                        "</button>" +
                                        "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                                        "<span>" +
                                        "<b> Warning! - </b> New password not equal in both inputs </span>" +
                                        "</div>";
                                    $('#alert_modal').html(content);
                                }
                            }
                        } else {
                            //Actual password incorrect
                            content = "<div class='alert alert-warning alert-with-icon'>" +
                                "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                                "<i class='tim-icons icon-simple-remove'></i>" +
                                "</button>" +
                                "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                                "<span>" +
                                "<b> Warning! - </b> Actual password incorrect </span>" +
                                "</div>";
                            $('#alert_modal').html(content);
                        }
                    }
                });
            } else {
                //Obtain description and update
                //Update description if necessary
                description = $('#description_edit_modal').val();
                $.ajax({
                    url: "/modifyDescription",
                    data: { description: description },
                    type: "post",
                    success: function (result) {
                        result = result["result"];
                        if (result == -1) {
                            //Something went wrong
                            content = "<div class='alert alert-warning alert-with-icon'>" +
                                "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                                "<i class='tim-icons icon-simple-remove'></i>" +
                                "</button>" +
                                "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                                "<span>" +
                                "<b> Warning! - </b> Something went wrong... Try again</span>" +
                                "</div>";
                            $('#alert_modal').html(content);
                        } else {
                            location.reload();
                        }
                    }
                });
            }
        }
    });
}

function editSessionSettings() {
    let params = new URLSearchParams(location.search);

    //Initial condition
    var min_votes = new Number($('#min_votes').val());
    var min_users = new Number($('#min_users').val());

    if (min_votes > min_users) {
        //Bad proportion -> Show Alert
        content = "<div class='alert alert-warning alert-with-icon'>" +
            "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
            "<i class='tim-icons icon-simple-remove'></i>" +
            "</button>" +
            "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
            "<span>" +
            "<b> Warning! - </b> Minimum Votes must be less or equal to Minimum Users</span>" +
            "</div>";
        $('#alert_modal_sessionsettings').html(content);
    } else {
        //1º: We check if we need to change the name of the session, if so we change it
        $.ajax({
            url: "/checkNameSession",
            data: { name_session: $('#namesession_edit_modal').val(), id_session: params.get('id_session') },
            type: "post",
            success: function (result) {
                result = result["result"];
                if (result == -1) {
                    //Something went wrong -> Show Alert
                    content = "<div class='alert alert-warning alert-with-icon'>" +
                        "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                        "<i class='tim-icons icon-simple-remove'></i>" +
                        "</button>" +
                        "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                        "<span>" +
                        "<b> Warning! - </b> Something went wrong... Try again</span>" +
                        "</div>";
                    $('#alert_modal_sessionsettings').html(content);
                } else {
                    //1.5º: We check if we have to change the password of the session
                    //Obtain passwords
                    if ($('#pass_actual').val().localeCompare('') != 0) {
                        //Check if the password typed is the actual password of the session
                        $.ajax({
                            url: "/enterPasswordSession",
                            data: { pass: $('#pass_actual').val(), id_session: params.get('id_session') },
                            type: "post",
                            success: function (result) {
                                result = result["result"];
                                //Check if the pass entered is correct
                                if (result == 1) { //Password correct

                                    pass1 = $('#new_pass_1').val();
                                    pass2 = $('#new_pass_2').val();

                                    length1 = $('#new_pass_1').val().replace(/\s/g, "").length;
                                    length2 = $('#new_pass_2').val().replace(/\s/g, "").length;

                                    if ((length1 < 5) || (length2 < 5)) {
                                        //Show wrong length passwords
                                        content = "<div class='alert alert-warning alert-with-icon'>" +
                                            "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                                            "<i class='tim-icons icon-simple-remove'></i>" +
                                            "</button>" +
                                            "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                                            "<span>" +
                                            "<b> Warning! - </b> New password: Min. 5 characters  and without spaces</span>" +
                                            "</div>";
                                        $('#alert_modal_sessionsettings').html(content);
                                    } else {
                                        if ((pass1.localeCompare(pass2) == 0) && (length1 == length2)) {
                                            //Modify password of the user
                                            $.ajax({
                                                url: "/modifyPasswordSession",
                                                data: { new_pass: pass1, id_session: params.get('id_session') },
                                                type: "post",
                                                success: function (result) {
                                                    result = result["result"];
                                                    if (result == 1) {
                                                        //Password correctly modified, now...
                                                        //Update description if necessary
                                                        description = $('#description_edit_modal').val();
                                                        $.ajax({
                                                            url: "/modifyDescriptionSession",
                                                            data: { description: description, id_session: params.get('id_session') },
                                                            type: "post",
                                                            success: function (result) {
                                                                result = result["result"];
                                                                if (result == -1) {
                                                                    //Something went wrong
                                                                    content = "<div class='alert alert-warning alert-with-icon'>" +
                                                                        "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                                                                        "<i class='tim-icons icon-simple-remove'></i>" +
                                                                        "</button>" +
                                                                        "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                                                                        "<span>" +
                                                                        "<b> Warning! - </b> Something went wrong... Try again</span>" +
                                                                        "</div>";
                                                                    $('#alert_modal_sessionsettings').html(content);
                                                                } else {
                                                                    //The name was changed or not, but everything went correct
                                                                    //The password was changed or not, but everything went correct
                                                                    //2º: We check if the session needs to be changed to public or private

                                                                    //Obtain the option chosen by the user
                                                                    selected = $('input[name=inlineRadioOptions]:checked', '#type_session').val();

                                                                    $.ajax({
                                                                        url: "/modifyTypeSession",
                                                                        data: { type_session: selected, id_session: params.get('id_session') },
                                                                        type: "post",
                                                                        success: function (result) {
                                                                            result = result["result"];
                                                                            if (result == -1) {
                                                                                //Something went wrong -> Show Alert
                                                                                content = "<div class='alert alert-warning alert-with-icon'>" +
                                                                                    "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                                                                                    "<i class='tim-icons icon-simple-remove'></i>" +
                                                                                    "</button>" +
                                                                                    "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                                                                                    "<span>" +
                                                                                    "<b> Warning! - </b> Something went wrong... Try again</span>" +
                                                                                    "</div>";
                                                                                $('#alert_modal_sessionsettings').html(content);
                                                                            } else {
                                                                                //The type of the session was changed if it was necessary correctly.
                                                                                //Now, we change the proportion
                                                                                min_votes = $('#min_votes').val();
                                                                                min_users = $('#min_users').val();

                                                                                $.ajax({
                                                                                    url: "/modifyProportion",
                                                                                    data: { min_votes: min_votes, min_users: min_users, id_session: params.get('id_session') },
                                                                                    type: "post",
                                                                                    success: function (result) {
                                                                                        result = result["result"];
                                                                                        if (result == 1) {
                                                                                            location.reload();
                                                                                        } else if (result == 0) {
                                                                                            //Bad proportion -> Show Alert
                                                                                            content = "<div class='alert alert-warning alert-with-icon'>" +
                                                                                                "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                                                                                                "<i class='tim-icons icon-simple-remove'></i>" +
                                                                                                "</button>" +
                                                                                                "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                                                                                                "<span>" +
                                                                                                "<b> Warning! - </b> Minimum Votes must be less or equal to Minimum Users</span>" +
                                                                                                "</div>";
                                                                                            $('#alert_modal_sessionsettings').html(content);
                                                                                        } else {
                                                                                            //Something went wrong -> Show Alert
                                                                                            content = "<div class='alert alert-warning alert-with-icon'>" +
                                                                                                "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                                                                                                "<i class='tim-icons icon-simple-remove'></i>" +
                                                                                                "</button>" +
                                                                                                "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                                                                                                "<span>" +
                                                                                                "<b> Warning! - </b> Something went wrong... Try again</span>" +
                                                                                                "</div>";
                                                                                            $('#alert_modal_sessionsettings').html(content);
                                                                                        }
                                                                                    }
                                                                                });
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        });
                                                    } else {
                                                        //Something went wrong
                                                        content = "<div class='alert alert-warning alert-with-icon'>" +
                                                            "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                                                            "<i class='tim-icons icon-simple-remove'></i>" +
                                                            "</button>" +
                                                            "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                                                            "<span>" +
                                                            "<b> Warning! - </b> Something went wrong... Try again</span>" +
                                                            "</div>";
                                                        $('#alert_modal_sessionsettings').html(content);
                                                    }
                                                }
                                            });
                                        } else {
                                            //Show alert that passwords are not equal
                                            content = "<div class='alert alert-warning alert-with-icon'>" +
                                                "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                                                "<i class='tim-icons icon-simple-remove'></i>" +
                                                "</button>" +
                                                "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                                                "<span>" +
                                                "<b> Warning! - </b> New password not equal in both inputs </span>" +
                                                "</div>";
                                            $('#alert_modal_sessionsettings').html(content);
                                        }
                                    }
                                } else {
                                    //Actual password incorrect
                                    content = "<div class='alert alert-warning alert-with-icon'>" +
                                        "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                                        "<i class='tim-icons icon-simple-remove'></i>" +
                                        "</button>" +
                                        "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                                        "<span>" +
                                        "<b> Warning! - </b> Actual password incorrect </span>" +
                                        "</div>";
                                    $('#alert_modal_sessionsettings').html(content);
                                }
                            }
                        });
                    } else {
                        //Update description if necessary
                        description = $('#description_edit_modal').val();
                        $.ajax({
                            url: "/modifyDescriptionSession",
                            data: { description: description, id_session: params.get('id_session') },
                            type: "post",
                            success: function (result) {
                                result = result["result"];
                                if (result == -1) {
                                    //Something went wrong
                                    content = "<div class='alert alert-warning alert-with-icon'>" +
                                        "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                                        "<i class='tim-icons icon-simple-remove'></i>" +
                                        "</button>" +
                                        "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                                        "<span>" +
                                        "<b> Warning! - </b> Something went wrong... Try again</span>" +
                                        "</div>";
                                    $('#alert_modal_sessionsettings').html(content);
                                } else {
                                    //The name was changed or not, but everything went correct
                                    //The password was changed or not, but everything went correct
                                    //2º: We check if the session needs to be changed to public or private

                                    //Obtain the option chosen by the user
                                    selected = $('input[name=inlineRadioOptions]:checked', '#type_session').val();

                                    $.ajax({
                                        url: "/modifyTypeSession",
                                        data: { type_session: selected, id_session: params.get('id_session') },
                                        type: "post",
                                        success: function (result) {
                                            result = result["result"];
                                            if (result == -1) {
                                                //Something went wrong -> Show Alert
                                                content = "<div class='alert alert-warning alert-with-icon'>" +
                                                    "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                                                    "<i class='tim-icons icon-simple-remove'></i>" +
                                                    "</button>" +
                                                    "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                                                    "<span>" +
                                                    "<b> Warning! - </b> Something went wrong... Try again</span>" +
                                                    "</div>";
                                                $('#alert_modal_sessionsettings').html(content);
                                            } else {
                                                //The type of the session was changed if it was necessary correctly.
                                                //Now, we change the proportion
                                                min_votes = $('#min_votes').val();
                                                min_users = $('#min_users').val();

                                                $.ajax({
                                                    url: "/modifyProportion",
                                                    data: { min_votes: min_votes, min_users: min_users, id_session: params.get('id_session') },
                                                    type: "post",
                                                    success: function (result) {
                                                        result = result["result"];
                                                        if (result == 1) {
                                                            location.reload();
                                                        } else if (result == 0) {
                                                            //Bad proportion -> Show Alert
                                                            content = "<div class='alert alert-warning alert-with-icon'>" +
                                                                "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                                                                "<i class='tim-icons icon-simple-remove'></i>" +
                                                                "</button>" +
                                                                "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                                                                "<span>" +
                                                                "<b> Warning! - </b> Minimum Votes must be less or equal to Minimum Users</span>" +
                                                                "</div>";
                                                            $('#alert_modal_sessionsettings').html(content);
                                                        } else {
                                                            //Something went wrong -> Show Alert
                                                            content = "<div class='alert alert-warning alert-with-icon'>" +
                                                                "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                                                                "<i class='tim-icons icon-simple-remove'></i>" +
                                                                "</button>" +
                                                                "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                                                                "<span>" +
                                                                "<b> Warning! - </b> Something went wrong... Try again</span>" +
                                                                "</div>";
                                                            $('#alert_modal_sessionsettings').html(content);
                                                        }
                                                    }
                                                });

                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }


                }
            }
        });
    }
}

function showInfoType() {
    $('input:radio').change(
        function () {
            if ($(this).val() == "1") {
                $("#public_option").show();
                $("#private_option").hide();
            }
            else {
                $("#public_option").hide();
                $("#private_option").show();
            }
        });
}

function onKeyUpEnterPasswordSession() {
    var keycode = event.keyCode;
    if (keycode == '13') {
        enterPasswordSession();
    }
}

function enterPasswordSession() {
    let params = new URLSearchParams(location.search);
    $.ajax({
        url: "/enterPasswordSession",
        data: { pass: $('#enter_pass_session').val(), id_session: params.get('id_session') },
        type: "post",
        success: function (result) {
            result = result["result"];
            if (result == 1) { //Password correct
                $('#space_pass_session').hide();
                $('#body-section').show();
            } else { //Password incorrect
                //Show alert
                content = "<div class='alert alert-warning alert-with-icon'>" +
                    "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                    "<i class='tim-icons icon-simple-remove'></i>" +
                    "</button>" +
                    "<span data-notify='icon' class='tim-icons icon-bulb-63'></span>" +
                    "<span>" +
                    "<b> Warning! - </b> Password Incorrect</span>" +
                    "</div>";

                $('#space_alert_pass_session').html(content);
            }
        }
    });
}

function checkrecoverEmail() {
    var keycode = event.keyCode;
    if (keycode == '13') {
        recoverEmail();
    }
}

function recoverEmail() {
    var email = $('#email_recovery').val();
    var alert = `<div class="alert alert-success alert-with-icon">
                    <button type="button" aria-hidden="true" class="close" data-dismiss="alert" aria-label="Close">
                    <i class="tim-icons icon-simple-remove"></i>
                    </button>
                    <span data-notify="icon" class="tim-icons icon-bell-55"></span>
                    <span>
                    <b> Done! - </b> If the e-mail was correct you'll receive it in a few seconds</span>
                </div>`;
    $.ajax({
        type: "post",
        url: "/checkemail",
        data: { "email": email },
        success: function (result) {
            result = result["result"];
            if (result == 1) {
                $('#alert_email_modal').html(alert);
            }
        }
    });
}

function onKeyUpNewPasswordUser() {
    var keycode = event.keyCode;
    if (keycode == '13') {
        newPasswordUser();
    }
}

function newPasswordUser() {

    let params = new URLSearchParams(location.search);
    var pass_user = $('#enter_new_pass_user').val();
    var pass_user2 = $('#enter_new_pass_user2').val();

    $.ajax({
        type: "post",
        url: "newPasswordUser",
        data: { pass_user: pass_user, pass_user2: pass_user2, id_user: params.get("id_user"), cadena: params.get("cad") },
        success: function (result) {
            result = result["result"];
            console.log("Result = " + result);

            var msg1 = `<div class="alert alert-info alert-with-icon">
                                    <button type="button" aria-hidden="true" class="close" data-dismiss="alert" aria-label="Close">
                                        <i class="tim-icons icon-simple-remove"></i>
                                    </button>
                                    <span data-notify="icon" class="tim-icons icon-trophy"></span>
                                    <span><b> Done! - </b> Password Reset</span>
                        </div>`;

            var msg2 = `<div class='alert alert-warning alert-with-icon'>
                                <button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>
                                    <i class='tim-icons icon-simple-remove'></i>
                                </button>
                                <span data-notify='icon' class='tim-icons icon-bulb-63'></span>
                                <span>
                                    <b> Warning! - </b> This reset link was already used or is incorrect</span>
                            </div>`;
            var msg3 = `<div class='alert alert-warning alert-with-icon'>
                                <button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>
                                    <i class='tim-icons icon-simple-remove'></i>
                                </button>
                                <span data-notify='icon' class='tim-icons icon-bulb-63'></span>
                                <span>
                                    <b> Warning! - </b> The password must have minimum 5 characters without spaces</span>
                            </div>`;
            var msg4 = `<div class='alert alert-warning alert-with-icon'>
                                <button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>
                                    <i class='tim-icons icon-simple-remove'></i>
                                </button>
                                <span data-notify='icon' class='tim-icons icon-bulb-63'></span>
                                <span>
                                    <b> Warning! - </b> The passwords are different</span>
                        </div>`;
            var msg5 = `<div class='alert alert-warning alert-with-icon'>
                                <button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>
                                    <i class='tim-icons icon-simple-remove'></i>
                                </button>
                                <span data-notify='icon' class='tim-icons icon-bulb-63'></span>
                                <span>
                                    <b> Warning! - </b> Try again later, something is wrong</span>
                        </div>`;
            if (result == 1) {
                $('#reset_space').hide();
                $('#msg_space1').html(msg1);
            } else if (result == 2) {
                $('#reset_space').hide();
                $('#msg_space_error2').html(msg2);
            } else if (result == 3) {
                $('#msg_space_error3').html(msg3);
            } else if (result == 4) {
                $('#msg_space_error4').html(msg4);
            } else if (result == 5) {
                $('#msg_space_error5').html(msg5);
            }
        }
    });
}
