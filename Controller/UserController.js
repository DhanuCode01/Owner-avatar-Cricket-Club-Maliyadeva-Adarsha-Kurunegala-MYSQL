import dotenv from "dotenv"
import jwt  from "jsonwebtoken"; 
import bcrypt from "bcrypt";
import pool from "../db.js"; // Import MySQL database connection


dotenv.config();


export async function requestCoach(req, res) {
    const {coachName,Experience,Address,Mobile1,Mobile2,CoachSalary,IsActive, email, password,} = req.body;

    try {
        // Hash the password before saving to the database
        const hashedPassword = bcrypt.hashSync(password, 10);

        // SQL Query
        const sql = `INSERT INTO coaches( coach_name,experience,address,mobile1,mobile2,coach_salary,is_active, email, password) 
                     VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            
            coachName,
            Experience,
            Address,
            Mobile1,
            Mobile2,
            CoachSalary,
            IsActive,
            email,
            hashedPassword, // Store hashed password
        ];

        // Execute query
         await pool.execute(sql, values);

        res.status(200).json({
            message: "User Saved Successfully",
             // Return inserted user ID
        });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "User Save Unsuccessful" });
    }
}







export async function LoginCoach(req, res) {
    const { email, password } = req.body;
    

    try {
        // Query the database for the user by email
        const sql = "SELECT * FROM coaches WHERE email = ?";
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
                    email: user.email,
                    password:user.password
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

            const {email,password}= req.user;
        

          // Query the database for the user by email
          const sql = "SELECT * FROM academy_info WHERE email = ?";
          
          const [rows] = await pool.execute(sql, [email]);

          //const user = rows[0]; // Get the first (and only) user
        
       
          // Check if the user exists
          if (rows.length != 0) {

          
        
                    const { email, password,collectorName,assignedTeamId,Address,Telephone,Mobile,isActive} = req.body;
                
                    try {
                                //Is there a collection_team like this?
                                const sql1 = "SELECT * FROM collection_teams WHERE collection_team_id = ?";
                                const [rows] = await pool.execute(sql1, [assignedTeamId]);

                                if((rows.length === 0)){
                                    return res.status(404).json({ error: "check Assigned_Team_Id and try again " });
                                }

                                
                                            // Hash the password before saving to the database
                                            const hashedPassword = bcrypt.hashSync(password, 10);
                                    
                                            // SQL Query
                                            const sql = `INSERT INTO collectors( NAME, assigned_team_id, address, telephone, mobile, is_active, email, password) 
                                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

                                    
                                            const values = [
                                                
                                                collectorName,
                                                assignedTeamId,
                                                Address,
                                                Telephone,
                                                Mobile,
                                                isActive,
                                                email,
                                                hashedPassword, // Store hashed password
                                            ];


                                            
                                    
                                            // Execute query
                                            await pool.execute(sql, values);
                                    
                                            res.status(200).json({
                                                message: "User Saved Successfully",
                                                 // Return inserted user ID
                                            });

                                            return
                
                    } catch (error) {
                        console.error("Database error:", error);
                        res.status(500).json({ error: "User Save Unsuccessful" });
                        return
                    } 

            
                

    }else{
        res.status(406).json({
            Message:"your are not authorized to perform this acction"   
        })  
    } 
}





export async function LoginCollector(req, res) {
    const { email, password } = req.body;
    

    try {
        // Query the database for the user by email
        const sql = "SELECT * FROM collectors WHERE email = ?";
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
                    coachId: user.collector_id,
                    coachName: user.NAME,
                    email: user.email,
                    password:user.password
                },
                process.env.JWT_SECRET, // Make sure this is set in your .env file
                { expiresIn: "2h" } // Token expires in 2 hours
            );

            res.json({ success: "Login Successfully", token: token });
            return

        } else {
            res.status(401).json({ error: "Incorrect password" });
            return
        }

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database connection unsuccessful" });
    }
}