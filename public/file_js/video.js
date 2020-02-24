// Define some variables used to remember state.
var playlistId, channelId;
var socket = io();//We connect the user to the Socket.io Server

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

    request.execute(function (response) {
        var listItems = response.result.items;

        ids = "";
        listItems.forEach(item => {
            ids = ids + item.id.videoId + ",";
        });

        var request2 = gapi.client.youtube.videos.list({
            part: 'contentDetails',
            id: ids //concatenate ID
        });

        var reptms = /^PT(?:(\d+\.*\d*)H)?(?:(\d+\.*\d*)M)?(?:(\d+\.*\d*)S)?$/;
        var durations = [];
        request2.execute(function (response) {
            listItems2 = response.items;
            listItems2.forEach(item => {
                input = item.contentDetails.duration;
                if (reptms.test(input)) {
                    var matches = reptms.exec(input);
                    aux = "";
                    if (matches[1]) {
                        hours = Number(matches[1]);
                        aux = hours + ":";
                    }
                    if (matches[2]) {
                        minutes = Number(matches[2]);
                        aux = aux + minutes + ":";
                    } else {
                        aux = aux + '0' + ":";
                    }
                    if (matches[3]) {
                        seconds = Number(matches[3]);
                        if (seconds < 10) {
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
            listItems.forEach(item => {
                i++;
                time = durations.shift();
                template =
                    "<tr>" +
                    "<td id='search_list_" + i + "' name='" + item.id.videoId + "'>" + item.snippet.title + "</td>" +
                    "<td>" + time + "</td>" +
                    "<td>" +
                    "<button type='button' rel='tooltip' class='btn btn-success btn-sm btn-icon'onclick='addVideoToPlaylist(" + i + ")'>" +
                    "<i class='tim-icons icon-simple-add'></i>" +
                    "</button>" +
                    "<input type='hidden' id='duration_" + i + "' value='" + time + "'/>" +
                    "</td>" +
                    "</tr>";

                result += template;
            });
            if (i == 0) {
                result = "No videos founded";
            } else {
                result += "</tbody></table>";
            }
            //Remove the loading animation
            $('#loader').removeClass("loader");

            $('#search-container').html(result);

        });
    });
}

function onKeyUpSearch() {
    var keycode = event.keyCode;
    if (keycode == '13') {
        search();
    }
}


// Add a video ID specified in the form to the playlist.
function addVideoToPlaylist(number) {
    videoId = $('#search_list_' + number).attr('name');
    title = $('#search_list_' + number).html();
    duration = $('#duration_' + number).val();

    addToPlaylist(title, videoId, duration);
}

function addToPlaylist(title, id, duration) {
    //Insert the video in the database
    let params = new URLSearchParams(location.search);
    $.ajax({
        url: "/addToPlaylist",
        data: { id_session: params.get('id_session'), title: title, videoId: id, duration: duration },
        type: "post",
        success: function (result) {
            noSong_SongAdded(); //We call it to see if we have to add it to the playlist, play it...
            //Update the list we are showing to the users
            //updatePlaylist();
        }
    });

}

function addMark(id_cancion) {
    $.ajax({
        url: "/checkregistration",
        type: "post",
        success: function (result) {
            result = result["result"];
            if (result == 1) { //User registered, he can votes
                //We disable the button
                $('#add_' + id_cancion).attr('disabled', true);
                //We update the mark of the song
                let params = new URLSearchParams(location.search);
                $.ajax({
                    url: "/updateMark",
                    data: { id_session: params.get('id_session'), id_cancion: id_cancion, number: 1 },
                    type: "post",
                    success: function (result) { //We received the information from the server
                        //We update the playlist and maybe his order
                        updatePlaylist();

                        //We notify the server that we have update the mark of one song
                        room = "session" + params.get('id_session'); 
                        socket.emit('new_vote',{"room" : room});
                    }
                });
            } else {//User not registered, he can't votes
                $alert = "<div class='alert alert-warning alert-with-icon'>" +
                    "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                    "<i class='tim-icons icon-simple-remove'></i>" +
                    "</button>" +
                    "<span data-notify='icon' class='tim-icons icon-bell-55'></span>" +
                    "<span><b> Attention! - </b> You need to be registered to vote</span>" +
                    "</div>";
                $('#span_alert_vote').html($alert);
            }
        }
    });


}

function substractMark(id_cancion) {
    $.ajax({
        url: "/checkregistration",
        type: "post",
        success: function (result) {
            result = result["result"];
            if (result == 1) {
                //We disable the button
                $('#substract_' + id_cancion).attr('disabled', true);
                //We update the mark of the song
                let params = new URLSearchParams(location.search);
                $.ajax({
                    url: "/updateMark",
                    data: { id_session: params.get('id_session'), id_cancion: id_cancion, number: -1 },
                    type: "post",
                    success: function (result) { //We received the information from the server
                        //We update the playlist and maybe his order
                        updatePlaylist();
                        //We notify the server that we have update the mark of one song
                        room = "session" + params.get('id_session'); 
                        socket.emit('new_vote',{"room" : room});
                    }
                });
            } else {
                $alert = "<div class='alert alert-warning alert-with-icon'>" +
                    "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                    "<i class='tim-icons icon-simple-remove'></i>" +
                    "</button>" +
                    "<span data-notify='icon' class='tim-icons icon-bell-55'></span>" +
                    "<span><b> Attention! - </b> You need to be registered to vote</span>" +
                    "</div>";
                $('#span_alert_vote').html($alert);
            }
        }
    });
}

function removeSong(id_cancion) {
    let params = new URLSearchParams(location.search);
    $.ajax({
        url: "/removeSong",
        data: { id_cancion: id_cancion, id_session: params.get('id_session') },
        type: "post",
        success: function (result) { //We received the information from the server
            //We update the playlist and maybe his order
            updatePlaylist();
        }
    });
}

/**
 * Function that update the playlist
 */
function updatePlaylist() {
    let params = new URLSearchParams(location.search);
    $.ajax({
        url: "/updatePlaylist",
        data: { id_session: params.get('id_session') },
        type: "post",
        success: function (result) { //We received the information from the server
            $('#playlist-container').html(result);
        }
    });
}

function exitSession() {
    $.ajax({
        url: "/exitSession",
        type: "post",
        success: function (result) { //We received the information from the server
            result = result["result"];
            if (result == -1) { //It's not registered
                window.location = "/index.html";
            } else { //It's registered
                window.location = "/menu.html";
            }
        }
    });
}

function followSession(x) {
    if (x == -1) { //User not registered, he couldn't follow or unfollow
        //We show an alert to the user
        $alert = "<div class='alert alert-warning alert-with-icon'>" +
            "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
            "<i class='tim-icons icon-simple-remove'></i>" +
            "</button>" +
            "<span data-notify='icon' class='tim-icons icon-bell-55'></span>" +
            "<span><b> Attention! - </b> You need to be registered to follow a session</span>" +
            "</div>";
        $('#span_alert').html($alert);
    } else if (x == 0) { //User wants to follow the session
        let params = new URLSearchParams(location.search);
        $.ajax({
            url: "/followSession",
            data: { id_session: params.get('id_session') },
            type: "post",
            success: function (result) {
                //We update the follow_button
                $.ajax({
                    url: "/showFollowButton",
                    data: { id_session: params.get('id_session') },
                    type: "post",
                    success: function (result) {
                        $('#follow_button').html(result);
                    }
                });
            }
        });
    } else {//User wants to unfollow the session
        let params = new URLSearchParams(location.search);
        $.ajax({
            url: "/unfollowSession",
            data: { id_session: params.get('id_session') },
            type: "post",
            success: function (result) {
                $.ajax({
                    url: "/showFollowButton",
                    data: { id_session: params.get('id_session') },
                    type: "post",
                    success: function (result) {
                        $('#follow_button').html(result);
                    }
                });
            }
        });
    }
}

window.onload = function () {
    /*We load the View */
    let params = new URLSearchParams(location.search);
    $.ajax({
        type: "post",
        url: "/checkadmin",
        data: { "id_session": params.get('id_session') },
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
                            $('#navbar-nav-ul').html(html + response);

                            //v_showSpacePassSession
                            $.ajax({
                                type: "post",
                                url: "/v_showSpacePassSession",
                                success: function (response) {
                                    $('#space_pass_session').html(response);
                                    //v_showNameSession
                                    $.ajax({
                                        type: "post",
                                        data: { "id_session": params.get('id_session') },
                                        url: "/v_showNameSession",
                                        success: function (response) {
                                            $('#name_session').html(response);

                                            //v_showNavbarSession($_GET["id_session"],1);
                                            $.ajax({
                                                type: "post",
                                                url: "/v_showNavbarSession",
                                                data: { "id_session": params.get('id_session') },
                                                success: function (response) {
                                                    $('#navbarsession').html(response);

                                                    let params = new URLSearchParams(location.search);
                                                    $.ajax({
                                                        url: "/checkSession",
                                                        data: { id_session: params.get('id_session') },
                                                        type: "post",
                                                        success: function (result) {
                                                            result = result["result"];
                                                            if (result == -1) { //The session doesn't exist
                                                                $.ajax({
                                                                    url: "/showNoSession",
                                                                    data: { id_session: params.get('id_session') },
                                                                    type: "post",
                                                                    success: function (result) {
                                                                        $('#body-section').html(result);
                                                                        $('#body-section').show();
                                                                    }
                                                                });
                                                            } else { //The session exists but we have to check if it's public or private
                                                                $.ajax({
                                                                    url: "/checkTypeSession",
                                                                    data: { id_session: params.get('id_session') },
                                                                    type: "post",
                                                                    success: function (result) {
                                                                        result = result["result"];
                                                                        if (result == 2) { //Session is private
                                                                            //We see if the user is Admin or not
                                                                            $.ajax({
                                                                                url: "/isAdmin",
                                                                                type: "post",
                                                                                success: function (result) {
                                                                                    result = result["result"];
                                                                                    if (result == 0) { //User not admin, he needs password to enter
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
                                                                            
                                                                            
                                                                                                                                                    
                                                                            var room = 'session' + params.get('id_session');
                                                                            socket.emit('join_room',room);
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

//EVENT_LISTENERS.JS
var player;
var id_cancion;
var no_song, no_player;
/* Callback for when the YouTube iFrame player is ready
   Function that is called at the beginning, when we load the page
*/
function onYouTubeIframeAPIReady() {
    //We obtain the ID of the first video of the playlist
    let params = new URLSearchParams(location.search);

    $.ajax({
        url: "/obtainFirstVideo",
        data: { id_session: params.get('id_session') },
        type: "post",
        success: function (result) {
            obj = result;
            result = result["result"];
            if (result == -1) {
                console.log("Enter 1");
                no_song = 1;
                no_player = 1;

                $('#title_video_playing').html("<small class='text-muted'> Waiting your music... </small>");
                //No player to display, so we show a black rectangle
                $('#player').html("<img src='/assets/img/black_player.png'></img>");

            } else if (result == -3 || result == -4) {
                console.log("ERROR");
            } else {
                console.log("Enter 2");
                no_song = 0;
                no_player = 0;

                $('#title_video_playing').html("<small class='text-muted'>Playing: </small>" + obj["title"]);
                videoId = obj["videoId"];
                id_cancion = obj["id_cancion"];

                updatePlaylist();
                player = new YT.Player('player', {
                    // Set Player height and width
                    height: '390',
                    width: '640',
                    playerVars: { 'autoplay': 1, 'controls': 0, 'rel': 0, 'disablekb': 1 },
                    videoId: videoId, // Set the id of the video to be played
                    events: {
                        'onReady': onPlayerReady
                        // You can add more event listeners here
                    }
                });
            }
        }
    });
};


function onPlayerReady() {
    //add onStateChange event handler
    player.addEventListener("onStateChange", "onPlayerStateChange");

    //add your own rate listener below:
    player.playVideo();
};

function onPlayerStateChange(event) {
    // Get current state
    var currentState;
    if (event.data == YT.PlayerState.ENDED) {
        currentState = "Ended";
        //The song is ended, we deleted from the database
        let params = new URLSearchParams(location.search);
        $.ajax({
            url: "/deleteFirstSong",
            data: { id_session: params.get('id_session'), id_cancion: id_cancion },
            type: "post",
            success: function (result) {
                result = result["result"];
                if (result == 1) { //The first song has being deleted
                    //We need to obtain the next song and update the page
                    $.ajax({
                        url: "/obtainFirstVideo",
                        data: { id_session: params.get('id_session') },
                        type: "post",
                        success: function (result) {
                            obj = result;
                            result = result["result"];
                            if (result == -1) { //There aren't songs to play in the playlist
                                console.log("Enter 3");
                                no_song = 1;
                                $('#title_video_playing').html("<small class='text-muted'>Waiting your music... </small>");
                                //We destroy the player
                                player.destroy();
                                no_player = 1;
                                $('#player_above').html("<div id='player'></div>");
                                //We add the black rectangle
                                $('#player').html("<img src='/assets/img/black_player.png'></img>");

                            } else if (result == -3 || result == -4) {
                                console.log("ERROR -----");
                            } else { //There are songs to play in the playlist
                                console.log("Enter 4");
                                no_song = 0;
                                no_player = 0; //aqui

                                $('#title_video_playing').html("<small class='text-muted'>Playing: </small>" + obj["title"]);
                                videoId = obj["videoId"];
                                id_cancion = obj["id_cancion"];
                                player.loadVideoById(videoId);
                                player.playVideo();
                                updatePlaylist();
                            }
                        }
                    });
                } else {
                    console.log("ERROR DELETING FIRST SONG");
                }
            }
        });
    }
    else if (event.data == YT.PlayerState.PLAYING) {
        currentState = "Playing";
    }
    else if (event.data == YT.PlayerState.PAUSED) {
        currentState = "Paused";
        player.playVideo();
    }
    else if (event.data == YT.PlayerState.BUFFERING) {
        currentState = "Buffering";
    }
    else if (event.data == YT.PlayerState.CUED) {
        currentState = "Cued";
    } else {
        currentState = "Unknown";
    }

    currentState += " (" + event.data + ")";
    // Update video state div
    //document.getElementById('currentState').innerText = currentState;
};

function noSong_SongAdded() {
    if (no_song == 1) { //No Song in the player
        console.log("Enter 5");
        let params = new URLSearchParams(location.search);
        $.ajax({
            url: "/obtainFirstVideo",
            data: { id_session: params.get('id_session') },
            type: "post",
            success: function (result) { //We received the information from the server
                result = result["result"];
                if (result == -3 || result == -4) {
                    console.log("ERROR");
                    no_song = 1;
                }
                if (result == -1) { //No songs in the playlist
                    console.log("Enter 6");
                    no_song = 1;
                    $('#title_video_playing').html("<small class='text-muted'>Paused, waiting your music... </small>");
                    $('#player').html("<img src='/assets/img/black_player.png'></img>");

                } else {
                    console.log("Enter 7");
                    no_song = 0;

                    obj = result;
                    $('#title_video_playing').html("<small class='text-muted'>Playing: </small>" + obj["title"]);
                    videoId = obj["videoId"];
                    id_cancion = obj["id_cancion"];

                    if (no_player == 1) {
                        console.log("Enter 8");
                        player = new YT.Player('player', {
                            // Set Player height and width
                            height: '390',
                            width: '640',
                            playerVars: { 'autoplay': 1, 'controls': 0, 'rel': 0, 'disablekb': 1 },
                            videoId: videoId,
                            events: {
                                'onReady': onPlayerReady
                                // You can add more event listeners here
                            }
                        });
                    } else {
                        console.log("Enter 9");
                        player.loadVideoById(videoId);
                        player.playVideo();
                    }
                    updatePlaylist();
                    //Send the new song added to the server
                    room = "session" + params.get('id_session'); 
                    socket.emit('new_song',{"room" : room});
                }
            }
        });
    } else { //A song is being played
        console.log("Enter 10");
        updatePlaylist();
        room = "session" + params.get('id_session'); 
        socket.emit('new_song',{"room" : room});
    }
}

function onPlaybackRateChange(event) {
    // Implment this function to display the rate of the player on the page
    var currentRate;
    // You code goes here
    document.getElementById('currentRate').innerText = currentRate;
}

function retireActualSong() {
    params = new URLSearchParams(location.search);
    $.ajax({
        url: "/retireActualSong",
        data: { id_session: params.get('id_session') },
        type: "post",
        success: function (result) {
            //We update playlist, player...
            result = result["result"];
            if (result == -2) {
                $alert = "<div class='alert alert-warning alert-with-icon'>" +
                    "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>" +
                    "<i class='tim-icons icon-simple-remove'></i>" +
                    "</button>" +
                    "<span data-notify='icon' class='tim-icons icon-bell-55'></span>" +
                    "<span><b> Attention! - </b> No song is being played </span>" +
                    "</div>";
                $('#span_alert').html($alert);
            } else if (result == -1) {
                console.log("Error deleting actual song");
            } else if (result == 1) {
                //We need to obtain the next song and update the page
                $.ajax({
                    url: "/obtainFirstVideo",
                    data: { id_session: params.get('id_session')},
                    type: "post",
                    success: function (result) {
                        result = result["result"];
                        if (result == -1) { //There aren't songs to play in the playlist
                            no_song = 1;
                            $('#title_video_playing').html("<small class='text-muted'>Waiting your music... </small>");
                            //We destroy the player
                            player.destroy();
                            no_player = 1;
                            $('#player_above').html("<div id='player'></div>");
                            //We add the black rectangle
                            $('#player').html("<img src='/assets/img/black_player.png'></img>");

                            //Notify the server the song actual has being retired
                            room = "session" + params.get('id_session');
                            socket.emit('song_retired_no_more_songs',{"room" : room});

                        } else if (result == -3 || result == -4) {
                            console.log("ERROR AQUI");
                        } else { //There are songs to play in the playlist    
                            no_song = 0;
                            obj = JSON.parse(result);
                            $('#title_video_playing').html("<small class='text-muted'>Playing: </small>" + obj["title"]);
                            videoId = obj["videoId"];
                            id_cancion = obj["id_cancion"];
                            player.loadVideoById(videoId);
                            player.playVideo();
                            updatePlaylist();

                            //Notify the server the song actual has being retired
                            room = "session" + params.get('id_session');
                            socket.emit('song_retired',{"room" : room});
                        }
                    }
                });
            }
        }
    });
}

//Events the user must be listening to

/**
 * User has to update his playlist
 */
socket.on('update_playlist',function(data){
    console.log("Tengo que actualizar playlist = " + data);
    updatePlaylist();
});

/**
 * User is asked to tell the time
 */
socket.on('ask_time_player',function(data){
    console.log("Enviando time_player");
    if(no_player == 0){ //There is aplayer, so time to tell
        answer = player.getCurrentTime();
        let params = new URLSearchParams(location.search);
        room = "session" + params.get("id_session");
        
        data = {"time":answer,"room":room};
        socket.emit('answer_time_player',data);
    }
});

/**
 * User receives the time of the player
 */
socket.on('time_player',function(time){
    console.log("Time_player set");
    player.seekTo(time);
});

/**
 * User has to put the black box because there are no more songs
 */
socket.on('no_more_songs_black_image',function(data){
    console.log("Actualizando porque no hay mas canciones");

    no_song = 1;
    $('#title_video_playing').html("<small class='text-muted'>Waiting your music... </small>");
    //We destroy the player
    player.destroy();
    no_player = 1;
    $('#player_above').html("<div id='player'></div>");
    //We add the black rectangle
    $('#player').html("<img src='/assets/img/black_player.png'></img>");
});

/**
 * User can leaves the waiting room
 */
socket.on('leave_waiting_room',function(data){
    console.log("Solicitando abandonar waiting_room");
    params = new URLSearchParams(location.search);
    waiting_room = "room" + params.get('id_session') + "_waiting";
    socket.emit('leave_room',waiting_room); 
});