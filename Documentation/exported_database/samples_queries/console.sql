use quickMess
//db.users.deleteMany({role: "user"})


//_-----------------------USERS
db.users.findOne({username: "enaki1"})
db.users.deleteOne({username: "catalin"})

db.users.update(
   { username: "diana" },
   { $set: { profileImagePath: "images/diana.png" } }
)

db.users.update(
   { username: "bucefal" },
   { $set: { profileImagePath: "images/bucefal.png" } }
)

db.users.update(
   { username: "ionut" },
   { $set: { firstName: "Ionuț" } }
)

db.users.update(
   { username: "ionut" },
   { $set: { profileImagePath: "images/ionut.jpg" } }
)


db.users.update(
   {  username: "pedro" },
   { $set: { posts: [] } }
)

db.users.deleteOne(
   {  username: "test" }
)

db.users.updateMany(
   {  },
   { $set: { friendRequestsSentByMe: [], friendRequests: [] } }
)

db.users.updateMany(
   {  },
   { $unset: { friendRequestsSendByMe: [] } }
)

db.users.updateMany(
   { city: "Timisoara" },
   { $set: { city: "Timișoara" } }
)

db.users.updateOne(
   { username: "diana" },
   { $addToSet: { friendRequests: ObjectId("5ed2abb399304e3208dd8128") } }
)

