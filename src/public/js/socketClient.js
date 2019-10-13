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

const createMessageNode = (effect, message) => {
    const msg = document.createElement('div');
    msg.classList.add('card', 'horizontal', 'row', 'animated', effect);
    msg.innerHTML = `
        <div class="card-stacked col s2 valign-wrapper">
            <div class="row">
                <div class="col s12 center">
                    <span class="left"><strong>${message.sender.name}</strong></span>
                </div>
            </div>
            <div class="row">
                <div class="col s12">
                    <img src="${message.sender.avatarUrl}" class="circle" width="60">
                </div>
            </div>
        </div>
        <div class="card-satcked col s10">
            <div class="row">
                <div class="col s12">
                    <div class="card-content">
                        <p>${message.msg}</p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col s12">
                    <span class="right"><strong>${new Date(message.date).toLocaleString()}</strong></span>
                </div>
            </div>
        </div>`;

    return msg;
}

socket.on('load new message', message => {
    const msg = createMessageNode('bounce', message);
    chatMessages.appendChild(msg);
    lastMessage = msg;
    bottom();
});

socket.on('load old messages', data => {
    if (!data.messagesToLoad && messageLoader.parentNode) {
        chatMessages.removeChild(messageLoader);
    }
    data.messages.forEach(message => {
        const msg = createMessageNode('bounceInDown', message);
        if (lastMessage) {
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