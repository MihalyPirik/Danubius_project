import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A név megadása kötelező!'],
        trim: true,
        maxlength: [100, 'A név nem lehet több mint 100 karakter']
    },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, 'Érvényes email cím megadása kötelező!'],
        required: [true, 'Az email megadása kötelező!'],
        unique: [true, 'Ezzel az email címmel már regisztráltak egy fiókot!'],
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'publisher'], // admin-t csak kézzel lehet beállítani!
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'A jelszó megadása kötelező!'],
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

// A jelszó titkosítása
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const UserModel = mongoose.model('UserModel', UserSchema, 'users');

export default UserModel;