import Amenities from "../model/Amenities.js";

export const getAllAmenities = async (req, res) => {
  try {
    const amenities = await Amenities.find();
    res.status(200).json(amenities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching amenities", error: error.message });
  }
};

export const createAmenities = async (req, res) => {
  try {
    const { name, description, fechaIngreso, estado } = req.body;
    if (!name || !description || !fechaIngreso || estado === undefined) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    const amenities = new Amenities(req.body);
    await amenities.save();
    res.status(201).json(amenities);
  } catch (error) {
    res.status(500).json({ message: "Error creating amenities", error: error.message });
  }
};

export const updateAmenities = async (req, res) => {
  try {
    const amenities = await Amenities.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!amenities) {
      return res.status(404).json({ message: "Amenities not found" });
    }
    res.json({ message: "Amenities updated successfully", amenities });
  } catch (error) {
    res.status(500).json({ message: "Error updating amenities", error: error.message });
  }
};

export const deleteAmenities = async (req, res) => {
  try {
    const amenities = await Amenities.findByIdAndDelete(req.params.id);
    if (!amenities) {
      return res.status(404).json({ message: "Amenities not found" });
    }
    res.json({ message: "Amenities deleted successfully", amenities });
  } catch (error) {
    res.status(500).json({ message: "Error deleting amenities", error: error.message });
  }
};

export const getAmenitiesById = async (req, res) => {
  try {
    const amenities = await Amenities.findById(req.params.id);
    if (!amenities) {
      return res.status(404).json({ message: "Amenities not found" });
    }
    res.json(amenities);
  } catch (error) {
    res.status(500).json({ message: "Error getting amenities", error: error.message });
  }
};