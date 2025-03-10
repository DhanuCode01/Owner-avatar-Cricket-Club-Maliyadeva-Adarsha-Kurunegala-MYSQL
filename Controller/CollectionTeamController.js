import pool from "../db.js"; // Import MySQL database connection


export async function addteam(req,res) {

    const {teamName,monthly_collection} = req.body;
    const {email}= req.user;
        
        try {
                
            
          // Query the database for the user by email
          const sql = "SELECT * FROM academy_info WHERE email = ?";
          
          const [rows] = await pool.execute(sql, [email]);
        
         
                    if (rows.length != 0) {
                        const sql = `INSERT INTO collection_teams (team_name) VALUES (?)`;
                        const values = [teamName];

                        await pool.execute(sql, values);

                        res.status(200).json({ message: "Team saved successfully" });

                
                    }else{
                        res.status(500).json({
                            Message:"your are not authorized to perform this acction"   
                        })  
                    } 

        }catch(error){ 
                console.log(error)                                                     //If the lines are not running, it is a connection error.
                res.status(500).json({
                   error:"database connection unsuccessfully"})
                }
          

}