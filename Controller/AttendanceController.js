import pool from "../db.js"; // Import MySQL database connection

export async function getTeamStudent(req,res) {

    const Team= req.params.TeamCode;
    const {email}= req.user;
        
        try {
                
            
          // Query the database for the user by email
          const sql = "SELECT * FROM collector WHERE email = ?";
          const [rows] = await pool.execute(sql, [email]);
            

                    if (rows.length != 0  ) {          //check  authorization 

                                const sql="SELECT * FROM student WHERE team_code = ?";
                                const [rows]=await pool.execute(sql,[Team]);
                                

                                res.status(200).json({
                                    message:rows
                                })
                        
                    }else{
                        res.status(406).json({
                        Message:"your are not authorized to perform this action"   
                        }) 

                        return
                    }
            }catch(error){ 
                console.log(error)                                                     //If the lines are not running, it is a connection error.
                res.status(500).json({
                error:"database connection unsuccessfully"})
            }             
    
}