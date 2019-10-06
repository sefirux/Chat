const formMsj = document.getElementById('chat-input');
const msgInput = document.getElementById('new-message');
const messages = document.getElementById('chat-messages');
const socket = io();

const bottom = () => {
    window.scrollTo(0,document.body.scrollHeight);
}

const botonesVolver = document.querySelectorAll('.volver-btn');
botonesVolver.forEach(b => {
    b.addEventListener('click', e => {
        e.preventDefault();
        bottom();
    })
});

socket.on('update room', message => {
    let msgHTML = `<div class="card">
                        <div class="card-content">
                            <p><strong>${message.sender.name}</strong></p>
                            <p>${message.msg}</p>
                        </div>
                    </div>`;

    messages.innerHTML += msgHTML;
    bottom();
})

formMsj.addEventListener('submit', e => {
    e.preventDefault();
    socket.emit('send message', msgInput.value);
    msgInput.value = '';
});