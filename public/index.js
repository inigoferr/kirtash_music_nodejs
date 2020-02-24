var express = require('express');
var router = express.Router();
var app = express();
var server = require('http').Server(app);

const path = require('path');
const session = require('express-session');
let fs = require('fs');

//Session User
router.use(session({
  secret: 'ssshhhhh',
  saveUninitialized: true,
  resave: true
}));    
/*************/

router.post('/checksignup',function(req,res,next){
  sign_up(req.body.username,req.body.pass_user,req.body.pass_user2,req,function(result){
    answer = {"result" : result};
    res.send(answer);
  });
});

router.post('/checksignin',function(req,res,next){
  sign_in(req.body.username,req.body.pass_user,req,function(result){
    answer = {"result" : result};
    res.send(answer);
  });
});

router.post('/create_session',function(req,res,next){
    create_session(req.body.name_session,req.body.pass_session,req.body.pass_session2,req.body.description,req.body.min_votes,req.body.min_users,req.body.type_session,req,function(result){
            answer = {"result":result};
            res.send(answer);
    });
});

router.post('/close_session',function(req,res,next){
    close_session(req,function(result){
        res.send({"result":1});
    });   
});

router.post('/deletesession',function(req,res,next){
    deleteSession(req.body.id_session,function(result){
        res.send({"result":result});
    });
});

router.post('/unfollowSession',function(req,res,next){
    unfollowSession(req.body.id_session,req,function(result){
        res.send({"result":result});
    })
});

router.post('/searchTextAdmins',function(req,res,next){
    searchTextAdmins(req.body.text,req.body.id_session,req,function(result){
        res.send(result);
    });
});

router.post('/insertNewAdmin',function(req,res,next){
    insertNewAdmins(req.body.admin,req.body.id_session,function(result){
        res.send({"result":1});
    });
});

router.post('/deleteAdmin',function(req,res,next){
    deleteAdmin(req.body.username,req.body.id_session,function(result){
        res.send({"result":result});
    });
});

router.post('/checkUsername',function(req,res,next){
    checkUsername(req.body.username,req,function(result){
        res.send({"result":result});
    });
});

router.post('/checkActualPassword',function(req,res,next){
    checkActualPassword(req.body.pass_actual,req,function(result){
        res.send({"result": result});
    });
});

router.post('/modifyPassword',function(req,res,next){
    modifyPassword(req.body.new_pass,req,function(result){
        res.send({"result":result});
    })
});

router.post('/modifyDescription',function(req,res,next){
    modifyDescription(req.body.description,req,function(result){
        res.send({"result":result});
    });
});

router.post('/checkNameSession',function(req,res,next){
    checkNameSession(req.body.name_session,req.body.id_session,function(result){
        res.send({"result":result});
    });
});

router.post('/enterPasswordSession',function(req,res,next){
    enterPasswordSession(req.body.pass,req.body.id_session,function(result){
        res.send({"result":result});
    });
});

router.post('/modifyPasswordSession',function(req,res,next){
    modifyPasswordSession(req.body.new_pass,req.body.id_session,function(result){
        res.send({"result":result});
    });
});

router.post('/modifyDescriptionSession',function(req,res,next){
    modifyDescriptionSession(req.body.description,req.body.id_session,function(result){
        res.send({"result":result});
    });
});

router.post('/modifyTypeSession',function(req,res,next){
    modifyTypeSession(req.body.type_session,req.body.id_session,function(result){
        res.send({"result":result});
    });
});

router.post('/modifyProportion',function(req,res,next){
    modifyProportion(req.body.min_votes,req.body.min_users,req.body.id_session,function(result){
        res.send({"result":result});
    });
});

router.post('/enterPasswordSession',function(req,res,next){
    enterPasswordSession(req.body.pass,req.body.id_session,function(result){
        res.send({"result":result});
    });
});

router.post('/addToPlaylist',function(req,res,next){
    addToPlaylist(req.body.id_session,req.body.title,req.body.videoId,req.body.duration,function(result){
        res.send({"result":result});
    });
});

router.post('/checkregistration',function(req,res,next){
    if(req.session.username == undefined){
        res.send({"result":0});
    } else {
        res.send({"result":1});
    }
});

router.post('/updateMark',function(req,res,next){
    updateMark(req.body.id_session,req.body.id_cancion,req.body.number,req,function(result){
        res.send({"result":result});
    });
});

router.post('/removeSong',function(req,res,next){
    removeSong(req.body.id_session,req.body.id_cancion,function(result){
        res.send({"result":result});
    });
});

router.post('/updatePlaylist',function(req,res,next){
    updatePlaylist(req.body.id_session,req,function(result){
        res.send(result);
    });
});

router.post('/exitSession',function(req,res,next){
    exitSession(req,function(result){
        res.send({"result":result});
    });
});

router.post('/followSession',function(req,res,next){
    followSession(req.body.id_session,req,function(result){
        res.send({"result" : result});
    });
});

router.post('/showFollowButton',function(req,res,next){
    showFollowButton(req.body.id_session,req,function(result){
        res.send(result);
    });
});

router.post('/checkSession',function(req,res,next){
    checkSession(req.body.id_session,function(result){
        res.send({"result": result});
    });
});

router.post('/showNoSession',function(req,res,next){
    showNoSession(function(result){
        res.send(result);
    });
});

router.post('/checkTypeSession',function(req,res,next){
    checkTypeSession(req.body.id_session,function(result){
        res.send({"result": result});
    });
});

router.post('/isAdmin',function(req,res,next){
    isAdmin(req,function(result){
        res.send({"result": result});
    });
});

router.post('/obtainFirstVideo',function(req,res,next){
    obtainFirstVideo(req.body.id_session,function(result){
        res.send(result);
    });
});

router.post('/deleteFirstSong',function(req,res,next){
    deleteFirstSong(req.body.id_session,function(result){
        res.send(result);
    });
});

router.post('/retireActualSong',function(req,res,next){
    retireActualSong(req.body.id_session,function(result){
        res.send({"result":result});
    });
});

router.post('/checkadmin',function(req,res,next){
    checkAdmin(req.body.id_session,req,function(result){
        res.send({"result":1});
    });
});

/* Llamadas a Vista desde Cliente */
router.post('/v_showusername',function(req,res,next){
    v_showUsername(req,function(result){
        res.send(result);
    });
});

router.post('/v_showlistsessions',function(req,res,next){
    v_showListSessions(req.body.number,req,function(result){
        res.send(result);
    });
});

router.post('/v_showfollowedsessions',function(req,res,next){
    v_showFollowedSessions(req.body.number,req,function(result){
        res.send(result);
    });
});

router.post('/v_showButtonUsernameGuest',function(req,res,next){
    v_showButtonUsernameGuest(req,function(result){
        res.send(result);
    });
});

router.post('/v_showButtonSignOut',function(req,res,next){
    v_showButtonSignOut(req,function(result){
        res.send(result);
    });
});

router.post('/v_showSpacePassSession',function(req,res,next){
    v_showSpacePassSession(function(result){
        res.send(result);
    });
});

router.post('/v_showNameSession',function(req,res,next){
    v_showNameSession(req.body.id_session,function(result){
        res.send(result);
    });
});

router.post('/v_showNavbarSession',function(req,res,next){
    v_showNavbarSession(req.body.id_session,req,function(data){
        res.send(data);
    });
});

router.post('/v_showDescriptionUser',function(req,res,next){
    v_showDescriptionUser(req.session.username,function(result){
        res.send(result);
    });
});

router.post('/v_showInfoSessionsUser',function(req,res,next){
    v_showInfoSessionsUser(req,function(result){
        res.send(result);
    });
});

router.post('/v_showActiveSessions',function(req,res,next){
    v_showActiveSessions(req,function(result){
        res.send(result);
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname+"/index.html"));
});

/* MENU PAGE*/
router.get('/menu', function(req, res, next) {
  res.sendFile(path.join(__dirname+"/menu.html"));
});

/* PROFILE PAGE*/
router.get('/profile', function(req, res, next) {
  res.sendFile(path.join(__dirname+"/profile.html"));
});

/* CREATE SESSION PAGE*/
router.get('/createsession', function(req, res, next) {
  res.sendFile(path.join(__dirname+"/createsession.html"));
});

/* SESSION PAGE*/
router.get('/session', function(req, res, next) {
  res.sendFile(path.join(__dirname+"/session.html"));
  //res.redirect('/session?id_session='+number);
});

/************************ MODELO.JS FUNCIONES  *************************/
var md5 = require('md5');

//Connection to Database
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : "tfgkirtashdb.cdynp72jpqch.us-east-1.rds.amazonaws.com",
  user     : "masterUsername",
  password : "kirtashtfgbbdd",
  database : "dbkirtash"
});

/*
var connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "tfg",
    database : "tfg"
});*/
connection.connect(function(err){
    if (err){
        console.log(err.stack);
    } else {
        console.log('Connected!');
    }
});


/****** OPERATIONS WITH THE DATABASE ********/

/**
 * This function saves information about the user in the webpage not in the database
 */


function m_registrarusuario(username,pass_user,req,callback){
    req.session.username = username;
    req.session.pass = pass_user;
    connection.query("SELECT id_user FROM users WHERE username='" + username +"'", function (error, results, fields) {
        if (error){
            callback(-1);
        } else {
            req.session.id_user = results[0].id_user;
            callback(1);
        }   
    });
}

function m_signup(username,pass_user,req,callback){
   //Aplicar MD5
  var pass = md5(pass_user);

  connection.query("SELECT COUNT(username) AS username_exists FROM users WHERE username='"+ username+"'", function (error, results, fields) {
    if (error){
      callback(-1);
    } else {
      if (results[0].username_exists > 0){
        callback(-2);
      }
    }
  });

  connection.query("INSERT INTO users (username,pass_user) VALUES('"+username+"','" + pass + "')",function(error,results,fields){
    if(error){
        callback(-1);
    } else {
      m_registrarusuario(username,pass,req,function(result){
          callback(result);
      });
    }
  });
}

function m_signin(username,pass_user,req,callback){
    var pass = md5(pass_user);

    connection.query("SELECT pass_user FROM users WHERE username ='"+username+"'",function(error,results,fields){
      if(error || results[0] == undefined || Object.keys(results).length === 0){
            callback(-1);
        } else {
            if(results[0].pass_user == pass){
                m_registrarusuario(username,pass,req,function(result){
                    callback(result);
                });
            } else {
                callback(-1);
            }
        }
    });
}

function m_close_session(req,callback){
  req.session.destroy((err) => {
    if(err) {
        callback(-1);
    } else {
        callback(1);
    }
  });
}

function m_obtainListSessions(req,callback){
    connection.query("SELECT DISTINCT id_sesion,nombre_sesion FROM sesion INNER JOIN users ON sesion.id_user ='" +  req.session.id_user+"'",function(error,results,fields){
        callback(results);
    });
}

 /**
 * Function to create a new session in the database
 */
function m_createSession(name_session,pass_user,description,min_votes,min_users,type_session,req,callback){
    pass = md5(pass_user);

    query = `INSERT INTO sesion (id_user,nombre_sesion,pass_sesion,description_session,type_session,min_votes,min_users)
            VALUES ('${req.session.id_user}','${name_session}','${pass}','${description}','${type_session}','${min_votes}','${min_users}')`;


    connection.query(query,function(error,results,fields){
        if(error){
            callback(-4);
        } else {
            last_id = results.insertId;
            query2 = `INSERT INTO admins (id_user,id_session)
                VALUES ("${req.session.id_user}","${last_id}")`;
            connection.query(query2,function(error,results,fileds){
                if(error){
                    callback(-4);
                } else {
                    callback(1);
                }
            });
        }
    });
}


function m_obtainPlaylist(id_session,id_cancion_actual,callback){
    consulta = `SELECT * 
              FROM lista_reproduccion 
              WHERE id_sesion = '${id_session}' AND id_cancion != '${id_cancion_actual}'
              ORDER BY mark DESC`;

    connection.query(consulta,function(error,results,fields){
        callback(results);
    });
}

function m_obtainIdSongActual(id_session,callback){
    connection.query("SELECT id_cancion FROM playing WHERE id_session ="+ id_session,function(error,results,fields){
        if(error || results == undefined || Object.keys(results).length === 0) {
            callback(undefined);
        } else {
            callback(results[0].id_cancion);
        }  
    });
}

function m_obtainFirstVideo(id_session,callback){

    connection.query("SELECT id_cancion FROM playing WHERE id_session='" + id_session +"'",function(error,results,fields){
        if(error || results[0] == undefined || Object.keys(results).length === 0){ //No video is being played
            connection.query("SELECT * FROM lista_reproduccion WHERE id_sesion ='"+ id_session + "' ORDER BY mark DESC",function(error,results,fields){
                callback(results);
            });
        } else {
            //We obtain the video is being played from $result["id_cancion"] = results[0].solution
            connection.query("SELECT * FROM lista_reproduccion  WHERE id_sesion ='"+ id_session +"' AND id_cancion='" + results[0].id_cancion+"'",function(error,results,fields){
                callback(results);
            });
        }
    });
}

function m_insertSongInPlaying(id_session,id_cancion,callback){
    //First we have to check if the song we receive it's already inserted in 'playing' or not

    connection.query("SELECT id_playing FROM playing WHERE id_session ='"+ id_session +"' AND id_cancion ='" + id_cancion + "'",function(error,results,fields){
        if(error || results == undefined || Object.keys(results).length === 0){
            connection.query("INSERT INTO playing (id_session,id_cancion) VALUES ('"+id_session+"','"+id_cancion+"')",function(error,results,fields){
                if(error){
                    callback(1);
                } else {
                    callback(-4);
                }
            });
        } else {
            callback(1);
        }
    });
}

function m_updateMark(id_session,id_cancion,number,req,callback){
    //First we store the vote in the database OR we update the vote

    connection.query("SELECT id_like FROM likes WHERE id_session ='"+ id_session+"' AND id_user ='"+ req.session.id_user + "' AND id_cancion ='"+ id_cancion+"'",function(error,results,fields){
        if (results == undefined || Object.keys(results).length === 0){ //The user has never voted to this song before
            query = "INSERT INTO likes (id_session,id_user,id_cancion,vote) VALUES ('"+ id_session +"','"+ req.session.id_user+"','"+ id_cancion+"','"+ number+"')";
        } else {
            query = "UPDATE likes SET vote = "+ number +" WHERE id_like = " + results[0].id_like;
        }
        connection.query(query,function(error,results,fields){ //Once we have stored the vote we update the mark in lista_reproduccion
            if (error){
                console.log("ERROR");
                callback(-1);
            } else {
                //We obtain the mark stored in the database
                connection.query("SELECT mark FROM lista_reproduccion WHERE id_cancion ='" + id_cancion+"'",function(error,results,fields){
                    mark = results[0].mark;
                    new_mark = parseInt(mark) + parseInt(number);

                    connection.query("UPDATE lista_reproduccion SET mark ='"+ new_mark +"' WHERE id_cancion ='" + id_cancion+"'",function(error,results,fields){
                        console.log("hiii");
                        if (error){
                            callback(-1);
                        } else {
                            callback(1);
                        }
                    });
                });
            }
        });
    });
}

function m_checkVote(id_cancion,id_user,id_session,callback){
    connection.query("SELECT vote FROM likes WHERE id_session ='" + id_session +"' AND id_user ='"+ id_user +"' AND id_cancion ='"+ id_cancion+"'",function(error,results,fields){
        if ( error || results == undefined || Object.keys(results).length === 0){
            callback(undefined);
        } else {
            callback(results[0].vote);
        }
    });
}

function m_addToPlaylist(id_session,title,videoId,duration,callback){
    connection.query("INSERT INTO lista_reproduccion (id_sesion,title,videoId,duration) VALUES ('"+id_session+"','"+title+"','"+videoId+"','"+duration+"')",function(error,results,fields){
        if (error){
            callback(-1);
        } else {
            callback(1);
        }
    });
}

function m_deleteFirstSong(id_session,id_cancion,callback){
    connection.query("DELETE FROM lista_reproduccion WHERE id_sesion ="+id_session+" AND id_cancion ="+id_cancion,function(error,results,fields){
        if(error){
            callback(-1);
        } else {
            callback(1);
        }
    });
}


function m_deleteSession(id_session,callback){
    connection.query("DELETE FROM sesion WHERE id_sesion ='"+id_session+"'",function(error,results,fields){
        if(error){
            callback(-1);
        } else {
            callback(1);
        }
    });
}

function m_obtainNameSession(id_session,callback){
    connection.query("SELECT nombre_sesion FROM sesion WHERE id_sesion ='" + id_session+"'",function(error,results,fields){
        callback(results[0].nombre_sesion);
    });
}

function m_isAdmin(id_session,id_user,callback){
    connection.query("SELECT id_admin FROM admins WHERE id_user ='"+ id_user+"' AND id_session ='"+id_session+"'",function(error,results,fields){
        callback(results);
    });
}

function m_isFollowingSession(id_session,req,callback){
    connection.query("SELECT id_follow FROM follows WHERE id_user='"+ req.session.id_user +"' AND id_session='"+id_session+"'",function(error,results,fields){
        callback(results);
    });
}

function m_followSession(id_session,req,callback){
    connection.query("INSERT INTO follows(id_session,id_user) VALUES ('"+id_session+"','"+req.session.id_user+"')",function(error,results,fields){
        if(error){
            callback(-1);
        } else {
            callback(1);
        }
    });
}

function m_unfollowSession(id_session,req,callback){
    connection.query("DELETE FROM follows WHERE id_session='"+id_session+"' AND id_user='"+req.session.id_user+"'",function(error,results,fields){
        if(error){
            callback(-1);
        } else {
            callback(1);
        }
    });
}

function m_obtainFollowedSessions(req,callback){
    connection.query("SELECT nombre_sesion,id_sesion FROM sesion INNER JOIN follows WHERE follows.id_user ='"+req.session.id_user+"' AND sesion.id_sesion = follows.id_session",function(error,results,fields){
        callback(results);
    });
}

function m_checkSession(id_session,callback){
    connection.query("SELECT id_sesion FROM sesion WHERE id_sesion =" + id_session,function(error,results,fields){
        callback(results);
    });
}

function m_searchTextAdmins(text,id_session,req,callback){
    query = `SELECT username
              FROM users u 
              WHERE username LIKE '${text}%' AND 
                    username != '${req.session.username}' AND
                    id_user NOT IN (
                        SELECT id_user
                        FROM admins
                        WHERE id_session = '${id_session}')`;

    connection.query(query,function(error,results,fields){
        callback(results);
    });
}


function m_insertNewAdmin(id_user,id_session,callback){
    connection.query("INSERT INTO admins(id_user,id_session) VALUES ('"+ id_user +"','"+id_session+"')",function(error,results,fields){
        if(error){
            callback(-1);
        } else {
            callback(1);
        }
    });
}

function m_obtainIdUser(username,callback){
    connection.query("SELECT id_user FROM users WHERE username ='"+username+"'",function(error,results,fields){
        callback(results[0].id_user);
    });
}

function m_obtainUsername(id_user,callback){
    connection.query("SELECT username FROM users WHERE id_user ='" + id_user+"'",function(error,results,fields){
        callback(results[0].username);
    });
}

/**
 * Returns the id_user of the AdminMaster
 */
function m_obtainIdUserAdminMaster(id_session,callback){
    connection.query("SELECT a.id_user AS id_user FROM sesion s INNER JOIN admins a WHERE s.id_sesion ="+id_session+" AND a.id_session = "+id_session+" AND s.id_user = a.id_user",function(error,results,fields){
        callback(results[0].id_user);
    });
}

function m_obtainAdmins(id_session,id_masteradmin,callback){
    connection.query("SELECT id_user FROM admins WHERE id_session = "+id_session+" AND id_user != "+id_masteradmin,function(error,results,fields){
        callback(results);
    });    
}

function m_deleteAdmin(id_user,id_session,callback){
    connection.query("DELETE FROM admins WHERE id_user ='"+id_user+"' AND id_session ='"+id_session+"'",function(error,results,fields){
        if(error){
            callback(-1);
        } else {
            callback(1);
        }
    });
}

function m_obtainDescriptionUser(username,callback){
    connection.query("SELECT description_user FROM users WHERE username='"+username+"'",function(error,results,fields){
        callback(results[0].description_user);
    });
}

function m_obtainInfoSessionsUser(id_user,callback){
    query = `SELECT DISTINCT sesion.id_sesion AS id_session, sesion.nombre_sesion as nombre_sesion,COUNT(admins.id_session) AS NumberAdmins
              FROM sesion 
              INNER JOIN admins ON sesion.id_sesion = admins.id_session AND sesion.id_user = '${id_user}'
              GROUP BY sesion.id_sesion`; 

    connection.query(query,function(error,results,fields){
        callback(results);
    });
}

function m_obtainFollowersSession(id_session,callback){
    connection.query("SELECT COUNT(id_follow) AS NumberFollowers FROM follows WHERE id_session ='"+id_session+"'",function(error,results,fields){
        callback(results[0].NumberFollowers);
    });
}

function m_isActiveSession(id_session,callback){
    connection.query("SELECT id_playing FROM playing WHERE id_session ='"+id_session+"'",function(error,results,fields){
        if(error || results == undefined || Object.keys(results).length === 0){
            callback(0);
        } else {
            callback(1);
        }
    });
}

function m_modifyUsername(username,req,callback){
    connection.query("UPDATE users SET username ='"+username+"' WHERE id_user='"+req.session.id_user+"'",function(error,results,fields){
        if(error){
            callback(-1);
        } else {
            req.session.username = username;
            callback(1);
        }
    });
}

function m_checkActualPassword(actual_pass,id_user,callback){
    pass = md5(actual_pass);

    connection.query("SELECT username FROM users WHERE id_user ='"+id_user+"' AND pass_user='"+pass+"'",function(error,results,fields){
        if(error || results == undefined || Object.keys(results).length === 0){
            callback(0);
        } else {
            callback(1);
        }
    });
}

function m_modifyPassword(new_pass,id_user,callback){
    pass = md5(new_pass);

    connection.query("UPDATE users SET pass_user ='"+pass+"' WHERE id_user ='"+id_user+"'",function(error,results,fields){
        if(error){
            callback(-1);
        } else {
            callback(1);
        }
    });
}

function m_modifyDescription(new_description,id_user,callback){
    connection.query("SELECT description_user FROM users WHERE id_user='"+id_user+"'",function(error,results,fields){
        actual_description = results[0].description_user;

        if(actual_description.localeCompare(new_description) == 0){
            callback(1);
        } else { //We modify the description
            connection.query("UPDATE users SET description_user ='"+new_description+"' WHERE id_user ='"+id_user+"'",function(error,results,fields){
                if(error){
                    callback(-1);
                } else {
                    callback(2);
                }
            });
        }
    });
}

function m_modifyNameSession(new_namesession,id_session,callback){
    connection.query("SELECT nombre_sesion FROM sesion WHERE id_sesion ='"+id_session+"'",function(error,results,fields){
        actual_name_session = results[0].nombre_sesion;

        if(actual_name_session.localeCompare(new_namesession) == 0){
            callback(1);
        } else { //We modify the description
            connection.query("UPDATE sesion SET nombre_sesion ='"+new_namesession+"' WHERE id_sesion ='"+id_session+"'",function(error,results,fields){
                if(error){
                    callback(-1);
                } else {
                    callback(2);
                }
            });
        }
    });        
}

function m_modifyTypeSession(new_type_session,id_session,callback){
    connection.query("SELECT type_session FROM sesion WHERE id_sesion ='"+id_session+"'",function(error,results,fields){
        actual_type_session = results[0].type_session;

        if( actual_type_session === new_type_session){
            callback(1);
        } else {
            connection.query("UPDATE sesion SET type_session ='"+new_type_session+"' WHERE id_sesion ='"+id_session+"'",function(error,results,fields){
                if(error){
                    callback(-1);
                } else {
                    callback(2);
                }
            });
        }
    }); 
}

function m_obtainTypeSession(id_session,callback){
    connection.query("SELECT type_session FROM sesion WHERE id_sesion ="+id_session,function(error,results,fields){
        callback(results[0].type_session);
    });
}

function m_checkPasswordSession(try_pass,id_session,callback){
    pass = md5(try_pass);

    connection.query("SELECT nombre_sesion FROM sesion WHERE id_sesion ='"+id_session+"' AND pass_sesion ='"+pass+"'",function(error,results,fields){
        if(error || results == undefined || Object.keys(results).length === 0){
            callback(-1);
        } else {
            callback(1);
        }
    });
}

function m_obtainMinVotes(id_session,callback){
    connection.query("SELECT min_votes FROM sesion WHERE id_sesion ="+id_session,function(error,results,fields){
        callback(results[0].min_votes);
    });
}

function m_obtainMinUsers(id_session,callback){
    connection.query("SELECT min_users FROM sesion WHERE id_sesion ="+id_session,function(error,results,fields){
        callback(results[0].min_users);
    });
}

function m_modifyPasswordSession(new_pass,id_session,callback){
    pass = md5(new_pass);

    connection.query("UPDATE sesion SET pass_sesion ='"+pass+"' WHERE id_sesion ='"+id_session+"'",function(error,results,fields){
        if(error){
            callback(0);
        } else {
            callback(1);
        }
    });
}

function m_obtainDescriptionSession(id_session,callback){
    connection.query("SELECT description_session FROM sesion WHERE id_sesion ="+id_session,function(error,results,fields){
        callback(results[0].description_session);
    });
}

function m_modifyDescriptionSession(description,id_session,callback){
    connection.query("UPDATE sesion SET description_session ='"+description+"' WHERE id_sesion ='"+id_session+"'",function(error,results,fields){
        if(error){
            callback(-1);
        } else {
            callback(1);
        }
    });
}

function m_modifyProportion(min_votes,min_users,id_session,callback){
    connection.query("UPDATE sesion SET min_votes ='"+min_votes+"',min_users ='"+min_users+"' WHERE id_sesion='"+id_session+"'",function(error,results,fields){
        if(error){
            callback(-1);
        } else {    
            callback(1);
        }
    });
}
/*
connection.query("",function(error,results,fields){

});
*/

/***** CONTROLADOR ********/
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

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
function sign_up(username,pass_user,pass_user2,req,callback){
    
    //We erase the spaces
    username = username.replace(" ","");
    pass_user = pass_user.replace(" ","");

    length = username.length;
    lengthp = pass_user.length;

    if (length < 5){
        callback(-6);
    } else if( lengthp < 5){
        callback(-5);
    } else if ( username.localeCompare("") == 0){
        callback(-4);
    } else if ( pass_user.localeCompare("") == 0){
        callback(-4);
    } else if ( pass_user2.localeCompare("") == 0){
        callback(-4);
    } else if ( pass_user.localeCompare(pass_user2) == 0){
        m_signup(username,pass_user,req,function(result){
            callback(result);
        });
    } else {
        callback(-3);
    }
}

/**
 * Function to login 
 */
function sign_in(username,pass_user,req,callback){
    m_signin(username,pass_user,req,function(result){
        callback(result);
    });
}

/**
 * Function to close session
 */
function close_session(req,callback){
    m_close_session(req,function(result){
        callback(result);
    });
}

/**
 * Function to create a new session
 */
function create_session(name_session,pass_user,pass_user2,description,min_votes,min_users,type_session,req,callback){

    name_session = name_session.replace(/" "/g,"");
    pass_user = pass_user.replace(/" "/g,"");
    lengthn = name_session.length;
    lengthp = pass_user.length;

    min_votes = parseInt(min_votes);
    min_users = parseInt(min_users);

    if (lengthn == 0){
        callback(-1);
    } else if (lengthp < 5){
        callback(-2);
    } else if (pass_user.localeCompare(pass_user2) != 0){
        callback(-3);
    } else if( min_votes > min_users){
        callback(-5);
    } else {
        m_createSession(name_session,pass_user,description,min_votes,min_users,type_session,req,function(result){
            callback(result);
        });
    }
}

/**
 * Function that updates the mark of a song
 */
function updateMark(id_session,id_cancion,number,req,callback){
    console.log("Entrando aqui...");
    m_updateMark(id_session,id_cancion,number,req,function(result){
        callback(result);
    });
}

/**
 * Function that removes/deletes the first song of the playlist
 */
function removeSong(id_session,id_cancion,callback){
    //We call deleteFirstSong() because despite of his name,
    // the function deletes the song specified by the id_session and id_cancion
    deleteFirstSong(id_session,id_cancion,function(result){
        callback(result);
    });
}

/**
 * REVISAR ESTA FORMA DE IMPLEMENTARLO
 */
function updatePlaylist(id_session,req,callback){
    v_showPlaylist(id_session,req,function(result){
        callback(result);
    });
}

/**
    * Function that adds to the playlist of the sessions a new song
    */
function addToPlaylist(id_session,title,videoId,duration,callback){

    m_addToPlaylist(id_session,title,videoId,duration,function(result){
        callback(result);
    });
}

/**
    * Function that obtains the first song/video that has to be played
    */
function obtainFirstVideo(id_session,callback){
    m_obtainFirstVideo(id_session,function(result){
        //We obtain all the playlist but we will get only the first song
        //IMPORTANT: We need to check if the playlist is empty or not
        if (result == undefined || result[0] == undefined || Object.keys(result).length === 0){ //The playlist is empty
            callback({"result": -1});
        } else { //The playlist has songs/videos to play
            //Obtain the videoId and the title and return them
            //arr = array('title' => result[0].title, "videoId" => result[0].videoId,"id_cancion" => result[0].id_cancion);
            //info = json_encode(arr);

            info = {'title' : result[0].title,
                    "videoId" : result[0].videoId,
                    "id_cancion" : result[0].id_cancion,
                    "result" : 1};
            //Insert the video in the table 'playing'
            m_insertSongInPlaying(id_session,result[0].id_cancion,function(result2){
                if (result2 == 1){
                    callback(info);
                } else { //ERROR
                    callback({"result": -3});
                }
            });            
        }
    });
}

/**
    * Function that deletes the first song of the playlist, the one being played
    */
function deleteFirstSong(id_session,id_cancion,callback){
    //We retire the song from the database
    m_deleteFirstSong(id_session,id_cancion,function(result){
        callback(result);
    });
}

/**
    * Function that deletes/removes the song that it's being played
    */
function retireActualSong(id_session,callback){
    m_obtainIdSongActual(id_session,function(res){
        if (res != undefined){
            id_cancion = res;
            m_deleteFirstSong(id_session,id_cancion,function(result){
                callback(result);
            });
        } else {
            callback(-2);
        }
    });
}

/**
    * Function to exit a Session
    */
function exitSession(req,callback){
    if (req.session.username != undefined ){ 
        callback(1);
    }else {
        callback(-1);
    }
}

/**
    * Function that deletes a particular session
    */
function deleteSession(id_session,callback){
    m_deleteSession(id_session,function(result){
        callback(result);
    });
}

/**
    * Function that checks if a user is an admin of a particular session or not
    */
function checkAdmin(id_session,req,callback){
    if (req.session.username != undefined){ //We check if the user is registered or not
        m_isAdmin(id_session,req.session.id_user,function(result){
            if (result == undefined ||  Object.keys(result).length === 0){
                req.session.admin = 0;
            } else {
              req.session.admin = 1;
            }
            callback(1);
        });
    } else {
      req.session.admin = 0;
      callback(1);
    }
}

/**
    * Function to follow a session (by a user)
    */
function followSession(id_session,req,callback){
    m_followSession(id_session,req,function(result){
        callback(result);
    });
}

/**
    * Function to unfollow a session (by a user)
    */
function unfollowSession(id_session,req,callback){
    m_unfollowSession(id_session,req,function(result){
        callback(result);
    });
}

/**
    * Function that shows the Follow Button with CSS,HTML...
    */
function showFollowButton(id_session,req,callback){
    v_showFollowButton(id_session,req,function(result){
        callback(result);
    });
}

/**
    * Function to show the List of Sessions
    */
function showListSessions(number){
    return v_showListSessions(number);
}

/**
    * Function to show the list of Followed Session
    */
function showFollowedSessions(number){
    return v_showFollowedSessions(number);
}

/**
    * Function that checks if a particular session exists or not
    */
function checkSession(id_session,callback){
    m_checkSession(id_session,function(result){
        if (result == undefined){ //The session doesn't exist
            callback(-1);
        } else {
            callback(1);
        }
    });
}

/**
    * Function that in case a session doesn't exists shows an error message
    */
function showNoSession(callback){
    v_showNoSession(function(result){
        callback(result);
    });
}

/**
    * Function to show the usernames for possibles futures admins
    */
function searchTextAdmins(text,id_session,req,callback){
    //We check the length without spaces, because if not we will see all users
    text = text.replace(" ","");
    length = text.length;
    if (length == 0){
        callback("");
    } else{
        //Search in the BBDD usernames starting with this text
        m_searchTextAdmins(text,id_session,req,function(result){
            //We show the result
            v_showSearchTextAdmins(result,function(searchresult){
                callback(searchresult);
            });
        });        
    }
}

/**
    * Function that add/insert new admins to a particular session
    */
function insertNewAdmins(value,id_session,callback){

    m_obtainIdUser(value,function(id_user){
        m_insertNewAdmin(id_user,id_session,function(result){
            callback(result);
        });
    });
}

/**
    * Function that deletes an admin of a particular session
    */
function deleteAdmin(username,id_session,callback){

    m_obtainIdUser(username,function(id_user){
        m_deleteAdmin(id_user,id_session,function(result){
            callback(result);
        });
    });
}

/**
    * Function that shows the admin badge (a gold prize)
    */
function showAdminBadge(id_session,number_in){

    return v_showAdminBadge(id_session,number_in);
}

/**
    * Function to update the List of Admins in the modal
    */
function updateAdminListModal(number_in,id_session,callback){
    
    if (number_in == 1){
        content = fs.readFileSync(path.join(__dirname + "/file_html/elem_list_modal1.html"),'utf-8');
    } else {
        content = fs.readFileSync(path.join(__dirname + "/file_html/elem_list_modal1.html"),'utf-8');
    }
    
    //We fill modal1 with the list of the admins and the buttons to delete admins only if you are the AdminMaster
    m_obtainIdUserAdminMaster(id_session,function(id_masteradmin){
        m_obtainUsername(id_masteradmin,function(username_masteradmin){
            m_obtainAdmins(id_session,id_masteradmin,function(data_admins){
                    t1 = `<tr>
                    <td class='text-center'>
                        <div class='icon icon-success mb-2'>
                            <i class='tim-icons icon-trophy'></i>
                        </div>
                    </td>
                    <td>
                        ${username_masteradmin}
                    </td>
                    <td>
                        <button class='btn btn-danger btn-fab btn-icon btn-sm' disabled>
                            <i class='tim-icons icon-trash-simple'></i>
                        </button>
                    </td>
                    </tr>`;

                    data_admins.forEach(function(elem){
                        username_admin = m_obtainUsername(elem["id_user"]);

                        aux = content.replace("##username_admin##",username_admin)

                        t1 = t1.concat(aux);
                    });

                    callback(t1);
                });
            });
        });
}

    

/**
    * Function to check if the actual username and the new username typed 
    * by the user are equal or not
    */
function checkUsername(username,req,callback){
    //Check if the usernames are equal or not
    if (username.localeCompare(req.session.username) != 0){ //We have to modify the username
        m_modifyUsername(username,req,function(result){
            callback(result);
        });
    } else {
        callback(2);
    }
}

/**
    * Function that checks if the password typed by the user is the correct one or not
    */
function checkActualPassword(actual_pass,req,callback){
    id_user = req.session.id_user;

    m_checkActualPassword(actual_pass,id_user,function(result){
        callback(result);
    });
}

/**
    * Function that modifies the password of a particular user
    */
function modifyPassword(new_pass,req,callback){
    id_user = req.session.id_user;

    m_modifyPassword(new_pass,id_user,function(result){
        callback(result);
    });
}

/**
    * Function that modifies the description of a particular user
    */
function modifyDescription(description,req,callback){
    id_user = req.session.id_user;

    m_modifyDescription(description,id_user,function(result){
        callback(result);
    });
}

/**
    * Function that checks if the actual name of the session and the new name
    * are equal or not. If they aren't equal, it'll change the name of the session
    */
function checkNameSession(new_namesession,id_session,callback){
    
    m_modifyNameSession(new_namesession,id_session,function(result){
        callback(result);
    });
}

/**
    * Function that modifies the type of the session
    * Type = 1 --> Session
    * Type = 2 --> Private Session
    */
function modifyTypeSession(new_type_session,id_session,callback){

    m_modifyTypeSession(new_type_session,id_session,function(result){
        callback(result);
    });
}

/**
    * Function to obtain the type of the session
    */
function checkTypeSession(id_session,callback){
    m_obtainTypeSession(id_session,function(result){
        callback(result);
    });
}

/**
    * Function to know if the user is an admin or not
    */
function isAdmin(req,callback){
    callback(req.session.admin);
}

/**
    * Function to check if the password of the session typed by the user, 
    * it's the correct one
    */
function enterPasswordSession(try_pass,id_session,callback){

    m_checkPasswordSession(try_pass,id_session,function(result){
        callback(result);
    });
}

/**
    * Function that modifies the password of a particular session
    */
function modifyPasswordSession(new_pass,id_session,callback){

    m_modifyPasswordSession(new_pass,id_session,function(result){
        callback(result);
    });
}

/**
    * Function that modifies the description of a particular session
    */
function modifyDescriptionSession(description,id_session,callback){

    m_modifyDescriptionSession(description,id_session,function(result){
        callback(result);
    });
}

/**
    * Function that modifies the proportion (min_votes/min_users) of a particular session
    */
function modifyProportion(min_votes,min_users,id_session,callback){
    if (parseInt(min_votes) > parseInt(min_users)){
        callback(0);
    } else {
        m_modifyProportion(min_votes,min_users,id_session,function(result){
            callback(result);
        });
    }
}


/**********  VISTA ***********/

/**
 * Function that shows in a paragraph the username of the current session
 */
function v_showUsername(req,callback){
    if (req.session.username != undefined){
        result = req.session.username;
    } else {
        result = "Guest";
    }
    callback(result);
}

function v_showListSessions(number,req,callback){
    m_obtainListSessions(req,function(data){
        
        result = "<div class='row'>";
        var i = 0;

        var y = 0;

        data.forEach(function(elem){
            i = i + 1;
            if (parseInt(y) < 3){
                y = y + 1;
            } else {
                y = 1;
                result = result.concat("</div><div class='row'>");
            }    

            rand = Math.floor(Math.random()*3);
            
            if (rand == 0){ //We get elem_pink.html
                if(number == 1){
                    content = fs.readFileSync(path.join(__dirname + "/file_html/elem_pink.html"),'utf-8');
                } else {
                    content = fs.readFileSync(path.join(__dirname + "/file_html/elem_pink.html"),'utf-8');
                }
            } else if (rand == 1){ //We get elem_green.html
                if (number == 1){
                    content = fs.readFileSync(path.join(__dirname + "/file_html/elem_green.html"),'utf-8');
                } else {
                    content = fs.readFileSync(path.join(__dirname + "/file_html/elem_green.html"),'utf-8');
                }
            } else { //We get elem_blue.html
                if (number == 1){
                    content = fs.readFileSync(path.join(__dirname + "/file_html/elem_blue.html"),'utf-8');
                } else{
                    content = fs.readFileSync(path.join(__dirname + "/file_html/elem_blue.html"),'utf-8');
                }
            }
            content = content.replace(/##id_session##/g,elem.id_sesion);
            content = content.replace("##name_session##",elem.nombre_sesion);            

            result = result.concat(content);          
        });

        if (i == 0){
            result = "No sessions to display";
        } else {
            result = result.concat("</div>");
        }
        
        callback(result);

    });
}

function v_showFollowedSessions(number,req,callback){
    m_obtainFollowedSessions(req,function(data){

        result = "<div class='row'>";
        i = 0;

        y = 0;
        
        data.forEach(function(elem){

            i++;
            if (y < 3){
                y++;
            } else {
                y = 0;
                result = result.concat("</div><div class='row'>");
            }    

            rand = Math.floor(Math.random()*3);

            if (rand == 0){ //We get fw_pink.html
                if(number == 1){
                    content = fs.readFileSync(path.join(__dirname + "/file_html/fw_pink.html"),'utf-8');
                } else {
                    content = fs.readFileSync(path.join(__dirname + "/file_html/fw_pink.html"),'utf-8');
                }
            } else if (rand == 1){ //We get fw_green.html
                if (number == 1){
                    content = fs.readFileSync(path.join(__dirname + "/file_html/fw_green.html"),'utf-8');
                } else {
                    content = fs.readFileSync(path.join(__dirname + "/file_html/fw_green.html"),'utf-8');
                }
            } else { //We get fw_blue.html
                if (number == 1){
                    content = fs.readFileSync(path.join(__dirname + "/file_html/fw_blue.html"),'utf-8');
                } else {
                    content = fs.readFileSync(path.join(__dirname + "/file_html/fw_blue.html"),'utf-8');
                }
            }
            content = content.replace(/##id_session##/g,elem.id_sesion);
            content = content.replace("##name_session##",elem.nombre_sesion);  
            
            result = result.concat(content);                    
        });
        if (i == 0){
            result = "No followed sessions";
        } else {
            result = result.concat("</div>");
        }
        
        callback(result);
        
    });
}

function v_showButtonUsernameGuest(req,callback){
    if (req.session.username != undefined){
        result = req.session.username;
    } else {
        result = "Guest";
    }
    content = `<button class='btn btn-info btn-sm' type='button' id='button_username'>        
                    <i class='tim-icons icon-single-02'></i>
                    ${result}
                </button>`;

    callback(content);
}

/**
* Function that if the user is registered or not will show the button of Sign Out or not
*/
function v_showButtonSignOut(req,callback){
    if (req.session.username != undefined){
        result = `<li class='nav-item p-0'>
                    <button class='btn btn-success btn-sm' type='button' onclick='closeSession()'>Sign Out</button>
                    </li>`;
    } else {
        result = `<li class='nav-item p-0'>
                    <button class='btn btn-success btn-sm' type='button' onclick='toRegister()'>Register/Sign In</button>
                    </li>`;
    }
    callback(result);
}

function v_showSpacePassSession(callback){
    content = fs.readFileSync(path.join(__dirname + "/file_html/space_pass_session.html"),'utf-8');
    callback(content);
}


function v_showNameSession(id_session,callback){
    m_obtainNameSession(id_session,function(result){
        callback(result);
    });
}

function v_showNavbarSession(id_session,req,callback){
    
    if (req.session.admin != undefined){
        admin = req.session.admin;
    } else {
        admin = 0;
    }

    if (admin == 1){

        button1 = `<button class='btn btn-info btn-sm' data-toggle='modal' data-target='#myModal1'>
                    Show Admins
                    </button>`;
        modal1 = fs.readFileSync(path.join(__dirname + "/file_html/modal1.html"),'utf-8');
        modal2 = fs.readFileSync(path.join(__dirname + "/file_html/modal2.html"),'utf-8');
        modal3 = fs.readFileSync(path.join(__dirname + "/file_html/modal3.html"),'utf-8');
        content = fs.readFileSync(path.join(__dirname + "/file_html/elem_list_modal1.html"),'utf-8');
        navbar = fs.readFileSync(path.join(__dirname + "/file_html/navbar_video_admin.html"),'utf-8');
        
        //We fill modal1 with the list of the admins and the buttons to delete admins only if you are the AdminMaster
        m_obtainIdUserAdminMaster(id_session,function(id_masteradmin){
            m_obtainUsername(id_masteradmin,function(username_masteradmin){
                m_obtainAdmins(id_session,id_masteradmin,function(data_admins){
                  
                    t1 = `<tr>
                    <td class='text-center'>
                        <div class='icon icon-success mb-2'>
                            <i class='tim-icons icon-trophy'></i>
                        </div>
                    </td>
                    <td>
                        ${username_masteradmin}
                    </td>
                    <td class='text-right'>
                        <button class='btn btn-danger btn-fab btn-icon btn-sm' disabled>
                            <i class='tim-icons icon-trash-simple'></i>
                        </button>
                    </td>
                    </tr>`;

                    num_datos = 0;
                    num_data_admins = data_admins.length;

                    if (num_datos == num_data_admins){
                        modal1 = modal1.replace("##list##",t1);

                        //We fill Modal3 => Session settings

                        //We show the name of the session
                        m_obtainNameSession(id_session,function(namesession){
                            modal3 = modal3.replace(/##namesession##/g,namesession);
        
                            //We show the type of session
                            m_obtainTypeSession(id_session,function(typesession){

                                if (typesession == 1){
                                    modal3 = modal3.replace("##checked1##","checked");
                                    modal3 = modal3.replace("##checked2##","");
                                } else {
                                    modal3 = modal3.replace("##checked1##","");
                                    modal3 = modal3.replace("##checked2##","checked");
                                }

                                m_obtainMinVotes(id_session,function(min_votes){
                                        
                                    min_users = m_obtainMinUsers(id_session,function(min_users){
                                            
                                    modal3 = modal3.replace("##min_votes##",min_votes);
                                    modal3 = modal3.replace("##min_users##",min_users);

                                    m_obtainDescriptionSession(id_session,function(description_session){
                                        modal3 = modal3.replace("##description_session##",description_session);
                                                                                    
                                        navbar = navbar.replace(/##modal1##/g,modal1);
                                        navbar = navbar.replace(/##modal2##/g,modal2);
                                        navbar = navbar.replace(/##modal3##/g,modal3);
                                        
                                        //FOLLOW BUTTON
                                        //Check if the user is registered
                                        if (req.session.username != undefined){
                                            m_isFollowingSession(id_session,req,function(result){
                                                    
                                                if (result == undefined || Object.keys(result).length === 0){
                                                    follow = "<a class='nav-link' onclick='followSession(0)'><i class='tim-icons icon-bell-55'></i>Follow</a>";
                                                    navbar = navbar.replace(/##follow##/g,follow);
                                                } else {
                                                    follow = "<a class='nav-link' onclick='followSession(1)'><i class='tim-icons icon-bell-55'></i>Unfollow</a>";
                                                    navbar = navbar.replace(/##follow##/g,follow);
                                                }
                                                callback(navbar);
                                            });
                                        } else {
                                            follow = "<a class='nav-link' onclick='followSession(-1)'><i class='tim-icons icon-bell-55'></i>Follow</a>";
                                            navbar = navbar.replace(/##follow##/g,follow);
                                            callback(navbar);
                                        }
                                    });
                                    });
                                });
                            });
                        });
                    }

                    data_admins.forEach(function(elem){
                        m_obtainUsername(elem["id_user"],function(username_admin){
                        
                            aux = content.replace(/##username_admin##/g,username_admin);
                            t1 = t1.concat(aux);

                            num_datos++;
                            if(num_datos == num_data_admins){
                                modal1 = modal1.replace("##list##",t1);

                                //We fill Modal3 => Session settings

                                //We show the name of the session
                                m_obtainNameSession(id_session,function(namesession){
                                    modal3 = modal3.replace(/##namesession##/g,namesession);
                
                                    //We show the type of session
                                    m_obtainTypeSession(id_session,function(typesession){

                                        if (typesession == 1){
                                            modal3 = modal3.replace("##checked1##","checked");
                                            modal3 = modal3.replace("##checked2##","");
                                        } else {
                                            modal3 = modal3.replace("##checked1##","");
                                            modal3 = modal3.replace("##checked2##","checked");
                                        }

                                        m_obtainMinVotes(id_session,function(min_votes){
                                                
                                            min_users = m_obtainMinUsers(id_session,function(min_users){
                                                    
                                                modal3 = modal3.replace("##min_votes##",min_votes);
                                                modal3 = modal3.replace("##min_users##",min_users);

                                                m_obtainDescriptionSession(id_session,function(description_session){
                                                    modal3 = modal3.replace("##description_session##",description_session);
                                                                                                
                                                    navbar = navbar.replace(/##modal1##/g,modal1);
                                                    navbar = navbar.replace(/##modal2##/g,modal2);
                                                    navbar = navbar.replace(/##modal3##/g,modal3);
                                                    
                                                    //FOLLOW BUTTON
                                                    //Check if the user is registered
                                                    if (req.session.username != undefined){
                                                        m_isFollowingSession(id_session,req,function(result){
                                                                
                                                            if (result == undefined || Object.keys(result).length === 0){
                                                                follow = "<a class='nav-link' onclick='followSession(0)'><i class='tim-icons icon-bell-55'></i>Follow</a>";
                                                                navbar = navbar.replace(/##follow##/g,follow);
                                                            } else {
                                                                follow = "<a class='nav-link' onclick='followSession(1)'><i class='tim-icons icon-bell-55'></i>Unfollow</a>";
                                                                navbar = navbar.replace(/##follow##/g,follow);
                                                            }
                                                            callback(navbar);
                                                        });
                                                    } else {
                                                        follow = "<a class='nav-link' onclick='followSession(-1)'><i class='tim-icons icon-bell-55'></i>Follow</a>";
                                                        navbar = navbar.replace(/##follow##/g,follow);
                                                        callback(navbar);
                                                    }
                                                });
                                        });
                                    });
                                });
                                });
                            }
                        });
                    });



                });
            });
        });
    } else { //User is not admin of the session
        navbar = fs.readFileSync(path.join(__dirname + "/file_html/navbar_video_noadmin.html"),'utf-8');

        //FOLLOW BUTTON
        //Check if the user is registered
        if (req.session.username != undefined){
            m_isFollowingSession(id_session,req,function(result){
                    
                if (result == undefined){
                    follow = "<a class='nav-link' onclick='followSession(0)'><i class='tim-icons icon-bell-55'></i>Follow</a>";
                    navbar = navbar.replace(/##follow##/g,follow);
                } else {
                    follow = "<a class='nav-link' onclick='followSession(1)'><i class='tim-icons icon-bell-55'></i>Unfollow</a>";
                    navbar = navbar.replace(/##follow##/g,follow);
                }
                callback(navbar);
            });

        } else {
            follow = "<a class='nav-link' onclick='followSession(-1)'><i class='tim-icons icon-bell-55'></i>Follow</a>";
            navbar = navbar.replace(/##follow##/g,follow);
            callback(navbar);
        }
    }
    
}

function v_showNoSession(callback){
    callback(fs.readFileSync(path.join(__dirname + "/file_html/navbar_video_noadmin.html"),'utf-8'));
}

function v_showPlaylist(id_session,req,callback){
    m_obtainIdSongActual(id_session,function(res1){

        if (res1 == undefined){
            id_cancion_actual = -1;
        } else {
            id_cancion_actual = res1;
        }

        m_obtainPlaylist(id_session,id_cancion_actual,function(res){
            if (req.session.admin != undefined){
                admin = req.session.admin;
            } else {
                admin = 0;
            }
            
            if (admin == 1){
                    template = fs.readFileSync(path.join(__dirname + "/file_html/playlist_admin.html"),'utf-8');
            } else {
                    template = fs.readFileSync(path.join(__dirname + "/file_html/playlist_noadmin.html"),'utf-8');
            }
    
            result = "";

            num_x_playlist = 0;
            total_songs = res.length;

            if (num_x_playlist == total_songs){
                callback(result);
            }

            i = 1;
            res.forEach(function(datos){
                content = template;
    
                content = content.replace(/##number##/g,i);
                i++;
                content = content.replace(/##title##/g,datos["title"]);
                content = content.replace(/##duration##/g,datos["duration"]);
                content = content.replace(/##mark##/g,datos["mark"]);
                content = content.replace(/##id_cancion##/g,datos["id_cancion"]);
    
                //We check if the user has liked or disliked the song, or neither
                if (req.session.id_user != undefined){
                    m_checkVote(datos["id_cancion"],req.session.id_user,id_session,function(b){
                    
                        if (b == undefined){
                            content = content.replace(/##disabledadd##/g,"");
                            content = content.replace(/##disabledsub##/g,"");
                        } else {
                            if (b == 1){
                                content = content.replace(/##disabledadd##/g,"disabled");
                                content = content.replace(/##disabledsub##/g,"");
                            } else {
                                content = content.replace(/##disabledadd##/g,"");
                                content = content.replace(/##disabledsub##/g,"disabled");
                            }
                        }
                    });
                } else {
                    content = content.replace(/##disabledadd##/g,"");
                    content = content.replace(/##disabledsub##/g,"");
                }
                result = result.concat(content);

                num_x_playlist++;
                if (num_x_playlist == total_songs){
                    callback(result);
                }
                
            });    
        });
    });
}

function v_showFollowButton(id_session,req,callback){
    //FOLLOW BUTTON
    //Check if the user is registered
    if (req.session.username != undefined){
        m_isFollowingSession(id_session,req,function(result){
            if (result == undefined || Object.keys(result).length === 0){
                follow = "<a class='nav-link' onclick='followSession(0)'><i class='tim-icons icon-bell-55'></i>Follow</a>";
            } else {
                follow = "<a class='nav-link' onclick='followSession(1)'><i class='tim-icons icon-bell-55'></i>Unfollow</a>";
            }   
            callback(follow);         
        });
    } else {
        follow = "<a class='nav-link' onclick='followSession(-1)'><i class='tim-icons icon-bell-55'></i>Follow</a>";
        callback(follow);
    }           
}

function v_showDescriptionUser(username,callback){
    m_obtainDescriptionUser(username,function(result){
        callback(result);
    });
}

function v_showInfoSessionsUser(req,callback){
    x = 0;
    m_obtainInfoSessionsUser(req.session.id_user,function(info){
        filas = "";
        y = info.length;
        
        if( x == y){
            callback(filas);
        }

        info.forEach(function(elem){
            m_obtainFollowersSession(elem["id_session"],function(result){
                content = `<tr>
                        <td>${elem["nombre_sesion"]}</td>
                        <td class='text-right'>${result}</td>
                        <td class='text-right'>${elem["NumberAdmins"]}</td>
                       </tr>`;
                filas = filas.concat(content);

                x++;
                if(x == y){
                    callback(filas);
                }
            });
        });
    });
}

function v_showActiveSessions(req,callback){
    num_x = 0;
    
    m_obtainInfoSessionsUser(req.session.id_user,function(info){
        active_sessions = "";
        num_y = info.length;

        if (num_x === num_y){
            active_sessions = `<tr>
                        <td>No sessions active right now</td>
                    </tr>`;
            callback(active_sessions);
        } else {
            info.forEach(function(elem){
                m_isActiveSession(elem["id_session"],function(active){
                    
                    if (active == 1){
                        content = `<tr>
                                        <td>${elem["nombre_sesion"]}</td>
                                    </tr>`;
                        active_sessions = active_sessions.concat(content);
                    }   
                    num_x++; 
                    if (num_x === num_y){
                        if (active_sessions.localeCompare("") == 0){
                            active_sessions = `<tr>
                                        <td>No sessions active right now</td>
                                    </tr>`;
                            callback(active_sessions);
                        } else {
                            callback(active_sessions); 
                        }   
                    }

                });
            });
        } 
    }); 
}

function v_showSearchTextAdmins(bbdd,callback){
    result = "<div class='text-left' id='checkbox'>";
    i = 0;
    bbddlength = bbdd.length;

    if (i == bbddlength){
        result = "Nothing founded";
        callback(result);
    }

    bbdd.forEach(function(elem){
        i++;

        content =  `<div class='form-check'>
                        <label class='form-check-label'>
                            <input class='form-check-input' type='checkbox' name='${elem["username"]}' value='${elem["username"]}' >
                            ${elem["username"]}
                            <span class='form-check-sign'>
                                <span class='check'></span>
                            </span>
                        </label>
                    </div>`;

        result = result.concat(content);

        if (i == bbddlength){
            result = result.concat("</div>");
            callback(result);
        }
    });
}


//Hemos instalado nodemon para no tener que cerrar la aplicación
//cada vez que hacemos un cambio. Para ello hemos usado el comando:
//npm install nodemon --save-dev




module.exports = router;
