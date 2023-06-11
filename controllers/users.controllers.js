class UsersController {
    constructor({UsersService}) {
        this.usersService = UsersService;
    }

    async get_user_by_Id(req, res){  
        this.usersService.get_user_by_Id(req, res);
    }

    async get_user(req, res){  
        this.usersService.get_user(req, res);
    }

    async post_user(req, res) {
        this.usersService.post_user(req, res);
    }

    delete_user(req, res) {
        this.usersService.delete_user(req, res);
    }

    update_user(req, res){
        //validate body
        //only can modify username
    }
}

module.exports = UsersController;