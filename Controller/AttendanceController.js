import pool from "../db.js"; // Import MySQL database connection

export async function getTeamStudent(req,res) {

    const TeamName= req.params.TeamName;
    const {email}= req.user;
        
        try {
                
            
          // Query the database for the user by email
          const sql = "SELECT * FROM collectors WHERE email = ?";
          const [rows] = await pool.execute(sql, [email]);
            

                    if (rows.length != 0  ) {          //check  authorization 

                                const sql=`SELECT s.student_id, s.NAME, s.age, s.gender, s.age_group, s.address, s.mobile_no, s.home_telephone_no, s.nic, s.is_active
                                            FROM students s
                                            JOIN team_student ts ON s.student_id = ts.student_id
                                            JOIN teams t ON ts.team_id = t.team_id
                                            WHERE t.team_name = ?;
                                                `;

                                const [rows]=await pool.execute(sql,[TeamName]);
                                

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
          const sql = "SELECT * FROM collectors WHERE email = ?";
          const [rows] = await pool.execute(sql, [email]);
            

                    if (rows.length != 0  ) {          //check  authorization 

                                // Insert each attendance record one by one
                                    for (const record of attendanceData) {
                                        const { StudentId, Status } = record;

                                        const insertSql = `INSERT INTO attendance (student_id, STATUS) VALUES (?, ?)`;
                                        await pool.execute(insertSql, [StudentId, Status]);
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
          const sql = "SELECT * FROM collectors WHERE email = ?";
          const [rows] = await pool.execute(sql, [email]);
          
            

                    if (rows.length != 0  ) {          //check  authorization

                                const sql=`SELECT a.attendance_id, s.NAME, a.attend_time, a.STATUS
                                            FROM attendance a
                                            JOIN students s ON a.student_id = s.student_id
                                            JOIN team_student ts ON s.student_id = ts.student_id
                                            JOIN teams t ON ts.team_id = t.team_id
                                            WHERE t.team_name = ? AND  (a.attend_time) = ?;
                                            `;
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

