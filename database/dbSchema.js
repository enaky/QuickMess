const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
            type: String
        },
        password: {
            type: String
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        birthDate: {
            type: Date
        },
        email: {
            type: Date
        },
        role: {
            type: String
        },
        gender: {
            type: String
        }
    }
);
const User = mongoose.model("User", userSchema);


const chatSchema = new Schema(
    {
        messages: [
            {type: mongoose.Schema.Types.ObjectId, ref: 'Message'}
        ]
    }
)
const Chat = mongoose.model("Chat", chatSchema);


const messageSchema = new Schema(
    {
        message: {
            type: String
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Chat'
        }
    },
    {
        timestamps: true
    }
);
const Message = mongoose.model("Message", messageSchema);

module.exports = {
    Chat: Chat,
    User: User,
    Message: Message
};
