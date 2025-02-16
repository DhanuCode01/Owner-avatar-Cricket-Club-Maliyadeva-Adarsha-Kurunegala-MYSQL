import dotenv from "dotenv"
import jwt  from "jsonwebtoken"; 
import bcrypt from "bcrypt";
import pool from "../db.js"; // Import MySQL database connection


dotenv.config();


export async function requestUser(req, res) {
    const { email, password, type, firstName, lastName, address, phone, Team, profilePicture } = req.body;

    try {
        // Hash the password before saving to the database
        const hashedPassword = bcrypt.hashSync(password, 10);

        // SQL Query
        const sql = `INSERT INTO users (email, password, type, firstName, lastName, address, phone, Team, profilePicture) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            email,
            hashedPassword, // Store hashed password
            type || "student", // Default value
            firstName,
            lastName,
            address,
            phone,
            Team || null, // Optional
            profilePicture || "https://cdn.vectorstock.com/i/1000v/92/16/default-profile-picture-avatar-user-icon-vector-46389216.jpg"
        ];

        // Execute query
        const [result] = await pool.execute(sql, values);

        res.status(200).json({
            message: "User Saved Successfully",
            userId: result.insertId, // Return inserted user ID
        });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "User Save Unsuccessful" });
    }
}







export async function LoginUser(req, res) {
    const { email, password } = req.body;

    try {
        // Query the database for the user by email
        const sql = "SELECT * FROM users WHERE email = ?";
        const [rows] = await pool.execute(sql, [email]);

        // Check if the user exists
        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = rows[0]; // Get the first (and only) user

        // Compare the provided password with the hashed password in the database
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);

        if (isPasswordCorrect) {
            // Generate JWT token with user details
            const token = jwt.sign(
                {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    type: user.type,
                    profilePicture: user.profilePicture,
                    phone: user.phone
                },
                process.env.JWT_SECRET, // Make sure this is set in your .env file
                { expiresIn: "2h" } // Token expires in 2 hours
            );

            res.json({ success: "Login Successfully", token: token });

        } else {
            res.status(401).json({ error: "Incorrect password" });
        }

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database connection unsuccessful" });
    }
}

