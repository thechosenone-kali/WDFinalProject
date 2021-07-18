const db = require('./db')
const { uuid } = require('uuidv4')
const tableName = 'users'
const UserModel = {
    // SELECT * FROM users;
    getAllUsers() {
        return db(tableName)
            .select(
                db.raw('cast(id as char(36)) as id'), 'username', 'name', 'gender'
            )
    },
    // SELECT * FROM users WHERE username = $username;
    findUserByUsername(username) {
        return db(tableName)
            .select(
                db.raw('cast(id as char(36)) as id'), 'username', 'password', 'name', 'gender'
            )
            .first()
            .where('username', username) 
    },
    getUserById(id) {
        return db(tableName)
        .select(
            db.raw('cast(id as char(36)) as id'), 'username', 'name', 'gender'
        )
        .first()
        .where('id', id) 
    },
    insertUser(inputData) {
        if(inputData) {
            inputData.id = uuid()
        }
        return db(tableName)
            .insert(inputData)
    },
    updateUser(data, userId) {
        return db(tableName)
            .update(data)
            .where('id', userId)
    },
    delUser(id) {
        return db(tableName).where('id', id).del()
    }
}
module.exports = UserModel