var SQLiteClient = require('./SQLiteClient');
const bcrypt = require("bcryptjs");
const Validator = require("validator");
const isEmpty = require("is-empty");

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

const ValidateTableInput = function validateTableInput(data) {
    let errors = {};
    data.user_id = !isEmpty(data.user_id) ? data.user_id : "";
    data.username = !isEmpty(data.username) ? data.username : "";
    data.first_name = !isEmpty(data.first_name) ? data.first_name : "";
    data.middle_name = !isEmpty(data.middle_name) ? data.middle_name : "";
    data.last_name = !isEmpty(data.last_name) ? data.last_name : "";
    data.password_sha256 = !isEmpty(data.password_sha256) ? data.password_sha256 : "";
    data.email_id = !isEmpty(data.email_id) ? data.email_id : "";
    data.roles = !isEmpty(data.roles) ? data.roles : "";
    data.gender = !isEmpty(data.gender) ? data.gender : "";
    data.birth_date = !isEmpty(data.birth_date) ? data.birth_date : "";

    if (Validator.isEmpty(data.user_id)) {
        errors.user_id = "user_id is required";
    }

    if (Validator.isEmpty(data.first_name)) {
        errors.first_name = "first_name is required";
    }

    if (Validator.isEmpty(data.last_name)) {
        errors.last_name = "last_name is required";
    }

    if (Validator.isEmpty(data.password_sha256)) {
      errors.password_sha256 = "Password field is required";
    }
    else if (!Validator.isLength(data.password_sha256, { min: 10, max: 10 })) {
      errors.password_sha256 = "Password must be atleast 6 character long";
    }
    
    if (Validator.isEmpty(data.email_id)) {
      errors.email_id = "Email field is required";
    } 
    else if (!Validator.isEmail(data.email_id)) {
      errors.email_id = "Email is invalid";
    }
    else if (!(/^[a-z]+\.+[0-9]+@iitj.ac.in$/).test(data.email_id))
    {
      errors.email_id = "use IITJ email"
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  };
class SQLiteClient{
	insertIntoTable(EntityObject){
		const { errors, isValid } = ValidateTableInput(EntityObject);
    	if (!isValid) {
      	  //handle error request here
      	  console.log(errors)
    	}
    	bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(EntityObject.password, salt, (err, hash) => {
            if (err) throw err;
            EntityObject.password = hash;
            SQLiteClient.insertIntoTable('users', EntityObject);
          });
        });
	}
	getFromTaable(selector_column, value)
	{
		SQLiteClient.getFromTaable('users', selector_column, value);
	}
}
