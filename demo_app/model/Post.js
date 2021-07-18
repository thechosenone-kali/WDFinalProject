const db = require('./db')
const { uuid } = require('uuidv4')
const { post } = require('../controller/UserController')
const tableName = 'posts'
const PostModel = {
    // SELECT * FROM users;
    getAllPosts() {
        return db(tableName)
            .select(
                db.raw('cast(id as char(36)) as id'), 'title', 'content', 'user_id', 'created'
            )
    },
    // SELECT * FROM users WHERE username = $username;
    findPostsByUserId(userId) {
        return db(tableName)
            .select(
                db.raw('cast(id as char(36)) as id'), 'title', 'content',  db.raw('cast(user_id as char(36)) as user_id'), 'created'
            )
            .where('user_id', userId) 
    },
    createPost(postData) {
        if(!postData.id) {
            postData.id = uuid()
        }
        return db(tableName).insert(postData)
    }
}
module.exports = PostModel