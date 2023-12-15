let User;

if (process.env.NODE_ENV !== "test") {
  import("../config/database.js")
    .then((db) => {
      User = db.default.User;
    })
    .catch((error) => console.log(error));
} else {
  import("../config/test/database.js")
    .then((db) => {
      User = db.default.User;
    })
    .catch((error) => console.log(error));
}

class UserRepository {
  async findAll() {
    return User.find();
  }
  async create(email, hash, salt) {
    const user = new User({ email, hash, salt });
    return user.save();
  }
  async findById(id) {
    return User.findById(id);
  }
  async findByEmail(email) {
    return User.findOne({ email });
  }
  async delete(id) {
    return User.findByIdAndDelete(id);
  }
}

export default new UserRepository();
