class Message {
    constructor(msg, sender, addressee){
        this.msg = msg;
        this.sender = sender;
        this.addressee = addressee;
        let date = new Date();
        this.date = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }
}

module.exports = Message;