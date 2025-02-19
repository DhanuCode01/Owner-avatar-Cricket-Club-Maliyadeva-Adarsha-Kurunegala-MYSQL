import dotenv from "dotenv"
import jwt  from "jsonwebtoken"; 
import bcrypt from "bcrypt";
import pool from "../db.js"; // Import MySQL database connection


dotenv.config();


export async function requestUser(req, res) {
    const { email, password,coachId,coachName} = req.body;

    try {
        // Hash the password before saving to the database
        const hashedPassword = bcrypt.hashSync(password, 10);

        // SQL Query
        const sql = `INSERT INTO coach(coach_id, coach_name, email, password) 
                     VALUES (?, ?, ?, ?)`;

        const values = [
            coachId,
            coachName,
            email,
            hashedPassword, // Store hashed password
        ];

        // Execute query
         await pool.execute(sql, values);

        res.status(200).json({
            message: "User Saved Successfully",
            userId:coachId, // Return inserted user ID
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
        const sql = "SELECT * FROM coach WHERE email = ?";
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
                    coachId: user.coach_id,
                    coachName: user.coach_name,
                    email: user.email
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


export async function addcollector(req,res) {          //addnew collector
   
    //console.log(req.user);
   
    if(req.user.coachId != null){

        
                    const { email, password,collectorId,collectorName} = req.body;
                
                    try {
                        // Hash the password before saving to the database
                        const hashedPassword = bcrypt.hashSync(password, 10);
                
                        // SQL Query
                        const sql = `INSERT INTO collector(collector_id, collector_name, email, password) 
                                    VALUES (?, ?, ?, ?)`;
                
                        const values = [
                            collectorId,
                            collectorName,
                            email,
                            hashedPassword, // Store hashed password
                        ];
                
                        // Execute query
                        await pool.execute(sql, values);
                
                        res.status(200).json({
                            message: "User Saved Successfully",
                            userId:collectorId, // Return inserted user ID
                        });

                        return
                
                    } catch (error) {
                        console.error("Database error:", error);
                        res.status(500).json({ error: "User Save Unsuccessful" });
                    }

            
                

    }else{
        res.status(403).json({
            Message:"your are not authorized to perform this acction"   
        })  
    } 
}