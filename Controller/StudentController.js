import pool from "../db.js"; // Import MySQL database connection


export async function addStudent(req,res) {

    const {StudentId,StudentName,MobileNo,HomeTelephoneNo,Age,Gender,AgeGroup,NIC,isActive,Address,Team1Id,Team2Id,CoachId1,CoachId2} = req.body;
    const {email}= req.user;
        
        try {
                
            
          // Query the database for the user by email
          const sql = "SELECT * FROM collectors WHERE email = ?";
          
          const [rows] = await pool.execute(sql, [email]);
        
         
                    if (rows.length != 0) {
                                            // Query the database for the user by team_name
                                            const sql1 = "SELECT * FROM teams WHERE team_id = ?";        //Check if the team you entered is available
                                            const [rows1] = await pool.execute(sql1, [Team1Id]);
                                            const sql2 = "SELECT * FROM teams WHERE team_id = ?";        //Check if the team you entered is available
                                            const [rows2] = await pool.execute(sql2, [Team2Id]);

                                            if (rows1.length != 0  && rows2.length != 0 ) {            

                                                        const sql1 = "SELECT * FROM coaches WHERE coach_id = ?"; //Check if the coaches you entered is available
                                                        const [rows1] = await pool.execute(sql1, [CoachId1]);
                                                        const sql2 = "SELECT * FROM coaches WHERE coach_id = ?";
                                                        const [rows2] = await pool.execute(sql2, [CoachId2]);
                                                        
                                                        if(rows1.length != 0  &&  rows2.length != 0){   
                                                            
                                                                    try{
                                                                                      //enter data to student table
                                                                                    let sql = `INSERT INTO students(student_id, NAME, age, gender, age_group ,address ,mobile_no ,home_telephone_no ,nic ,is_active)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;            // SQL Query
                                                                            
                                                                                    let values = [StudentId,StudentName,Age,Gender,AgeGroup,Address,MobileNo,HomeTelephoneNo,NIC,isActive];
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


                                                                                        //enter data to team_student table
                                                                                        sql=`INSERT INTO team_student(team_id,student_id) VALUES (?, ?) `;  // SQL Query
                                                                                        values=[Team1Id,StudentId];
                                                                                      await pool.execute(sql,values);  // Execute query
  
                                                                                          //enter data to team_student table
                                                                                      sql=`INSERT INTO team_student(team_id,student_id) VALUES (?, ?) `;  // SQL Query
                                                                                      values=[Team2Id,StudentId];
                                                                                      await pool.execute(sql,values);  // Execute query
    
  
  

                                                                                    res.status(200).json({ message: "saved successfully" });
                                                                                    return

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
                                      return
                                 }
                  
                    

        }catch(error){ 
                console.log(error)                                                     //If the lines are not running, it is a connection error.
                res.status(500).json({
                   error:"database connection unsuccessfully"})
                }
          

}


export async function getStudent(req,res) {
    const studentId=req.params.SID;
    const {email}= req.user;
        
        try {
                
            
          // Query the database for the user by email
          const sql = "SELECT * FROM collectors WHERE email = ?";
          
          const [rows] = await pool.execute(sql, [email]);
        
         
                    if (rows.length != 0) {

                        const sql = `SELECT s.student_id, s.NAME, s.mobile_no, s.address, s.nic,c.coach_id, c.coach_name 
                                    FROM students s
                                    JOIN student_coach sc ON s.student_id = sc.student_id
                                    JOIN coaches c ON sc.coach_id = c.coach_id
                                    WHERE s.student_id = ?; `;
                         const [rows] = await pool.execute(sql, [studentId]);

                         res.status(200).json({
                            Message:rows   
                          })

                          return



                    }else{
                        res.status(406).json({
                           Message:"your are not authorized to perform this acction"   
                         }) 

                         return
                    }


             }catch(error){ 
                 console.log(error)                                                     //If the lines are not running, it is a connection error.
                 res.status(500).json({
                   error:"database connection unsuccessfully"})
                 }

    
}


