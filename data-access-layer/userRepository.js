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

  async create(email, hash, salt) {
    const user = new User({ email, hash, salt });
    return user.save();
  }
  async find(params) {
    if (!params) {
      return User.find();
    } else if (params.email && !params.id) {
      return User.findOne({ email: params.email });
    } else if (params.id && !params.email) {
      return User.findById(id);
    } else {
      console.error(`UserRepository: ERROR: Bad Parameters. Valid parameters:
        1. { id: yourId } (get an entry by id)
        2. { email: yourEmail } (get an entry by email)
        3. null/undefined  (get all entries)
        `)
    }
  }
  async delete(id) {
    return User.findByIdAndDelete(id);
  }
}

export default new UserRepository();
