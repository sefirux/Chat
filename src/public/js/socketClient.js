const messageLoader = document.getElementById('message-loader');
const chatMessages = document.getElementById('chat-messages');
const msgInput = document.getElementById('new-message');
const formMsj = document.getElementById('chat-input');
const socket = io();
let lastMessage;

const bottom = () => window.scrollTo(0, document.body.scrollHeight);

const botonesVolver = document.querySelectorAll('.volver-btn');
botonesVolver.forEach(b => {
    b.addEventListener('click', e => {
        e.preventDefault();
        bottom();
    })
});

socket.on('load new message', message => {
    const msg = document.createElement('div');
    msg.classList.add('card', 'animated', 'bounce');
    msg.innerHTML = `
            <div class="card-image">
                <img scr="${message.sender.avatarUrl}" class="circle responsive-img">
            </div>
            <div class="card-stacked">    
                <div class="card-content">
                    <p><strong>${message.sender.name}</strong></p>
                    <p>${message.msg}</p>
                    <p class="right"><small>${new Date(message.date).toLocaleString()}</small></p>
                </div>
            </div>`;
    chatMessages.appendChild(msg);
    lastMessage = msg;
    bottom();
});

socket.on('load old messages', data => {
    if (!data.messagesToLoad && messageLoader.parentNode) {
        chatMessages.removeChild(messageLoader);
    }
    data.messages.forEach(message => {
        const msg = document.createElement('div');
        msg.classList.add('card', 'horizontal', 'animated', 'bounceInDown');
        msg.innerHTML = `
            <div class="card-image">
                <img scr="${message.sender.avatarUrl}" class="circle responsive-img">
            </div>
            <div class="card-stacked">    
                <div class="card-content">
                    <p><strong>${message.sender.name}</strong></p>
                    <p>${message.msg}</p>
                    <p class="right"><small>${new Date(message.date).toLocaleString()}</small></p>
                </div>
            </div>`;
        if(lastMessage){
            chatMessages.insertBefore(msg, lastMessage);
        } else {
            chatMessages.appendChild(msg);
        }
        lastMessage = msg;
    });
});

formMsj.addEventListener('submit', event => {
    event.preventDefault();
    socket.emit('send message', msgInput.value);
    msgInput.value = '';
});

messageLoader.addEventListener('click', event => {
    event.preventDefault();
    socket.emit('old messages');
});

socket.emit('old messages');
bottom();