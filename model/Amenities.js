import mongoose from "mongoose";

const amenitiesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'All amenities must have a name']
  },
  description: {
    type: String,
    minlength: [6, 'Description must be at least 6 characters'],
    required: [true, 'All amenities must have a description']
  },
  fechaIngreso: {
    type: Date,
    required: true,
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Amenities", amenitiesSchema);