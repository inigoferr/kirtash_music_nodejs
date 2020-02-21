// Define some variables used to remember state.
var playlistId, channelId;

// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
    $('#search-button').attr('disabled', false);
}
  
// Search for a specified string.
function search() {
    //Show the loading animation
    $('#loader').addClass("loader");

    var q = $('#query').val();
    var request = gapi.client.youtube.search.list({
        q: q,
        part: 'snippet',
        maxResults: 10,
        type: 'video'
    });

    request.execute(function(response) {
        var listItems = response.result.items;
        
        ids = "";
        listItems.forEach( item =>{ 
            ids = ids + item.id.videoId + ",";
        });

        var request2 = gapi.client.youtube.videos.list({
            part: 'contentDetails',
            id: ids //concatenate ID
        });

        var reptms = /^PT(?:(\d+\.*\d*)H)?(?:(\d+\.*\d*)M)?(?:(\d+\.*\d*)S)?$/;
        var durations = [];
        request2.execute(function(response) {
            listItems2 = response.items;
            listItems2.forEach( item =>{
                input = item.contentDetails.duration;
                if (reptms.test(input)){
                    var matches = reptms.exec(input);
                    aux = "";
                    if (matches[1]){ 
                        hours = Number(matches[1]);
                        aux = hours + ":";
                    }
                    if (matches[2]){ 
                        minutes = Number(matches[2]);
                        aux = aux + minutes + ":";
                    } else {
                        aux = aux + '0' + ":"; 
                    }
                    if (matches[3]){ 
                        seconds = Number(matches[3]);
                        if (seconds < 10){
                            aux = aux + "0" + seconds;
                        } else {
                            aux = aux + seconds;
                        }
                    } else {
                        aux = aux + '00';
                    }
                    durations.push(aux);
                }
            });

            result = "<table class='table'><thead><tr><th>Title</th><th>Duration</th><th>Add</th></tr></thead><tbody>";
            i = 0;
            //Mostrar los resultados en una lista de botones con videoID incorporado en cada uno
            listItems.forEach( item =>{
                i++;
                time = durations.shift();
                template =                         
                    "<tr>" + 
                    "<td id='search_list_" + i + "' name='"+ item.id.videoId +"'>" + item.snippet.title + "</td>" + 
                    "<td>"+ time + "</td>" + 
                    "<td>" + 
                        "<button type='button' rel='tooltip' class='btn btn-success btn-sm btn-icon'onclick='addVideoToPlaylist("+ i +")'>"+
                            "<i class='tim-icons icon-simple-add'></i>" +
                        "</button>" +
                        "<input type='hidden' id='duration_" + i + "' value='"+ time +"'/>" +  
                    "</td>" + 
                    "</tr>";

                result += template;
            });
            if(i == 0){
                result = "No videos founded";
            } else{
                result +=  "</tbody></table>";
            }
            //Remove the loading animation
            $('#loader').removeClass("loader");

            $('#search-container').html(result);

        });       
    });
}

function onKeyUpSearch(){
    var keycode = event.keyCode;
    if(keycode == '13'){
        search();
    }
}


// Add a video ID specified in the form to the playlist.
function addVideoToPlaylist(number) {
    videoId = $('#search_list_'+ number).attr('name');
    title = $('#search_list_'+ number).html();
    duration = $('#duration_' + number).val();

    addToPlaylist(title,videoId,duration);
  }

function addToPlaylist(title,id,duration) {
    //Insert the video in the database
    let params = new URLSearchParams(location.search);
    $.ajax({
        url: "/addToPlaylist",
        data: {id_session: params.get('id_session'),title: title, videoId: id,duration: duration},
        type: "post",
        success: function(result){
            noSong_SongAdded(); //We call it to see if we have to add it to the playlist, play it...
            //Update the list we are showing to the users
            //updatePlaylist();
        }
    });        

}

function addMark(id_cancion){
    $.ajax({
        url: "/checkregistration",
        type: "post",
        success: function(result){
            result = result["result"];
            if (result == 1){ //User registered, he can votes
                 //We disable the button
                $('#add_' + id_cancion).attr('disabled', true);
                //We update the mark of the song
                let params = new URLSearchParams(location.search);
                $.ajax({
                    url: "/updateMark",
                    data: {id_session: params.get('id_session'),id_cancion: id_cancion,number: 1},
                    type: "post",
                    success: function(result){ //We received the information from the server
                        //We update the playlist and maybe his order
                        updatePlaylist();
                    }
                });    
            } else {//User not registered, he can't votes
                $alert = "<div class='alert alert-warning alert-with-icon'>"+
                            "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>"+
                                "<i class='tim-icons icon-simple-remove'></i>"+
                            "</button>"+
                        "<span data-notify='icon' class='tim-icons icon-bell-55'></span>"+
                        "<span><b> Attention! - </b> You need to be registered to vote</span>"+
                        "</div>";
                $('#span_alert_vote').html($alert);
            }
        }
    });         
   

}

function substractMark(id_cancion){
    $.ajax({
        url: "/checkregistration",
        type: "post",
        success: function(result){
            if (result == 1){
                //We disable the button
                $('#substract_' + id_cancion).attr('disabled', true);
                //We update the mark of the song
                let params = new URLSearchParams(location.search);
                $.ajax({
                    url: "/updateMark",
                    data: {id_session: params.get('id_session'),id_cancion: id_cancion,number: -1},
                    type: "post",
                    success: function(result){ //We received the information from the server
                        //We update the playlist and maybe his order
                        updatePlaylist();
                    }
                });   
            } else {
                $alert = "<div class='alert alert-warning alert-with-icon'>"+
                            "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>"+
                                "<i class='tim-icons icon-simple-remove'></i>"+
                            "</button>"+
                        "<span data-notify='icon' class='tim-icons icon-bell-55'></span>"+
                        "<span><b> Attention! - </b> You need to be registered to vote</span>"+
                        "</div>";
                $('#span_alert_vote').html($alert);                
            }
        }
    });
}

function removeSong(id_cancion){
    let params = new URLSearchParams(location.search);
    $.ajax({
        url: "/removeSong",
        data: {id_cancion: id_cancion,id_session: params.get('id_session')},
        type: "post",
        success: function(result){ //We received the information from the server
            //We update the playlist and maybe his order
            updatePlaylist();  
        }
    });     
}

/**
 * Function that update the playlist
 */
function updatePlaylist(){
    let params = new URLSearchParams(location.search);
    $.ajax({
        url: "/updatePlaylist",
        data: {id_session: params.get('id_session')},
        type: "post",
        success: function(result){ //We received the information from the server
            $('#playlist-container').html(result);
        }
    });  
}

function exitSession(){
    $.ajax({
        url: "/exitSession",
        type: "post",
        success: function(result){ //We received the information from the server
            result = result["result"];
            if (result == -1){ //It's not registered
                window.location = "/index.html";
            } else { //It's registered
                window.location = "/menu.html";
            }
        }
    });
}

function followSession(x){
    if (x == -1){ //User not registered, he couldn't follow or unfollow
        //We show an alert to the user
        $alert = "<div class='alert alert-warning alert-with-icon'>"+
                    "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>"+
                        "<i class='tim-icons icon-simple-remove'></i>"+
                    "</button>"+
                "<span data-notify='icon' class='tim-icons icon-bell-55'></span>"+
                "<span><b> Attention! - </b> You need to be registered to follow a session</span>"+
                "</div>";
        $('#span_alert').html($alert);
    } else if (x == 0){ //User wants to follow the session
        let params = new URLSearchParams(location.search);
        $.ajax({
            url: "/followSession",
            data: {id_session: params.get('id_session')},
            type: "post",
            success: function(result){
                //We update the follow_button
                $.ajax({
                    url: "/showFollowButton",
                    data: {id_session: params.get('id_session')},
                    type: "post",
                    success: function(result){
                        $('#follow_button').html(result);
                    }
                });
            }
        });        
    } else {//User wants to unfollow the session
        let params = new URLSearchParams(location.search);
        $.ajax({
            url: "/unfollowSession",
            data: {id_session: params.get('id_session')},
            type: "post",
            success: function(result){
                $.ajax({
                    url: "/showFollowButton",
                    data: {id_session: params.get('id_session')},
                    type: "post",
                    success: function(result){
                        $('#follow_button').html(result);
                    }
                });
            }
        });
    }
}

window.onload = function(){
    /*We load the View */
    let params = new URLSearchParams(location.search);
    $.ajax({
        type: "post",
        url: "/checkadmin",
        data: {"id_session": params.get('id_session')},
        success: function (response) {
            
            //$view->v_showButtonUsernameGuest();
            $.ajax({
                type: "post",
                url: "/v_showButtonUsernameGuest",
                success: function (response) {
                    $('#profile_session').html(response);
                    $.ajax({
                        type: "post",
                        url: "/v_showButtonSignOut",
                        data: "data",
                        success: function (response) {
                            //v_showButtonSignOut
                            html = $('#navbar-nav-ul').html();
                            $('#navbar-nav-ul').html(html+response);

                            //v_showSpacePassSession
                            $.ajax({
                                type: "post",
                                url: "/v_showSpacePassSession",
                                success: function (response) {
                                    $('#space_pass_session').html(response);
                                        //v_showNameSession
                                        $.ajax({
                                            type: "post",
                                            data: {"id_session": params.get('id_session')},
                                            url: "/v_showNameSession",
                                            success: function (response) {
                                                $('#name_session').html(response);

                                                //v_showNavbarSession($_GET["id_session"],1);
                                                $.ajax({
                                                    type: "post",
                                                    url: "/v_showNavbarSession",
                                                    data: {"id_session" : params.get('id_session')},
                                                    success: function (response) {
                                                        $('#navbarsession').html(response);

                                                        let params = new URLSearchParams(location.search);
                                                        $.ajax({
                                                            url: "/checkSession",
                                                            data: {id_session: params.get('id_session')},
                                                            type: "post",
                                                            success: function(result){
                                                                result = result["result"];
                                                                if (result == -1){ //The session doesn't exist
                                                                    $.ajax({
                                                                        url: "/showNoSession",
                                                                        data: {id_session: params.get('id_session')},
                                                                        type: "post",
                                                                        success: function(result){
                                                                            $('#body-section').html(result);
                                                                            $('#body-section').show();
                                                                        }
                                                                    });
                                                                } else { //The session exists but we have to check if it's public or private
                                                                    $.ajax({
                                                                        url: "/checkTypeSession",
                                                                        data: {id_session: params.get('id_session')},
                                                                        type: "post",
                                                                        success: function(result){
                                                                            result = result["result"];
                                                                            if (result == 2){ //Session is private
                                                                                //We see if the user is Admin or not
                                                                                $.ajax({
                                                                                    url: "/isAdmin",
                                                                                    type: "post",
                                                                                    success: function(result){
                                                                                        result = result["result"];
                                                                                        if (result == 0){ //User not admin, he needs password to enter
                                                                                            //We hide everything until, he enters the correct password
                                                                                            $('#body-section').hide(); 
                                                                                            $('#space_pass_session').show();
                                                                                        } else {
                                                                                            $('#body-section').show();
                                                                                        }
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                $('#body-section').show();
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                }
                            });
                        }
                    });
                }
            });  
        }
    });
}