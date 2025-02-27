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


export async function markAttendance(req,res) {


    const attendanceData = req.body; 
    //const {Team,StudentId,Status}= req.body;
    const {email}= req.user;
        
        try {
                
            
          // Query the database for the user by email
          const sql = "SELECT * FROM collector WHERE email = ?";
          const [rows] = await pool.execute(sql, [email]);
            

                    if (rows.length != 0  ) {          //check  authorization 

                                // Insert each attendance record one by one
                                    for (const record of attendanceData) {
                                        const { StudentId, Status, Team } = record;

                                        const insertSql = `INSERT INTO attendance (student_id, status, team_code) VALUES (?, ?, ?)`;
                                        await pool.execute(insertSql, [StudentId, Status, Team]);
                                    }

                                    res.status(200).json({ message: "Attendance marked successfully" });

                                    return


                                /* const sql="SELECT * FROM student WHERE team_code = ?";
                                const [rows]=await pool.execute(sql,[Team]);
                                
                                let count=0;
                                let rowsLength=rows.length;

                                 while(count < rowsLength){
                                        
                                            const sql=`INSERT INTO attendance(student_id,status,team_code) VALUES (?, ?, ?) `;
                                            const values = [StudentId,Status,Team];
                                            await pool.execute(sql, values); 


                                        count=count+1;
                                }  */

                                
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

export async function getAttendance(req,res) {

    const {Team,Date}= req.body;
    const {email}= req.user;
        
        try {
                
            
          // Query the database for the user by email
          const sql = "SELECT * FROM collector WHERE email = ?";
          const [rows] = await pool.execute(sql, [email]);
          
            

                    if (rows.length != 0  ) {          //check  authorization

                                const sql="SELECT * FROM attendance WHERE team_code = ? AND DATE(attendance_datetime)  = ?";
                                const [rows]=await pool.execute(sql,[Team,Date]);
                                

                                res.status(200).json({
                                    message:rows
                                })

                                return
                        
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

