const SQLiteClient = require('./SQLiteClient');
const client = new SQLiteClient('./auth.db');


//users database 
/*
    user_id TEXT, 
    username TEXT, 
    first_name TEXT, 
    middle_name TEXT, 
    last_name TEXT, 
    password_sha256 TEXT, 
    email_id TEXT, 
    phone_no INTEGER, 
    roles TEXT, 
    gender TEXT, 
    birth_date TEXT
*/


class User{

    constructor(user_id , username , first_name , middle_name, last_name, 
        password_sha256 , email_id , 
        phone_no , roles, gender , birth_date){
        this.user_id = user_id;
        this.username = username;
        this.first_name  = first_name;
        this.middle_name = middle_name;
        this.last_name = last_name;
        this.password_sha256 = password_sha256;
        this.email_id = email_id;
        this.phone_no = phone_no;
        this.roles = roles;
        this.gender = gender;
        this.birth_date = birth_date; 
    }
    register() {
        
        client.insertIntoTable('users', this);
    }
    getClaim(){
                var obj = {};
            for(var i=0;i<arguments.length;i++)
                {   obj[arguments[i]] = this[arguments[i]]; }
        return obj;
    }
    static exist(username)
    {
        return new Promise((resolve, reject) => 
        {
            client.exist_user('users', 'username' , username)
            .then(exist => {return resolve(exist); })
            .catch(err => {return reject(err); });
        });
    }
    static assertlogin(username, password)
    {
        return new Promise((resolve, reject) => 
        {
            client.getFromTable('users' , 'username' , username)
                .then(res => 
                {
                    if(password === res.password_sha256)
                        return resolve(true);
                    else return resolve(false);
                })
                .catch (err => {
                    return reject(err);
                });
        });
    }
}


   /* const user = new User("abc" , "abc" , "abc" , "abc" , "abc", 
        "abc" , "abc" , 
        1111111111 , "abc" , "F" ,  "abc" );
    user.register();
    var obj =user.getClaim("username" , "password_sha256" ,"phone_no");
    console.log(obj);*/
    
