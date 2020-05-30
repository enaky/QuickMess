const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//-------MESSAGE-------
const messageSchema = new Schema(
    {
        message: {type: String},
        sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'Chat'}
    },
    {
        timestamps: true
    }
);
const Message = mongoose.model("Message", messageSchema);

//-------CHAT-------
const chatSchema = new Schema(
    {
        messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}]
    }
)
const Chat = mongoose.model("Chat", chatSchema);

//-------POST-------
const postSchema = new Schema(
    {
        message: {type: String},
        owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    },
    {
        timestamps: true
    }
);
const Post = mongoose.model("Post", postSchema);

//-------USER-------
const userSchema = new Schema(
    {
        username: {type: String},
        password: {type: String},
        firstName: {type: String},
        lastName: {type: String},
        birthDate: {type: Date},
        email: {type: String},
        role: {type: String},
        gender: {type: String},
        status: {type: String},
        profileImagePath: {type: String},
        posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}]
    }
);
const User = mongoose.model("User", userSchema);

module.exports = {
    Chat: Chat,
    User: User,
    Message: Message,
    Post: Post,
};
