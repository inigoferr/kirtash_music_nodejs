var player;
var id_cancion;
var no_song,no_player;
/* Callback for when the YouTube iFrame player is ready
   Function that is called at the beginning, when we load the page
*/
function onYouTubeIframeAPIReady() {
  //We obtain the ID of the first video of the playlist
  let params = new URLSearchParams(location.search);

  $.ajax({
    url: "/obtainFirstVideo",
    data: {id_session: params.get('id_session')},
    type: "post",
    success: function(result){
      obj = result;
      result = result["result"];
      if(result == -1){
        console.log("Enter 1");
        no_song = 1;
        no_player = 1;

        $('#title_video_playing').html("<small class='text-muted'> Waiting your music... </small>");
        //No player to display, so we show a black rectangle
        $('#player').html("<img src='/assets/img/black_player.png'></img>");

      } else if( result == -3 || result == -4){
        console.log("ERROR");
      } else {
        console.log("Enter 2");
        no_song = 0;
        no_player = 0;

        $('#title_video_playing').html( "<small class='text-muted'>Playing: </small>" + obj["title"]);
        videoId = obj["videoId"];
        id_cancion = obj["id_cancion"];

        updatePlaylist();
        player = new YT.Player('player', {
          // Set Player height and width
          height: '390',
          width: '640',
          playerVars: { 'autoplay': 1, 'controls': 0,'rel': 0,'disablekb': 1},
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


function onPlayerReady (){
  //add onStateChange event handler
  player.addEventListener("onStateChange","onPlayerStateChange");

  //add your own rate listener below:
  player.playVideo();
};

function onPlayerStateChange(event){
  // Get current state
  var currentState;
  if (event.data == YT.PlayerState.ENDED){
    currentState = "Ended";
    //The song is ended, we deleted from the database
    let params = new URLSearchParams(location.search);
    $.ajax({
      url: "/deleteFirstSong",
      data: {id_session: params.get('id_session'),id_cancion: id_cancion},
      type: "post",
      success: function(result){
            result = result["result"];
            if (result == 1){ //The first song has being deleted
              //We need to obtain the next song and update the page
              $.ajax({
              url: "/obtainFirstVideo",
              data: {id_session: params.get('id_session')},
              type: "post",
              success: function(result){
                  obj = result;
                  result = result["result"];
                  if (result == -1){ //There aren't songs to play in the playlist
                    console.log("Enter 3");
                    no_song = 1;
                    $('#title_video_playing').html("<small class='text-muted'>Waiting your music... </small>");
                    //We destroy the player
                    player.destroy();
                    no_player = 1;
                    $('#player_above').html("<div id='player'></div>");
                    //We add the black rectangle
                    $('#player').html("<img src='/assets/img/black_player.png'></img>");

                  } else  if (result == -3  || result == -4){
                      console.log("ERROR -----");
                  } else { //There are songs to play in the playlist
                    console.log("Enter 4");
                    no_song = 0;
                    no_player = 0; //aqui

                    $('#title_video_playing').html( "<small class='text-muted'>Playing: </small>"  + obj["title"]);
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
  else if (event.data == YT.PlayerState.PLAYING){
    currentState = "Playing";
  } 
  else if (event.data == YT.PlayerState.PAUSED){
    currentState = "Paused";
    player.playVideo();
  }  
  else if (event.data == YT.PlayerState.BUFFERING){
    currentState = "Buffering";
  }
  else if (event.data == YT.PlayerState.CUED){
    currentState = "Cued";
  } else{
    currentState = "Unknown";
  }

  currentState += " (" + event.data + ")";
  // Update video state div
  //document.getElementById('currentState').innerText = currentState;
};

function noSong_SongAdded(){
  if (no_song == 1){ //No Song in the player
    console.log("Enter 5");
    let params = new URLSearchParams(location.search);
    $.ajax({
      url: "/obtainFirstVideo",
      data: {id_session: params.get('id_session')},
      type: "post",
      success: function(result){ //We received the information from the server
          result = result["result"];
          if (result == -3  || result == -4){
            console.log("ERROR");
            no_song = 1;
          }
          if (result == -1){ //No songs in the playlist
            console.log("Enter 6");
            no_song = 1;
            $('#title_video_playing').html("<small class='text-muted'>Paused, waiting your music... </small>");
            $('#player').html("<img src='/assets/img/black_player.png'></img>");

          } else {
            console.log("Enter 7");
            no_song = 0;

            obj = result;
            $('#title_video_playing').html( "<small class='text-muted'>Playing: </small>"  + obj["title"]);
            videoId = obj["videoId"];
            id_cancion = obj["id_cancion"];

            if (no_player == 1){
              console.log("Enter 8");
              player = new YT.Player('player', {
                // Set Player height and width
                height: '390',
                width: '640',
                playerVars: { 'autoplay': 1, 'controls': 0,'rel': 0,'disablekb': 1},
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
          }
      }
    });  
  } else { //A song is being played
    console.log("Enter 10");
    updatePlaylist();
  }
}

function onPlaybackRateChange(event){
  // Implment this function to display the rate of the player on the page
  var currentRate;
  // You code goes here
  document.getElementById('currentRate').innerText = currentRate;  
}

function retireActualSong(){
  params = new URLSearchParams(location.search);
  $.ajax({
      url: "/retireActualSong",
      data: {id_session: params.get('id_session')},
      type: "post",
      success: function(result){
        //We update playlist, player...
        result = result["result"];
        if (result == -2){
          $alert = "<div class='alert alert-warning alert-with-icon'>"+
                  "<button type='button' aria-hidden='true' class='close' data-dismiss='alert' aria-label='Close'>"+
                      "<i class='tim-icons icon-simple-remove'></i>"+
                  "</button>"+
                  "<span data-notify='icon' class='tim-icons icon-bell-55'></span>"+
                  "<span><b> Attention! - </b> No song is being played </span>"+
                  "</div>";
          $('#span_alert').html($alert);
        } else if (result == -1){
           console.log("Error deleting actual song");
        } else if (result == 1){
          //We need to obtain the next song and update the page
          $.ajax({
            url: "/obtainFirstVideo",
            data: {id_session: params.get('id_session'),accion:""},
            type: "post",
            success: function(result){
                result = result["result"];
                if (result == -1){ //There aren't songs to play in the playlist
                  no_song = 1;
                  $('#title_video_playing').html("<small class='text-muted'>Waiting your music... </small>");
                  //We destroy the player
                  player.destroy();
                  no_player = 1;
                  $('#player_above').html("<div id='player'></div>");
                  //We add the black rectangle
                  $('#player').html("<img src='/assets/img/black_player.png'></img>");

                } else if (result == -3  || result == -4){
                  console.log("ERROR AQUI");
                } else { //There are songs to play in the playlist    
                  no_song = 0;
                  obj = JSON.parse(result);
                  $('#title_video_playing').html( "<small class='text-muted'>Playing: </small>"  + obj["title"]);
                  videoId = obj["videoId"];
                  id_cancion = obj["id_cancion"];
                  player.loadVideoById(videoId);
                  player.playVideo();
                  updatePlaylist();
                }
            }
          });
        }
      }
  });
}

