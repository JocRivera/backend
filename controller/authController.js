import Auth from "../model/Auth";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { fullName, idNumber, birthdate, email, password } = req.body;

  if (!fullName || !idNumber || !birthdate || !email || !password) {
    return res.status(400).json({ error: "All  fields are required" });
  }

  try {
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email  already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const newAuth = new Auth({
      fullName,
      idNumber,
      birthdate,
      email,
      password: passwordHash,
    });

    const authSaved = await newAuth.save();
    res.status(201).json(authSaved);
  } catch (error) {
    res.status(500).json({ error: "Error  creating user" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const user = await Auth.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generar token o manejar sesión aquí si es necesario
    // const token = generateToken(user); // Implementa tu función de generación de token

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Error logging in" });
  }
};

//recovery password
export const recoveryPassword = async (req, res) => {
  const { email } = req.body;

  try {
    res.json({ message: "Recovery email sent" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

//cambio de contraseña
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await Auth.findOne({ email: req.user.email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Error changing password" });
  }
};

//obtener el perfil
export const getProfile = async (req, res) => {
  try {
    const user = await Auth.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json({ error: "Error getting profile" });
  }
};

//actualizaer perfil
export const updateProfile = async (req, res) => {
    const { fullName, idNumber, birthdate, email } = req.body;
    
    if (!fullName || !idNumber || !birthdate || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
      const user = await Auth.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      if (email !== user.email) {
        const existingUser = await Auth.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: "Email already exists" });
        }
      }
  
      user.fullName = fullName;
      user.idNumber = idNumber;
      user.birthdate = birthdate;
      user.email = email;
  
      await user.save();
  
      res.json(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Error updating profile" });
    }
  };
  
