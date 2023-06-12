class UsersController {
    constructor({UsersService}) {
        this.usersService = UsersService;
    }

    get_user_by_Id = this.tryCatch(async (req, res) => {  
        await this.usersService.get_user_by_Id(req, res);
    })

    get_user = this.tryCatch(async (req, res) => {  
        await this.usersService.get_user(req, res);
    })

    post_user = this.tryCatch(async (req, res) => {
        await this.usersService.post_user(req, res);
    })

    delete_user = this.tryCatch(async (req, res) => {
        await this.usersService.delete_user(req, res);
    })

    update_user = async (req, res) => {
        //validate body
        //only can modify username
    }

    tryCatch(routeHandler) {
        return async (req, res, next) => {
            try {
                await routeHandler(req, res)
            } catch (error) {
                next(error);
            }
        }
    }
}

module.exports = UsersController;