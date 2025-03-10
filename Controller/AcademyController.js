import dotenv from "dotenv"
import jwt  from "jsonwebtoken"; 
import bcrypt from "bcrypt";
import pool from "../db.js"; // Import MySQL database connection


dotenv.config();


export async function academyAdd(req, res) {
    const {AcademyName,Address,RegistrationNo,Telephone,Logo, email, password,} = req.body;

    try {
        // Hash the password before saving to the database
        const hashedPassword = bcrypt.hashSync(password, 10);

        // SQL Query
        const sql = `INSERT INTO academy_info( academy_name,address,registration_no,telephone,logo, email, password) 
                     VALUES ( ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            
            AcademyName,
            Address,
            RegistrationNo,
            Telephone,
            Logo,
            email,
            hashedPassword, // Store hashed password
        ];

        // Execute query
         await pool.execute(sql, values);

        res.status(200).json({
            message: "Academy Saved Successfully",
             // Return inserted Academy ID
        });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Academy Save Unsuccessful" });
    }
}


export async function academyLogin(req, res) {
    const { email, password } = req.body;
    

    try {
        // Query the database for the Academy by email
        const sql = "SELECT * FROM academy_info WHERE email = ?";
        const [rows] = await pool.execute(sql, [email]);

        // Check if the Academy exists
        if (rows.length === 0) {
            return res.status(404).json({ error: "Incorrect email or password" });
        }

        const user = rows[0]; // Get the first (and only) Academy

        // Compare the provided password with the hashed password in the database
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);

        if (isPasswordCorrect) {
            // Generate JWT token with user details
            const token = jwt.sign(
                {
                    AcademyId: user.academy_id,
                    AcademyName: user.academy_name,
                    RegistrationNo :user.registration_no,
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


/* //All update one time
export async function updateAcademy(req,res) {
    const {AcademyName,Address,RegistrationNo,Telephone,Logo}=req.body;
    const {email}= req.user;
        
        try {
                
            
          // Query the database for the Academy by email
        const sql = "SELECT * FROM academy_info WHERE email = ?";
        const [rows] = await pool.execute(sql, [email]);

        // Check if the Academy exists
        if (rows.length === 0) {
            return res.status(404).json({ error: "Incorrect email or password" });
        }

         
                      
                    // Update the fee in the payment record
                    const sql1 = `UPDATE academy_info 
                                        SET academy_name = ?, 
                                            address = ?, 
                                            registration_no = ?, 
                                            telephone = ?, 
                                            logo = ? 
                                            WHERE email = ?`;
                    await pool.execute(sql1, [AcademyName, Address, RegistrationNo, Telephone, Logo, email]);

                    res.status(200).json({ message: "update Successfully" });


                    return

                                                    
        }catch(error){ 
             console.log(error)                                                     //If the lines are not running, it is a connection error.
             res.status(500).json({
             error:"database connection unsuccessfully"})
             }
} */






//To update only one

export async function updateAcademy(req, res) {
    const { AcademyName, Address, RegistrationNo, Telephone, Logo } = req.body;
    const { email } = req.user;

    try {
        // Check if the academy exists
        const sql = "SELECT * FROM academy_info WHERE email = ?";
        const [rows] = await pool.execute(sql, [email]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Incorrect email or password" });
        }

        // Build the UPDATE query dynamically
        let updateFields = [];
        let values = [];

        if (AcademyName) {
            updateFields.push("academy_name = ?");
            values.push(AcademyName);
        }
        if (Address) {
            updateFields.push("address = ?");
            values.push(Address);
        }
        if (RegistrationNo) {
            updateFields.push("registration_no = ?");
            values.push(RegistrationNo);
        }
        if (Telephone) {
            updateFields.push("telephone = ?");
            values.push(Telephone);
        }
        if (Logo) {
            updateFields.push("logo = ?");
            values.push(Logo);
        }

        // If no fields to update, return early
        if (updateFields.length === 0) {
            return res.status(400).json({ error: "No fields to update" });
        }

        // Construct final query
        const sql1 = `UPDATE academy_info SET ${updateFields.join(", ")} WHERE email = ?`;
        values.push(email);

        await pool.execute(sql1, values);

        res.status(200).json({ message: "Updated successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Database connection unsuccessful" });
    }
} 


