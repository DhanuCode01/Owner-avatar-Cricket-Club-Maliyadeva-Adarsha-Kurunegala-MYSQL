import pool from "../db.js"; // Import MySQL database connection


export async function addStudent(req,res) {

    const {StudentName, StudentId,ContactNo,Address,TeamCode,CoachId1,CoachId2} = req.body;
    const {email}= req.user;
        
        try {
                
            
          // Query the database for the user by email
          const sql = "SELECT * FROM collector WHERE email = ?";
          
          const [rows] = await pool.execute(sql, [email]);
        
         
                    if (rows.length != 0) {
                                            // Query the database for the user by team_name
                                            const sql = "SELECT * FROM team WHERE team_code = ?";        //Check if the team you entered is available
                                            const [rows] = await pool.execute(sql, [TeamCode]);

                                            if (rows.length != 0) {            

                                                        const sql1 = "SELECT * FROM coach WHERE coach_id = ?"; //Check if the coaches you entered is available
                                                        const [rows1] = await pool.execute(sql1, [CoachId1]);
                                                        const sql2 = "SELECT * FROM coach WHERE coach_id = ?";
                                                        const [rows2] = await pool.execute(sql2, [CoachId2]);
                                                        
                                                        if(rows1.length != 0  &&  rows2.length != 0){
                                                            
                                                                    try{
                                                                                      //enter data to student table
                                                                                    let sql = `INSERT INTO student(student_id, student_name, contact_no, address, team_code)VALUES (?, ?, ?, ?, ?)`;            // SQL Query
                                                                            
                                                                                    let values = [StudentId,StudentName,ContactNo,Address,TeamCode];
                                                                                    // Execute query
                                                                                    await pool.execute(sql, values); 
 


                                                                                        //enter data to student_coach table
                                                                                      sql=`INSERT INTO student_coach(student_id,coach_id) VALUES (?, ?) `;  // SQL Query
                                                                                      values=[StudentId,CoachId1];
                                                                                    await pool.execute(sql,values);  // Execute query

                                                                                        //enter data to student_coach table
                                                                                    sql=`INSERT INTO student_coach(student_id,coach_id) VALUES (?, ?) `;  // SQL Query
                                                                                    values=[StudentId,CoachId2];
                                                                                    await pool.execute(sql,values);  // Execute query
  

                                                                                    res.status(200).json({ message: "saved successfully" });

                                                                    }catch(error){ 
                                                                        console.log(error)                                                     //If the lines are not running, it is a connection error.
                                                                        res.status(500).json({
                                                                        error:"database connection unsuccessfully"})
                                                                        return
                                                                        }


                                                                
                                                        }else{
                                                            res.status(402).json({
                                                                Message:"check your coach......."   
                                                            })
                                                            return
                                                        }

                                            }else{
                                                res.status(401).json({
                                                    Message:"check your team......."   
                                                })
                                                return
                                            } 

                                }else{
                                     res.status(406).json({
                                        Message:"your are not authorized to perform this acction"   
                                      }) 
                                 }
                  
                    

        }catch(error){ 
                console.log(error)                                                     //If the lines are not running, it is a connection error.
                res.status(500).json({
                   error:"database connection unsuccessfully"})
                }
          

}


