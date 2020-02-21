<?php
    class Modelo{

        /**
         * Información para conectarse a la BBDD
         */
        /*private $con;
        private $dbHost = "localhost";
        private $dbUser = "root";
        private $dbPass = "tfg";
        private $dbName = "tfg";*/
        private $dbHost = "tfgkirtashdb.cdynp72jpqch.us-east-1.rds.amazonaws.com";
        private $dbUser = "masterUsername";
        private $dbPass = "kirtashtfgbbdd";
        private $dbName = "dbkirtash";

        //heroku config:set DATABASE_URL="mysql2://masterUsername:kirtashtfgbbdd@tfgkirtashdb.cdynp72jpqch.us-east-1.rds.amazonaws.com/dbkirtash?sslca=config/amazon-rds-ca-cert.pem" -a <app_id>
        /**
         * Constructor del modelo
         */
        public function __construct(){
            if($this->con==false){
                $this->con = mysqli_connect($this->dbHost,$this->dbUser,$this->dbPass) or die('Error conectando la base de datos');
                mysqli_select_db($this->con,$this->dbName) or die('Error accediendo a la base de datos');
            }
        }        

        /**
         * This function saves information about the user in the webpage not in the database
         */
        function m_registrarusuario($username, $pass_user) {
            $_SESSION["username"] = $username;
            $_SESSION["pass_user"] = $pass_user;

            $bd = $this->con;
            $consulta = "SELECT id_user FROM users WHERE username='$username'";
            
            $resultado = $bd->query($consulta);
            $datos = $resultado->fetch_assoc();
            $_SESSION["id_user"] = $datos["id_user"];
        }

        /**
         * 
         * Returns:
         * 1 -> If everything is correct
         * -1 -> If something is not correct
         * -2 -> Username is already used
         */
        function m_signup($username,$pass_user){
            $bd = $this->con;

            //We are going to save the password in MD5 in the database
            $pass = md5($pass_user);

            //We check if the username is already used
            $consulta ="SELECT COUNT(username) AS username_exists FROM users WHERE username='$username'";
            if ($resultado = $bd->query($consulta)){
                if ($datos = $resultado->fetch_assoc()) {
                    if ($datos["username_exists"] > 0 ){
                        return -2;
                    }
                }
            } else{
                return -1;
            }

            $consulta = "INSERT INTO users (username,pass_user) VALUES('$username','$pass')";

            if ($bd->query($consulta) === TRUE) {
                $this->m_registrarusuario($username, $pass_user);
                return 1;
            } else {
                return -1;
            }
        }

        function m_signin($username,$pass_user){
            $bd = $this->con;

            $consulta = "SELECT * FROM users WHERE username = '$username'";

            if ($resultado = $bd->query($consulta))  {
                if ($datos = $resultado->fetch_assoc()) {
                    if ($datos["pass_user"] == md5($pass_user)) {
                        $this->m_registrarusuario($username, $pass_user);
                        return 1;
                    } else {
                        return -1;
                    }
                } else {
                    return -1;
                }
            } else {
                return -1;
            }
        }

        /**
         * Function to close session
         */
        function m_close_session(){
            session_destroy();
        }

        /**
         * Function to obtain all the sessions of the user
         */
        function m_obtainListSessions(){
            $bd = $this->con;

            $consult = "SELECT DISTINCT id_sesion,nombre_sesion
                        FROM sesion 
                        INNER JOIN users
                        ON sesion.id_user =" .$_SESSION["id_user"];

            return $bd->query($consult);
        }

        /**
         * Function to create a new session in the database
         */
        function m_createSession($name_session,$pass_user,$description,$min_votes,$min_users,$type_session){
            $bd = $this->con;

            $pass = md5($pass_user);
            $query = "INSERT INTO sesion (id_user,nombre_sesion,pass_sesion,description_session,type_session,min_votes,min_users)
                        VALUES (".$_SESSION["id_user"].",'$name_session','$pass','$description','$type_session','$min_votes','$min_users')";

            if ($bd->query($query) === TRUE) {
                $last_id = $bd->insert_id;
                $query2 = "INSERT INTO admins (id_user,id_session)
                        VALUES (".$_SESSION["id_user"].",".$last_id.")";
                if($bd->query($query2) === TRUE){
                    return 1;
                }   
            } else {
                return -4;
            }
        }

        function m_obtainPlaylist($id_session,$id_cancion_actual){
            $bd = $this->con;
           
            $consulta = "SELECT * 
                      FROM lista_reproduccion 
                      WHERE id_sesion = '$id_session' AND id_cancion != '$id_cancion_actual'
                      ORDER BY mark DESC";

            return $bd->query($consulta);
        }

        function m_obtainIdSongActual($id_session){
            $bd = $this->con;
            //Obtain id of the song being played
            $query = "SELECT id_cancion
                        FROM playing
                        WHERE id_session = '$id_session'";

            return $bd->query($query);
        }

        function m_obtainFirstVideo($id_session){
            $bd = $this->con;

            //First, we check if we are playing a video or not
            $query = "SELECT id_cancion
            FROM playing
            WHERE id_session='$id_session'";

            $result = ($bd->query($query))->fetch_assoc();

            if ($result["id_cancion"] == null){ //No video is being played
                //We obtain all the playlist
                $query2 = "SELECT * 
                            FROM lista_reproduccion 
                            WHERE id_sesion = '$id_session'
                            ORDER BY mark DESC";
                return $bd->query($query2);
            } else {
                //We obtain the video is being played from $result["id_cancion"]
                $query3 = "SELECT *
                            FROM lista_reproduccion
                            WHERE id_sesion = '$id_session' AND id_cancion=".$result["id_cancion"];
                return $bd->query($query3);
            }
        }

        function m_insertSongInPlaying($id_session,$id_cancion){
            //First we have to check if the song we receive it's already inserted in 'playing' or not
            $bd = $this->con;

            $query = "SELECT id_playing
                        FROM playing
                        WHERE id_session = '$id_session' AND id_cancion = '$id_cancion'";
            
            
            $result = ($bd->query($query))->fetch_assoc();

            if ($result["id_playing"] == null){ //It's not inserted, so we insert it
                $query2 = "INSERT INTO playing (id_session,id_cancion)
                            VALUES ('$id_session','$id_cancion')";

                if ($bd->query($query2) === TRUE) {
                    return 1;
                } else { //ERROR
                    return -4;
                }
            } else {  //If it's inserted, we continue the execution
                return 1;
            }
        }

        function m_updateMark($id_session,$id_cancion,$number){
            $bd = $this->con;

            //First we store the vote in the database OR we update the vote
            $query = "SELECT id_like
                      FROM likes
                      WHERE id_session = '$id_session' AND
                            id_user = ".$_SESSION["id_user"]." AND
                            id_cancion = '$id_cancion'";

            $result = ($bd->query($query))->fetch_assoc();

            if ($result["id_like"] == null){ //The user has never voted to this song before
                $query = "INSERT INTO likes (id_session,id_user,id_cancion,vote)
                        VALUES ('$id_session',".$_SESSION["id_user"].",'$id_cancion',$number)";
            } else {
                $query = "UPDATE likes
                          SET vote = '$number'
                          WHERE id_like = ".$result["id_like"];
            }   

            if ($bd->query($query) === TRUE){ //Once we have stored the vote we update the mark in lista_reproduccion
                //We obtain the mark stored in the database
                $consulta = "SELECT mark
                                FROM lista_reproduccion
                                WHERE id_cancion = '$id_cancion'";
   
                $mark = ($bd->query($consulta))->fetch_assoc()["mark"];

                $new_mark = $mark + $number;

                $update_consulta = "UPDATE lista_reproduccion
                                SET mark = '$new_mark'
                                WHERE id_cancion = '$id_cancion'";

                if ($bd->query($update_consulta) === TRUE) {
                    return 1;
                } else {
                    return -1;
                }
            } else {
                return -1;
            }
        }

        function m_checkVote($id_cancion,$id_user,$id_session){
            $bd = $this->con;

            $query = "SELECT vote
                      FROM likes
                      WHERE id_session = '$id_session' AND 
                            id_user = '$id_user' AND
                            id_cancion = '$id_cancion'";
            
            return $bd->query($query);
        }

        function m_addToPlaylist($id_session,$title,$videoId,$duration){
            $bd = $this->con;

            $query = "INSERT INTO lista_reproduccion (id_sesion,title,videoId,duration)
                      VALUES ('$id_session','$title','$videoId','$duration')";
            
            if ($bd->query($query) === TRUE) {
                return 1;
                
            } else {
                return -1;
            }
        }

        function m_deleteFirstSong($id_session,$id_cancion){
            $bd = $this->con;

            $query = "DELETE
                      FROM lista_reproduccion
                      WHERE id_sesion ='$id_session' AND id_cancion = '$id_cancion'";
            
            setcookie("id_cancion",""); //AÑADIDO CON RETIREACTUALVIDEO()

            if ($bd->query($query) === TRUE) {
                return 1;
            } else {
                return -1;
            }
        }

        function m_deleteSession($id_session){
            $bd = $this->con;
            $query = "DELETE
                      FROM sesion
                      WHERE id_sesion = '$id_session'";

            if ($bd->query($query) === TRUE) {
                return 1;
            } else {
                return -1;
            }
        }

        function m_obtainNameSession($id_session){
            $bd = $this->con;

            $query = "SELECT nombre_sesion
                      FROM sesion
                      WHERE id_sesion = '$id_session'";
            
            return $bd->query($query);
        }

        function m_isAdmin($id_session,$id_user){
            $bd = $this->con;

            $query = "SELECT id_admin
                      FROM admins
                      WHERE id_user = '$id_user' AND id_session = '$id_session'";

            return $bd->query($query);
        }

        function m_isFollowingSession($id_session){
            $id_user = $_SESSION["id_user"];
            $bd = $this->con;

            $query = "SELECT id_follow
                      FROM follows
                      WHERE id_user='$id_user' AND id_session='$id_session'";

            return $bd->query($query);
        }

        function m_followSession($id_session){
            $id_user = $_SESSION["id_user"];
            $bd = $this->con;

            $query = "INSERT INTO follows(id_session,id_user)
                        VALUES ('$id_session','$id_user')";

            if ($bd->query($query) === TRUE) {
                return 1;
            } else {
                return -1;
            }
        }

        function m_unfollowSession($id_session){
            $id_user = $_SESSION["id_user"];
            $bd = $this->con;
                      
            $query = "DELETE
                      FROM follows
                      WHERE id_session='$id_session' AND id_user='$id_user'";

            if ($bd->query($query) === TRUE) {
                return 1;
            } else {
                return -1;
            }
        }

        function m_obtainFollowedSessions(){
            $id_user = $_SESSION["id_user"];
            $bd = $this->con;

            $query = "SELECT nombre_sesion,id_sesion
                      FROM sesion
                      INNER JOIN follows
                      WHERE follows.id_user = '$id_user' AND sesion.id_sesion = follows.id_session";

            return $bd->query($query);
        }

        function m_checkSession($id_session){
            $bd = $this->con;

            $query = "SELECT id_sesion
                      FROM sesion
                      WHERE id_sesion = '$id_session'";

            return $bd->query($query);
        }

        /**
         * We get all the usernames starting with this text and different to the user is calling
         */
        function m_searchTextAdmins($text,$id_session){
            $bd = $this->con;

            $username = $_SESSION["username"];

            $query = "SELECT username
                      FROM users u 
                      WHERE username LIKE '$text%' AND 
                            username != '$username' AND
                            id_user NOT IN (
                                SELECT id_user
                                FROM admins
                                WHERE id_session = '$id_session')";

            return $bd->query($query);         
        }

        function m_insertNewAdmin($id_user,$id_session){
            $bd = $this->con;

            $query = "INSERT INTO admins(id_user,id_session)
                      VALUES ('$id_user','$id_session')";

            if ($bd->query($query) === TRUE) {
                return 1;
            } else {
                return -1;
            }
        }

        function m_obtainIdUser($username){
            $bd = $this->con;

            $query = "SELECT id_user
                      FROM users
                      WHERE username = '$username'";

            return ($bd->query($query)->fetch_assoc())["id_user"];
        }

        function m_obtainUsername($id_user){
            $bd = $this->con;

            $query = "SELECT username
                      FROM users
                      WHERE id_user = '$id_user'";

            return ($bd->query($query)->fetch_assoc())["username"];
        }

        /**
         * Returns the id_user of the AdminMaster
         */
        function m_obtainIdUserAdminMaster($id_session){
            $bd = $this->con;

            $query = "SELECT a.id_user
                      FROM sesion s 
                      INNER JOIN admins a
                      WHERE s.id_sesion = '$id_session' AND 
                            a.id_session = '$id_session' AND 
                            s.id_user = a.id_user ";
            
            return ($bd->query($query)->fetch_assoc())["id_user"];
        }


        function m_obtainAdmins($id_session,$id_masteradmin){
            $bd = $this->con;

            $query = "SELECT id_user
                      FROM admins
                      WHERE id_session = '$id_session' AND id_user != '$id_masteradmin'";

            return $bd->query($query);  
        }

        function m_deleteAdmin($id_user,$id_session){
            $bd = $this->con;

            $query = "DELETE 
                      FROM admins
                      WHERE id_user = '$id_user' AND id_session = '$id_session'";

            if ($bd->query($query) === TRUE) {
                return 1;
            } else {
                return -1;
            }
        }

        function m_obtainDescriptionUser($username){
            $bd = $this->con;

            $query = "SELECT description_user
                      FROM users
                      WHERE username='$username'";

            return  ($bd->query($query)->fetch_assoc())["description_user"];          
        }

        function m_obtainInfoSessionsUser($id_user){
            $bd = $this->con;

            $query = "SELECT DISTINCT sesion.id_sesion AS id_session, sesion.nombre_sesion as nombre_sesion,COUNT(admins.id_session) AS NumberAdmins
                      FROM sesion 
                      INNER JOIN admins ON sesion.id_sesion = admins.id_session AND sesion.id_user = '$id_user'
                      GROUP BY sesion.id_sesion";

            return $bd->query($query);    
        }

        function m_obtainFollowersSession($id_session){
            $bd = $this->con;

            $query = "SELECT COUNT(id_follow) AS NumberFollowers
                      FROM follows
                      WHERE id_session = '$id_session'";

            return  ($bd->query($query)->fetch_assoc())["NumberFollowers"];  
        }

        function m_isActiveSession($id_session){
            $bd = $this->con;

            $query = "SELECT id_playing
                      FROM playing
                      WHERE id_session = '$id_session'";

            if( ($bd->query($query)->fetch_assoc())["id_playing"]  == null ){
                return 0;
            } else {
                return 1;
            }
        }

        function m_modifyUsername($username){
            $bd = $this->con;

            $id_user = $_SESSION["id_user"];

            $query = "UPDATE users
                      SET username = '$username' 
                      WHERE id_user = '$id_user'";

            $_SESSION["username"] = $username;

            if ($bd->query($query) === TRUE) {
                return 1;
            } else {
                return -1;
            }
        }

        function m_checkActualPassword($actual_pass,$id_user){
            $bd = $this->con;

            $pass = md5($actual_pass);

            $query = "SELECT username
                      FROM users
                      WHERE id_user = '$id_user' AND pass_user = '$pass'";

            if( ($bd->query($query)->fetch_assoc())["username"]  == null ){
                return 0;
            } else {
                return 1;
            }
        }

        function m_modifyPassword($new_pass,$id_user){
            $bd = $this->con;

            $pass = md5($new_pass);

            $query = "UPDATE users
                      SET pass_user = '$pass' 
                      WHERE id_user = '$id_user'";

            if ($bd->query($query) === TRUE) {
                return 1;
            } else {
                return -1;
            }
        }

        function m_modifyDescription($new_description,$id_user){
            $bd = $this->con;

            $query = "SELECT description_user
                      FROM users
                      WHERE id_user = '$id_user'";

            $actual_description = ($bd->query($query)->fetch_assoc())["description_user"];
            
            if( strcmp($new_description,$actual_description) == 0){
                return 1;
            } else { //We modify the description
                $query2 = "UPDATE users
                           SET description_user = '$new_description'
                           WHERE id_user = '$id_user'";

                 if ($bd->query($query2) === TRUE) {
                    return 2;
                } else {
                    return -1;
                }
            }
        }

        function m_modifyNameSession($new_namesession,$id_session){
            $bd = $this->con;

            $query = "SELECT nombre_sesion
                      FROM sesion
                      WHERE id_sesion = '$id_session'";

            $actual_name_session = ($bd->query($query)->fetch_assoc())["nombre_sesion"];

            if( strcmp($new_namesession,$actual_name_session) == 0){
                return 1;
            } else { //We modify the description
                $query2 = "UPDATE sesion
                           SET nombre_sesion = '$new_namesession'
                           WHERE id_sesion = '$id_session'";

                 if ($bd->query($query2) === TRUE) {
                    return 2;
                } else {
                    return -1;
                }
            }            
        }

        function m_modifyTypeSession($new_type_session,$id_session){
            $bd = $this->con;

            $query = "SELECT type_session
                      FROM sesion
                      WHERE id_sesion = '$id_session'";

            $actual_type_session = ($bd->query($query)->fetch_assoc())["type_session"];      
            
            if( strcmp($new_type_session,$actual_type_session) == 0){
                return 1;
            } else { //We modify the description
                $query2 = "UPDATE sesion
                           SET type_session = '$new_type_session'
                           WHERE id_sesion = '$id_session'";

                 if ($bd->query($query2) === TRUE) {
                    return 2;
                } else {
                    return -1;
                }
            }    
        }

        function m_obtainTypeSession($id_session){
            $bd = $this->con;

            $query = "SELECT type_session
                      FROM sesion
                      WHERE id_sesion = '$id_session'";

            return  ($bd->query($query)->fetch_assoc())["type_session"];              
        }

        function m_checkPasswordSession($try_pass,$id_session){
            $bd = $this->con;

            $pass = md5($try_pass);

            $query = "SELECT nombre_sesion
                      FROM sesion
                      WHERE id_sesion ='$id_session' AND pass_sesion = '$pass'";

            if (($bd->query($query)->fetch_assoc())["nombre_sesion"]  == null){
                return -1;
            } else {
                return 1;
            }
        }

        function m_obtainMinVotes($id_session){
            $bd = $this->con;

            $query = "SELECT min_votes
                      FROM sesion
                      WHERE id_sesion = '$id_session'";

            return  ($bd->query($query)->fetch_assoc())["min_votes"];       
        }

        function m_obtainMinUsers($id_session){
            $bd = $this->con;

            $query = "SELECT min_users
                      FROM sesion
                      WHERE id_sesion = '$id_session'";

            return  ($bd->query($query)->fetch_assoc())["min_users"];       
        }

        function m_modifyPasswordSession($new_pass,$id_session){
            $bd = $this->con;

            $pass = md5($new_pass);

            $query = "UPDATE sesion
                        SET pass_sesion = '$pass'
                        WHERE id_sesion = '$id_session'";
                
            if ($bd->query($query) === TRUE) {
                return 1;
            } else {
                return 0;
            }
        }

        function m_obtainDescriptionSession($id_session){
            $bd = $this->con;

            $query = "SELECT description_session
                      FROM sesion
                      WHERE id_sesion = '$id_session'";

            return  ($bd->query($query)->fetch_assoc())["description_session"];   
        }

        function m_modifyDescriptionSession($description,$id_session){
            $bd = $this->con;

            $query = "UPDATE sesion
                        SET description_session = '$description'
                        WHERE id_sesion = '$id_session'";

            if ($bd->query($query) === TRUE) {
                return 1;
            } else {
                return -1;
            }
        }

        function m_modifyProportion($min_votes,$min_users,$id_session){
            $bd = $this->con;

            $query = "UPDATE sesion
                        SET min_votes = '$min_votes',min_users = '$min_users'
                        WHERE id_sesion = '$id_session'";

            if ($bd->query($query) === TRUE) {
                return 1;
            } else {
                return -1;
            }
        }

    }

?>