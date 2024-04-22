import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "A keresztnév megadása kötelező!"],
        trim: true,
        maxlength: [100, "A keresztnév nem lehet több mint 100 karakter"]
    },
    lastName: {
        type: String,
        required: [true, "A vezetéknév megadása kötelező!"],
        trim: true,
        maxlength: [100, "A vezetéknév nem lehet több mint 100 karakter"]
    },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, 'Érvényes email cím megadása kötelező!'],
        required: [true, "Az email megadása kötelező!"],
        unique: [true, "Ezzel az email címmel már regisztráltak egy fiókot!"],
        trim: true
    },
    role: {
        type: String,
        enum: ["user", "publisher"], // admin-t csak kézzel lehet beállítani!
        default: "user"
    },
    password: {
        type: String,
        required: [true, "A jelszó megadása kötelező!"],
        minlength: 8,
        select: false // nem adja vissza lekéréseknél
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const UserModel = mongoose.model("UserModel", UserSchema, "users");

export default UserModel;