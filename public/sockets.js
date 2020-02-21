//El cliente al conectarse manda el mensaje 'connection' al servidor
var socket = io.connect("http://localhost:7000",{ 'forceNew':true});

//Evento a escuchar
socket.on('messages',function(data){
    console.log(data);
    render(data);
});

//Función para imprimir los mensajes que recibamos, especie de plantilla
function render(data){
    //Recorremos el array con map() -> Para cada elemento del array hacemos lo definido en la función interior
    var html = data.map(function(elem,index){
        return (`<div>
                    <strong>${elem.author}</strong>:
                    <em>${elem.text}</em>
                </div>`);
    }).join(" ");
    //Método join para unir por espacio y no por comas

    document.getElementById('messages').innerHTML = html;
}

//Función para añadir mensaje
function addMessage(e){
    var payload = {
        author: document.getElementById('username').value,
        text: document.getElementById('texto').value
    };
    //Emitimos un evento 'new-message' desde un socket, y le pasamos como data el objeto creado payload
    socket.emit('new-message',payload);
    return false;

}
