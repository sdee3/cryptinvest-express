const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  accountStatus: {
    type: String,
    required: false,
    default: "pending"
  }
});

mongoose.model("user", UserSchema);