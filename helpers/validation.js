const { User } = require("../models/user")


exports.emailValidation= (email)  => {
    return String(email).toLocaleLowerCase().match(/^([a-z\d\.-]+)@([a,z\d-]+)\.([a-z]{2,12})(\.[a,z]{2,12})?$/)
}

exports.textValidation = (text,min,max) => {
    if(text.length > max ||text.length < min){
        return false
    }
    return true
}

exports.createUsername =async(username) => {
    let a= false;

    do{
        const userDB = await User.findOne({username});

        if(userDB){
            username += String(+ new Date() * Math.random()).toString().substring(0,1);
            a = true;
        }else {
            a = false;
        }
    }while(a);

    return username;
}

