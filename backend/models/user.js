const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const validator = require('validator')

const { Schema } = mongoose;

const UserSchema = new Schema ({

    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'staff', 'admin'],
        required: true,
        default: "user"
    },
    image: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['enabled', 'disabled'],
        required: true,
        default: "enabled"
    },
    client: {
        type : String,
    },
    smsToken: {
        type: String,
        default: '',
    },
    smsNumberDev: {
        type: String,
        default: '',
    },
    // subscription: {
    //     type: String,
    //     enum: ['monthly', 'yearly'],
    //     required: false,
    //     default: "monthly"
    // },
    monthlySubscriptionLink: {
        type: String,
        required : false,
    },
    yearlySubscriptionLink: {
        type: String,
        required : false,
    },
    payments : [{
        type : mongoose.Types.ObjectId,
        ref: 'doctorPayment',
    }],
} , {timestamps: true})

UserSchema.statics.register = async function (email, password, firstName, lastName, phoneNumber) {

    // validate the email and password
    if(!email){
        throw Error('le champ email est obligatoire')
    }

    if(!password){
        throw Error('le champ mot de passe est obligatoire')
    }

    if(!phoneNumber){
        throw Error ('le champ numéro de téléphone est obligatoire')
    }

    if(!validator.isEmail(email)){
        throw Error("L'adresse e-mail saisie est invalide")
    }

    if(!validator.isStrongPassword(password)){
        throw Error ('Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.')
    }

    if(phoneNumber.length!==8){
        throw Error('le numéro de téléphone est invalide')
    }

    if(!firstName){
        throw Error ('le champ nom est obligatoire')
    }

    if(firstName.length > 255){
        throw Error('le nom est trés long')
    }

    if(firstName.length < 2){
        throw Error('le nom est trés court')
    }

    if(!lastName){
        throw Error ('le champ prénom est obligatoire')
    }

    if(lastName.length > 255){
        throw Error('le prénom est trés long')
    }

    if(lastName.length < 2){
        throw Error('le prénom est trés court')
    }

    const emailExists = await this.findOne({email})
    if(emailExists){
        throw Error ('Email existe déjà')
    }

    const phoneNumberExists = await this.findOne({ phoneNumber })
    
    if(phoneNumberExists){
        throw Error ('Numéro de téléphone existe déjà')
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await this.create({ 
            firstName: firstName, 
            lastName: lastName, 
            email: email, 
            password: hashedPassword, 
            phoneNumber: phoneNumber, 
        });
        return user;
    } catch (error) {
        throw Error(error)
    }
}

UserSchema.statics.login = async function (email, password) {
    try {
        if (!email) throw Error('le champ email est obligatoire')
        if (!password) throw Error('le champ mot de passe est obligatoire')
        const user = await this.findOne({ email: email })
        if (!user) throw Error('email est incorrecte')
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw Error('mot de passe incorrecte') 
        if (user.status === 'disabled') throw Error("utilisateur n'est pas autorisé")
        return user;
    } catch (error) {
        throw Error(error)
    }
}

module.exports = mongoose.model('User', UserSchema);