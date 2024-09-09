import mongoose from 'mongoose';
import validator from 'validator';

const authSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    minlength: [8, 'Full name must be at least 8 characters long']
  },
  idNumber: {
    type: Number,
    required: [true, 'ID number is required'],
    validate: {
      validator: function(value) {
        return /^[0-9]{4,}$/.test(value);
      },
      message: 'ID number must be at least 4 digits long and contain only numbers'
    }
  },
  birthdate: {
    type: Date,
    required: [true, 'Birthdate is required'],
    validate: {
      validator: function(value) {
        return value && new Date(value) <= new Date(new Date().setFullYear(new Date().getFullYear() - 18));
      },
      message: 'You must be at least 18 years old'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: function(value) {
        return validator.isEmail(value);
      },
      message: 'Invalid email address'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    validate: {
      validator: function(value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/.test(value);
      },
      message: 'Password must contain at least 10 characters, including one lowercase letter, one uppercase letter, one number, and one special character'
    }
  }
});

export default mongoose.model('Auth', authSchema);
