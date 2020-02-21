<?php

    class Vista{

        private $model;

        public function __construct($model) {
            $this->model = $model;
        }

        /**
         * Function that shows in a paragraph the username of the current session
         */
        public function v_showUsername(){
            if (isset($_SESSION["username"])){
                $result = $_SESSION["username"];
            } else {
                $result = "Guest";
            }
            echo $result;
        }

        public function v_showButtonUsernameGuest(){
            if (isset($_SESSION["username"])){
                $result = $_SESSION["username"];
            } else {
                $result = "Guest";
            }
            $content = "<button class='btn btn-info btn-sm' type='button' id='button_username'>        
                            <i class='tim-icons icon-single-02'></i>
                            ".$result."
                        </button>";

            echo $content;
        }

        public function v_showListSessions($number){
            $res = $this->model->m_obtainListSessions();
            
            $result = "<div class='row'>";
            $i = 0;

            $y = 0;
            while($datos = $res->fetch_assoc()) {
                $i++;
                if ($y < 3){
                    $y++;
                } else {
                    $y = 0;
                    $result .= "</div><div class='row'>";
                }    

                $rand = rand(0,2);
                if ($rand == 0){ //We get elem_pink.html
                    if($number == 1){
                        $content = file_get_contents("./file_html/elem_pink.html");
                    } else {
                        $content = file_get_contents("../file_html/elem_pink.html");
                    }
                } else if ($rand == 1){ //We get elem_green.html
                    if ($number == 1){
                        $content = file_get_contents("./file_html/elem_green.html");
                    } else {
                        $content = file_get_contents("../file_html/elem_green.html");
                    }
                } else { //We get elem_blue.html
                    if ($number == 1){
                        $content = file_get_contents("./file_html/elem_green.html");
                    } else{
                        $content = file_get_contents("../file_html/elem_blue.html");
                    }
                }
                $content = str_replace("##name_session##", $datos["nombre_sesion"], $content);
                $content = str_replace("##id_session##", $datos["id_sesion"], $content);
                $result .= $content;                    
            }
            if ($i == 0){
                $result = "No sessions to display";
            } else {
                $result .= "</div>";
            }
            
            echo $result;
        }
        
        public function v_showPlaylist($id_session,$in){
            $res1 = $this->model->m_obtainIdSongActual($id_session);

            $info1 = $res1->fetch_assoc();

            if ($info1["id_cancion"] == null){
                $id_cancion_actual = -1;
            } else {
                $id_cancion_actual = $info1["id_cancion"];
            }

            $res = $this->model->m_obtainPlaylist($id_session,$id_cancion_actual);

            if (isset($_SESSION["admin"])){
                $admin = $_SESSION["admin"];
            } else {
                $admin = 0;
            }

            if ($admin == 1){
                if ($in == 1){
                    $template = file_get_contents("../file_html/playlist_admin.html");
                } else {
                    $template = file_get_contents("file_html/playlist_admin.html");
                }
            } else {
                if ($in == 1){
                    $template = file_get_contents("../file_html/playlist_noadmin.html");
                } else {
                    $template = file_get_contents("file_html/playlist_noadmin.html");
                }
            }

            $result = "";
            $i = 0;
            //$datos = $res->fetch_assoc(); //Salto 1 resultado para no mostrar la 1º Canción
            //echo implode($datos);
            while($datos = $res->fetch_assoc()) {
                
                $i++;
                $content = $template;

                $content = str_replace("##number##",$i,$content);
                $content = str_replace("##title##",$datos["title"],$content);
                $content = str_replace("##duration##",$datos["duration"],$content);
                $content = str_replace("##mark##",$datos["mark"],$content);
                $content = str_replace("##id_cancion##",$datos["id_cancion"],$content);

                //We check if the user has liked or disliked the song, or neither
                if (isset($_SESSION["id_user"])){
                    $a = $this->model->m_checkVote($datos["id_cancion"],$_SESSION["id_user"],$id_session);
                    $b = $a->fetch_assoc();

                    if ($b["vote"] == null){
                        $content = str_replace("##disabledadd##","",$content);
                        $content = str_replace("##disabledsub##","",$content);
                    } else {
                        if ($b["vote"] == 1){
                            $content = str_replace("##disabledadd##","disabled",$content);
                            $content = str_replace("##disabledsub##","",$content);
                        } else {
                            $content = str_replace("##disabledadd##","",$content);
                            $content = str_replace("##disabledsub##","disabled",$content);
                        }
                    }
                } else {
                    $content = str_replace("##disabledadd##","",$content);
                    $content = str_replace("##disabledsub##","",$content);
                }
                $result .= $content;
            }
            if ($i == 0){
                $result = "";
            }
            echo $result;
        }

        /**
         * Function that if the user is registered or not will show the button of Sign Out or not
         */
        public function v_showButtonSignOut(){
            if (isset($_SESSION["username"])){
                $result = "<li class='nav-item p-0'>
                            <button class='btn btn-success btn-sm' type='button' onclick='closeSession()'>Sign Out</button>
                          </li>";
            } else {
                $result = "<li class='nav-item p-0'>
                            <button class='btn btn-success btn-sm' type='button' onclick='toRegister()'>Register/Sign In</button>
                           </li>";
            }
            echo $result;
        }

        public function v_showNameSession(){
            $id_session =  $_GET["id_session"];

            $result = $this->model->m_obtainNameSession($id_session);
            $datos = $result->fetch_assoc();

            echo $datos["nombre_sesion"];
        }

        public function v_showNavbarSession($id_session,$in){
            if (isset($_SESSION["admin"])){
                $admin = $_SESSION["admin"];
            } else {
                $admin = 0;
            }

            if ($admin == 1){
                $button1 = "<button class='btn btn-info btn-sm' data-toggle='modal' data-target='#myModal1'>
                            Show Admins
                            </button> ";
                if ($in == 1){
                    $modal1 = file_get_contents("../file_html/modal1.html");
                    $modal2 = file_get_contents("../file_html/modal2.html");
                    $modal3 = file_get_contents("../file_html/modal3.html");
                    $content = file_get_contents("../file_html/elem_list_modal1.html");
                    $navbar = file_get_contents("../file_html/navbar_video_admin.html");
                } else {
                    $modal1 = file_get_contents("file_html/modal1.html");
                    $modal2 = file_get_contents("file_html/modal2.html");
                    $modal3 = file_get_contents("file_html/modal3.html");
                    $content = file_get_contents("file_html/elem_list_modal1.html");
                    $navbar = file_get_contents("file_html/navbar_video_admin.html");
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
                        <td class='text-right'>
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

                $modal1 = str_replace("##list##",$t1,$modal1);

                //We fill Modal3 => Session settings

                //We show the name of the session
                $namesession = (($this->model->m_obtainNameSession($id_session))->fetch_assoc())["nombre_sesion"];
                $modal3 = str_replace("##namesession##",$namesession,$modal3);

                //We show the type of session
                $typesession = $this->model->m_obtainTypeSession($id_session);
                if ($typesession == 1){
                    $modal3 = str_replace("##checked1##","checked",$modal3);
                    $modal3 = str_replace("##checked2##","",$modal3);
                } else {
                    $modal3 = str_replace("##checked1##","",$modal3);
                    $modal3 = str_replace("##checked2##","checked",$modal3);
                }

                $min_votes = $this->model->m_obtainMinVotes($id_session);
                $min_users = $this->model->m_obtainMinUsers($id_session);
                $modal3 = str_replace("##min_votes##",$min_votes,$modal3);
                $modal3 = str_replace("##min_users##",$min_users,$modal3);

                $description_session = $this->model->m_obtainDescriptionSession($id_session);
                $modal3 = str_replace("##description_session##",$description_session,$modal3);
               
                $navbar = str_replace("##modal1##",$modal1,$navbar);
                $navbar = str_replace("##modal2##",$modal2,$navbar);
                $navbar = str_replace("##modal3##",$modal3,$navbar);

            } else { //User is not admin of the session
                if($in == 1){
                    $navbar = file_get_contents("../file_html/navbar_video_noadmin.html");
                } else {
                    $navbar = file_get_contents("../file_html/navbar_video_noadmin.html");
                }
                
            }
            //FOLLOW BUTTON
            //Check if the user is registered
            if (isset($_SESSION["username"])){
                $result = $this->model->m_isFollowingSession($id_session);

                $data = $result->fetch_assoc();

                if ($data["id_follow"] == null){
                    $follow = "<a class='nav-link' onclick='followSession(0)'><i class='tim-icons icon-bell-55'></i>Follow</a>";
                    $navbar = str_replace("##follow##",$follow,$navbar);
                } else {
                    $follow = "<a class='nav-link' onclick='followSession(1)'><i class='tim-icons icon-bell-55'></i>Unfollow</a>";
                    $navbar = str_replace("##follow##",$follow,$navbar);
                }
            } else {
                $follow = "<a class='nav-link' onclick='followSession(-1)'><i class='tim-icons icon-bell-55'></i>Follow</a>";
                $navbar = str_replace("##follow##",$follow,$navbar);
            }
            echo $navbar;
        }

        public function v_showFollowButton($id_session){
            //FOLLOW BUTTON
            //Check if the user is registered
            if (isset($_SESSION["username"])){
                $result = $this->model->m_isFollowingSession($id_session);

                $data = $result->fetch_assoc();

                if ($data["id_follow"] == null){
                    $follow = "<a class='nav-link' onclick='followSession(0)'><i class='tim-icons icon-bell-55'></i>Follow</a>";
                } else {
                    $follow = "<a class='nav-link' onclick='followSession(1)'><i class='tim-icons icon-bell-55'></i>Unfollow</a>";
                }
            } else {
                $follow = "<a class='nav-link' onclick='followSession(-1)'><i class='tim-icons icon-bell-55'></i>Follow</a>";
            }
            echo $follow;            
        }

        public function v_showFollowedSessions($number){
            $res = $this->model->m_obtainFollowedSessions();
            
            $result = "<div class='row'>";
            $i = 0;

            $y = 0;
            while($datos = $res->fetch_assoc()) {
                $i++;
                if ($y < 3){
                    $y++;
                } else {
                    $y = 0;
                    $result .= "</div><div class='row'>";
                }    

                $rand = rand(0,2);
                if ($rand == 0){ //We get fw_pink.html
                    if($number == 1){
                        $content = file_get_contents("./file_html/fw_pink.html");
                    } else {
                        $content = file_get_contents("../file_html/fw_pink.html");
                    }
                } else if ($rand == 1){ //We get fw_green.html
                    if ($number == 1){
                        $content = file_get_contents("./file_html/fw_green.html");
                    } else {
                        $content = file_get_contents("../file_html/fw_green.html");
                    }
                } else { //We get fw_blue.html
                    if ($number == 1){
                        $content = file_get_contents("./file_html/fw_blue.html");
                    } else {
                        $content = file_get_contents("../file_html/fw_blue.html");
                    }
                }
                $content = str_replace("##name_session##", $datos["nombre_sesion"], $content);
                $content = str_replace("##id_session##", $datos["id_sesion"], $content);
                $result .= $content;                    
            }
            if ($i == 0){
                $result = "No followed sessions";
            } else {
                $result .= "</div>";
            }
            
            echo $result;            
        }

        public function v_showNoSession(){
            $content = file_get_contents("./file_html/no_session.html");

            echo $content;
        }

        public function v_showSearchTextAdmins($bbdd){
            $result = "<div class='text-left' id='checkbox'>";
            $i = 0;

            while($datos = $bbdd->fetch_assoc()) {
                $i++;

                $content = "<div class='form-check'>
                                <label class='form-check-label'>
                                    <input class='form-check-input' type='checkbox' name='". $datos["username"] ."' value='". $datos["username"] ."' >
                                    ". $datos["username"] ."
                                    <span class='form-check-sign'>
                                        <span class='check'></span>
                                    </span>
                                </label>
                            </div>";

                $result .= $content;
            }

            if ($i == 0){
                $result = "Nothing founded";
            } else {
                $result .= "</div>";
            }

            echo $result;
        }

        public function v_showDescriptionUser(){
            $username = $_SESSION["username"];
            $description = $this->model->m_obtainDescriptionUser($username);

            echo $description;
        }

        public function v_showInfoSessionsUser(){
            $id_user = $_SESSION["id_user"];

            $info = $this->model->m_obtainInfoSessionsUser($id_user);
            $rows = "";

            while($datos = $info->fetch_assoc()) {

                $content = "<tr>
                                <td> ". $datos["nombre_sesion"]."</td>
                                <td class='text-right'>". $this->model->m_obtainFollowersSession($datos["id_session"]) ."</td>
                                <td class='text-right'>". $datos["NumberAdmins"] ."</td>
                            </tr>";
                $rows .= $content;
            }

            echo $rows;
        }

        public function v_showActiveSessions(){
            $id_user = $_SESSION["id_user"];

            $info = $this->model->m_obtainInfoSessionsUser($id_user);

            $rows = "";

            while($datos = $info->fetch_assoc()) {

                $active = $this->model->m_isActiveSession($datos["id_session"]);
                if ($active == 1){
                    $content = "<tr>
                                    <td>". $datos["nombre_sesion"] ."</td>
                                </tr>";
                    $rows .= $content;
                }
            }

            if(strcmp($rows,"") == 0){
                $rows = "<tr>
                            <td>No sessions active right now</td>
                        </tr>";
            }

            echo $rows;
        }

        public function v_showSpacePassSession(){
            $content = file_get_contents("../file_html/space_pass_session.html");

            echo $content;
        }

    }
?>