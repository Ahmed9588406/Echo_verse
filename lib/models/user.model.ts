import mongoose from "mongoose";
/*
 Defines a Mongoose schema for a user, including fields for a unique identifier, username, name, image, bio, an array of posts, an onboarding status, and an array of communities.
 The schema is then used to create a Mongoose model, which can be used to interact with a MongoDB collection named 'users'

*/

// Mongoose schema for the User model using mongoose.Schema. This schema outlines the structure of documents that will be stored in the corresponding MongoDB collection.
const userSchema = new mongoose.Schema({

  id: { type: String, required: true }, // Represents a unique identifier for the user. It is of type String and is required

  username: { type: String, required: true , unique: true}, // Represents the unique username for the user. It is of type String, required, and has a unique constraint

  name: { type: String, required: true }, // Represents the name of the user. It is of type String and is required

  image: String, // Represents field for the image associated with the user. It is of type String

  bio: String, // Represents  field for the bio or description of the user. It is of type String

  // Represents an array of post references associated with the user. Each element is an ObjectId referencing a document in the 'posts' collection
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],

  // Represents a boolean flag indicating whether the user has completed the onboarding process. It is of type Boolean with a default value of false
  onboarded: {
    type: Boolean,
    default: false,
  },

  // Represents an array of community references associated with the user. Each element is an ObjectId referencing a document in the 'communities' collection
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
