<?php
    class Controlador{

        private $model;
        private $view;

        public function __construct($model,$view){
            $this->model = $model;
            $this->view = $view;
        }

        /**
         * Function to sign up, it returns different results:
         * -6 --> Username length less than 5 characters
         * -5 --> Password length less than 5 characters
         * -4 --> The username or the passwords fields/inputs are empty
         * -3 --> Any other problem
         * -2 --> The username typed is already used
         * -1 --> Something wasn't correct
         * 1 --> Everything was correct and the user has signed up
         */
        public function sign_up($username,$pass_user,$pass_user2){

            /*$username = $_POST["username"];
            $pass_user = $_POST["pass_user"];
            $pass_user2 = $_POST["pass_user2"];*/
            
            $length = preg_match_all ('/[^ ]/' , $username, $matches);
            $lengthp = preg_match_all ('/[^ ]/' , $pass_user, $matches);

            if ($length < 5){
                $result = -6;
            } else if( $lengthp < 5){
                $result = -5;
            } else if ( strcmp($username,"") == 0){
                $result = -4;
            } else if ( strcmp($pass_user,"") == 0){
                $result = -4;
            } else if ( strcmp($pass_user2,"") == 0){
                $result = -4;
            } else if ( strcmp($pass_user,$pass_user2) == 0){
                $result = $this->model->m_signup($username,$pass_user);
            } else {
                $result = -3;
            }
            //We return the result of the operation
            return $result;
        }

        /**
         * Function to login 
         */
        public function sign_in(){
            $username = $_POST["username"];
            $pass_user = $_POST["pass_user"];

            $result =$this->model->m_signin($username,$pass_user);

            return $result;
        }

        /**
         * Function to close session
         */
        public function close_session(){
            $this->model->m_close_session();

            header("Location: Index.php");
        }

        /**
         * Function to create a new session
         */
        public function create_session(){
            $name_session = $_POST["name_session"];
            $pass_user = $_POST["pass_session"];
            $pass_user2 = $_POST["pass_session2"];
            $description = $_POST["description"];
            $min_votes = $_POST["min_votes"];
            $min_users = $_POST["min_users"];
            $type_session = $_POST["type_session"];

            $lengthn = preg_match_all ('/[^ ]/' , $name_session, $matches);
            $lengthp = preg_match_all ('/[^ ]/' , $pass_user, $matches);

            if ($lengthn == 0){
                $result = -1;
            } else if ($lengthp < 5){
                $result = -2;
            } else if (strcmp($pass_user,$pass_user2) != 0){
                $result = -3;
            } else if( $min_votes > $min_users){
                $result = -5;
            } else {
                $result = $this->model->m_createSession($name_session,$pass_user,$description,$min_votes,$min_users,$type_session);
            }

            return $result;
        }

        /**
         * Function that updates the mark of a song
         */
        public function updateMark(){
            $id_session = $_POST["id_session"];
            $id_cancion = $_POST["id_cancion"];
            $number = $_POST["number"];

            $result = $this->model->m_updateMark($id_session,$id_cancion,$number);

            return $result;
        }

        /**
         * Function that removes/deletes the first song of the playlist
         */
        function removeSong(){
            //We call deleteFirstSong() because despite of his name,
            // the function deletes the song specified by the id_session and id_cancion
            return $this->deleteFirstSong();
        }

        /**
         * REVISAR ESTA FORMA DE IMPLEMENTARLO
         */
        public function updatePlaylist(){
            $id_session = $_POST["id_session"];
            $in = $_POST["in"];

            return $this->view->v_showPlaylist($id_session,$in);
        }

        /**
         * Function that adds to the playlist of the sessions a new song
         */
        public function addToPlaylist(){
            $id_session = $_POST["id_session"];
            $title = $_POST["title"];
            $videoId = $_POST["videoId"];
            $duration = $_POST["duration"];

            return $this->model->m_addToPlaylist($id_session,$title,$videoId,$duration);
        }

        /**
         * Function that obtains the first song/video that has to be played
         */
        public function obtainFirstVideo(){
            $id_session = $_POST["id_session"];

            $result = $this->model->m_obtainFirstVideo($id_session);

            //We obtain all the playlist but we will get only the first song
            //IMPORTANT: We need to check if the playlist is empty or not
            $datos = $result->fetch_assoc();
            if ($datos["title"] == null){ //The playlist is empty
                return -1;
            } else { //The playlist has songs/videos to play
                //Obtain the videoId and the title and return them
                $arr = array('title' => $datos["title"], "videoId" => $datos["videoId"],"id_cancion" => $datos["id_cancion"]);
                $info = json_encode($arr);

                setcookie("id_cancion",$datos["id_cancion"]);

                //Insert the video in the table 'playing'
                $result2 = $this->model->m_insertSongInPlaying($id_session,$datos["id_cancion"]);
                
                if ($result2 == 1){
                    return $info;
                } else { //ERROR
                    return -3;
                   
                }
            }
        }

        /**
         * Function that deletes the first song of the playlist, the one being played
         */
        public function deleteFirstSong(){
            $id_session = $_POST["id_session"];
            $id_cancion = $_POST["id_cancion"];

            //We retire the song from the database
            $result = $this->model->m_deleteFirstSong($id_session,$id_cancion);

            return $result;
        }

        /**
         * Function that deletes/removes the song that it's being played
         */
        public function retireActualSong(){
            $id_session = $_POST["id_session"];
            
            $res = $this->model->m_obtainIdSongActual($id_session);
            $info = $res->fetch_assoc();

            if ($info["id_cancion"] != null){
                $id_cancion = $info["id_cancion"];
                return $this->model->m_deleteFirstSong($id_session,$id_cancion);
            } else {
                return -2;
            }
        }

        /**
         * Function to exit a Session
         */
        public function exitSession(){
            if (isset($_SESSION["username"])){
                return 1;
            }else {
                return -1;
            }
        }

        /**
         * Function that deletes a particular session
         */
        public function deleteSession(){
            $id_session = $_POST["id_session"];

            $result = $this->model->m_deleteSession($id_session);

            return $result;
        }

        /**
         * Function that checks if a user is an admin of a particular session or not
         */
        public function checkAdmin($id_session){
            if (isset($_SESSION["id_user"])){ //We check if the user is registered or not
                $result = $this->model->m_isAdmin($id_session,$_SESSION["id_user"]);

                $data = $result->fetch_assoc();
                if ($data["id_admin"] == null){
                    $_SESSION["admin"] = 0;
                } else {
                    $_SESSION["admin"] = 1;
                }
            } else {
                $_SESSION["admin"] = 0;
            }
            return;
        }

        /**
         * Function to follow a session (by a user)
         */
        public function followSession(){
            $id_session = $_POST["id_session"];
            $result = $this->model->m_followSession($id_session);

            return $result;
        }

        /**
         * Function to unfollow a session (by a user)
         */
        public function unfollowSession(){
            $id_session = $_POST["id_session"];
            $result = $this->model->m_unfollowSession($id_session);

            return $result;
        }

        /**
         * Function that shows the Follow Button with CSS,HTML...
         */
        public function showFollowButton(){
            $id_session = $_GET["id_session"];
            return $this->view->v_showFollowButton($id_session);
        }

        /**
         * Function to show the List of Sessions
         */
        public function showListSessions(){
            return $this->view->v_showListSessions($_POST["number"]);
        }

        /**
         * Function to show the list of Followed Session
         */
        public function showFollowedSessions(){
            return $this->view->v_showFollowedSessions($_POST["number"]);
        }

        /**
         * Function to check if the user is registered or not
         */
        public function checkRegistration(){
            if (isset($_SESSION["username"])){
                return 1;
            } else {
                return -1;
            }
        }

        /**
         * Function that checks if a particular session exists or not
         */
        public function checkSession(){
            $id_session = $_POST["id_session"];

            $result = $this->model->m_checkSession($id_session);

            $data = $result->fetch_assoc();
            if ($data["id_sesion"] == null){ //The session doesn't exist
                return -1;
            } else {
                return 1;
            }
        }

        /**
         * Function that in case a session doesn't exists shows an error message
         */
        public function showNoSession(){
            return $this->view->v_showNoSession();
        }

        /**
         * Function to show the usernames for possibles futures admins
         */
        public function searchTextAdmins(){
            $text = $_POST["text"];
            $id_session = $_POST["id_session"];

            //We check the length without spaces, because if not we will see all users
            $length = preg_match_all ('/[^ ]/' , $text, $matches);
            if ($length == 0){
                return;
            } else{
                //Search in the BBDD usernames starting with this text
                $result = $this->model->m_searchTextAdmins($text,$id_session);

                //We show the result
                $this->view->v_showSearchTextAdmins($result);
            }

            return;
        }

        /**
         * Function that add/insert new admins to a particular session
         */
        public function insertNewAdmins(){
            $array = $_POST["admins"];
            $id_session = $_POST["id_session"];

            foreach($array as $i){
                $id_user = $this->model->m_obtainIdUser($i);
                $result = $this->model->m_insertNewAdmin($id_user,$id_session);
            }
            
            return;
        }

        /**
         * Function that deletes an admin of a particular session
         */
        public function deleteAdmin(){
            $username = $_POST["username"];
            $id_session = $_POST["id_session"];

            $id_user = $this->model->m_obtainIdUser($username);
            $result = $this->model->m_deleteAdmin($id_user,$id_session);

            return;
        }

        /**
         * Function that shows the admin badge (a gold prize)
         */
        public function showAdminBadge(){
            $id_session = $_POST["id_session"];
            $in = $_POST["in"];

            return $this->view->v_showAdminBadge($id_session,$in);
        }

        /**
         * Function to update the List of Admins in the modal
         */
        public function updateAdminListModal(){
            $in = $_POST["in"];
            $id_session = $_POST["id_session"];
            
            if ($in == 1){
                $content = file_get_contents("../file_html/elem_list_modal1.html");
            } else {
                $content = file_get_contents("file_html/elem_list_modal1.html");
            }
            
            //We fill $modal1 with the list of the admins and the buttons to delete admins only if you are the AdminMaster
            $id_masteradmin = $this->model->m_obtainIdUserAdminMaster($id_session);
            $username_masteradmin = $this->model-> m_obtainUsername($id_masteradmin);

            $data_admins = $this->model->m_obtainAdmins($id_session,$id_masteradmin);

            $t1 = "<tr>
                    <td class='text-center'>
                        <div class='icon icon-success mb-2'>
                            <i class='tim-icons icon-trophy'></i>
                        </div>
                    </td>
                    <td>
                        ".$username_masteradmin."
                    </td>
                    <td>
                        <button class='btn btn-danger btn-fab btn-icon btn-sm' disabled>
                            <i class='tim-icons icon-trash-simple'></i>
                        </button>
                    </td>
                  </tr>";

            
            while($id_admin = $data_admins->fetch_assoc()){
                $username_admin = $this->model->m_obtainUsername($id_admin["id_user"]);

                $aux = str_replace("##username_admin##",$username_admin,$content);

                $t1 .= $aux;
            }

            return $t1;
        }

        /**
         * Function to check if the actual username and the new username typed 
         * by the user are equal or not
         */
        public function checkUsername(){
            $username = $_POST["username"];
            $actual_username = $_SESSION["username"];

            //Check if the usernames are equal or not
            if (strcmp($username,$actual_username) != 0){ //We have to modify the username
                $result = $this->model->m_modifyUsername($username);
            } else {
                $result = 2;
            }

            return $result;
        }

        /**
         * Function that checks if the password typed by the user is the correct one or not
         */
        public function checkActualPassword(){
            $actual_pass = $_POST["pass_actual"];
            $id_user = $_SESSION["id_user"];

            $result = $this->model->m_checkActualPassword($actual_pass,$id_user);

            return $result;
        }

        /**
         * Function that modifies the password of a particular user
         */
        public function modifyPassword(){
            $new_pass = $_POST["new_pass"];
            $id_user = $_SESSION["id_user"];

            $result = $this->model->m_modifyPassword($new_pass,$id_user);

            return $result;
        }

        /**
         * Function that modifies the description of a particular user
         */
        public function modifyDescription(){
            $description = $_POST["description"];
            $id_user = $_SESSION["id_user"];

            $result = $this->model->m_modifyDescription($description,$id_user);

            return $result;
        }

        /**
         * Function that checks if the actual name of the session and the new name
         * are equal or not. If they aren't equal, it'll change the name of the session
         */
        public function checkNameSession(){
            $new_namesession = $_POST["name_session"];
            $id_session = $_POST["id_session"];
            
            $result = $this->model->m_modifyNameSession($new_namesession,$id_session);

            return $result;
        }

        /**
         * Function that modifies the type of the session
         * Type = 1 --> Public Session
         * Type = 2 --> Private Session
         */
        public function modifyTypeSession(){
            $new_type_session = $_POST["type_session"];
            $id_session = $_POST["id_session"];

            $result = $this->model->m_modifyTypeSession($new_type_session,$id_session);

            return $result;
        }

        /**
         * Function to obtain the type of the session
         */
        public function checkTypeSession(){
            $id_session = $_POST["id_session"];

            $result = $this->model->m_obtainTypeSession($id_session);

            return $result;
        }

        /**
         * Function to know if the user is an admin or not
         */
        public function isAdmin(){
            return $_SESSION["admin"];
        }

        /**
         * Function to check if the password of the session typed by the user, 
         * it's the correct one
         */
        public function enterPasswordSession(){
            $try_pass = $_POST["pass"];
            $id_session = $_POST["id_session"];

            $result = $this->model->m_checkPasswordSession($try_pass,$id_session);

            return $result;
        }

        /**
         * Function that modifies the password of a particular session
         */
        public function modifyPasswordSession(){
            $new_pass = $_POST["new_pass"];
            $id_session = $_POST["id_session"];

            $result = $this->model->m_modifyPasswordSession($new_pass,$id_session);

            return $result;
        }

        /**
         * Function that modifies the description of a particular session
         */
        public function modifyDescriptionSession(){
            $description = $_POST["description"];
            $id_session = $_POST["id_session"];

            $result = $this->model->m_modifyDescriptionSession($description,$id_session);

            return $result;
        }

        /**
         * Function that modifies the proportion (min_votes/min_users) of a particular session
         */
        public function modifyProportion(){
            $min_votes = $_POST["min_votes"];
            $min_users = $_POST["min_users"];
            $id_session = $_POST["id_session"];

            if ($min_votes > $min_users){
                $result = 0;
            } else {
                $result = $this->model->m_modifyProportion($min_votes,$min_users,$id_session);
            }

            return $result;
        }

    }

?>