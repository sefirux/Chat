const formMsj = document.getElementById('chat-input');
const msgInput = document.getElementById('new-message');
const chatMessages = document.getElementById('chat-messages');
const socket = io();
let lastMessage;

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

socket.on('load new message', message => {
    const msg = document.createElement('div');
    msg.classList.add('card');
    msg.innerHTML = `<div class="card-content">
                        <p><strong>${message.sender}</strong></p>
                        <p>${message.msg}</p>
                        <p class="right"><small>${new Date(message.date).toLocaleString()}</small></p>
                    </div>`;
    chatMessages.appendChild(msg);
    lastMessage = msg;
    bottom();
});

socket.on('load old messages', messages => {
    messages.forEach(message => {
        const msg = document.createElement('div');
        msg.classList.add('card');
        msg.innerHTML = `<div class="card-content">
                            <p><strong>${message.sender}</strong></p>
                            <p>${message.msg}</p>
                            <p class="right"><small>${new Date(message.date).toLocaleString()}</small></p>
                        </div>`;
        chatMessages.insertBefore(msg, lastMessage);
        lastMessage = msg;
    });
});

formMsj.addEventListener('submit', e => {
    e.preventDefault();
    socket.emit('send message', msgInput.value);
    msgInput.value = '';
});