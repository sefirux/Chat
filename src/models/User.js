class User {
    constructor(name, email, pass){
        this.name = name;
        this.email = email;
        this.pass = pass;
    }
    
    get publicData(){
        const data = {
            name: this.name,
            email: this.email
        };
        return data;
    }
}

module.exports = User;
