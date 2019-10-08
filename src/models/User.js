class User {
    constructor(data){
        this.name = data.name ? data.name : `User-${(new Date).toString()}`;
        this.email = data.email ? data.email : null;
        this.password = data.password ? data.password : null;
        this.avatarUrl = data.avatarUrl ? data.avatarUrl : null;
    }
}

module.exports = User;