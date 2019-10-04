const formMsj = document.getElementById('chat-input');
const msjInput = document.getElementById('nuevo-mensaje');
const mensajes = document.getElementById('chat-mensajes');
const socket = io();

const irAbajo = () => {
    window.scrollTo(0,document.body.scrollHeight);
}

const botonesVolver = document.querySelectorAll('.volver-btn');
botonesVolver.forEach(b => {
    b.addEventListener('click', e => {
        e.preventDefault();
        irAbajo();
    })
});

socket.on('recibir mensaje', data => {
    let mensajeHTML = `<div class="card">
                        <div class="card-content">
                            <p><strong>${data.userData.name}</strong></p>
                            <p>${data.msj}</p>
                        </div>
                    </div>`;

    mensajes.innerHTML += mensajeHTML;
    irAbajo();
})

formMsj.addEventListener('submit', e => {
    e.preventDefault();
    let mensaje = msjInput.value;
    socket.emit('enviar mensaje', {
        msj: mensaje
    });
    msjInput.value = '';
})