import pool from "../db.js"; // Import MySQL database connection

export async function addPayment(req,res) {

    const {StudentId,fee,collectorId} = req.body;
    const {email}= req.user;
        
        try {
                
            
          // Query the database for the user by email
          const sql = "SELECT * FROM collector WHERE email = ?";
          const [rows] = await pool.execute(sql, [email]);
            

                    if (rows.length != 0 && collectorId == rows[0].collector_id ) {       //Checking whether the collector of the token is the same as the collector of the body    
                                   
                                    const sql = "SELECT * FROM student WHERE student_id = ?";           //get student in student database
                                    const [rows] = await pool.execute(sql, [StudentId]);
                                    const sql1 = "SELECT * FROM payment WHERE student_id = ?";          //get student in payment database 
                                    const [rows1] = await pool.execute(sql1, [StudentId]);


                                    if(rows.length != 0 && rows1.length == 0 ){      //Checking if a student is present
                                                    
                                                    const sql=`INSERT INTO payment(student_id,fee,collector_id) VALUES (?, ?, ?) `;
                                                    const values = [StudentId,fee,collectorId];
                                                    await pool.execute(sql, values); 

                                                    res.status(200).json({ message: "saved successfully"})

                                                    
                                    }else{
                                        res.status(401).json({
                                            Message:"check your student......."   
                                            }) 
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