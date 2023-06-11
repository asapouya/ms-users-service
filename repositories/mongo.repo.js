class MongoRepo {

    constructor({usersModel}) {
        this.Users = usersModel;
    }

    userFactory(user) {
        return new this.Users(user);
    }
    async findOne(filters) {
        return await this.Users.findOne(filters);
    }
    async find(filters) {
        return await this.Users.find(filters);
    }
    async findById(id, options) {
        return await this.Users.findById(id, options);
    }
    async deleteMany(filters) {
        return await this.Users.deleteMany(filters);
    }
    async updateOne(filters, updateObj) {
        return await this.Users.updateOne(filters, updateObj);
    }
    async findOneAndUpdate(filters, updateObj) {
        return await this.Users.findOneAndUpdate(filters, updateObj);
    }
    async findByIdAndRemove(id) {
        return await this.Users.findByIdAndRemove(id);
    }
    async findOneAndDelete(filters) {
        return await this.Users.findOneAndDelete(filters);
    }
}

module.exports = MongoRepo;