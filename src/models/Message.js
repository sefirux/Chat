class Message {
    constructor(msg, sender, addressee){
        this.msg = msg;
        this.sender = sender;
        this.addressee = addressee;
        this.date = new Date().toString();
    }
}

module.exports = Message;