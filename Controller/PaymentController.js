import pool from "../db.js"; // Import MySQL database connection

export async function addPayment(req,res) {

    const {StudentId,AmountCollected,collectorId,PaymentStatus,Year,Month,assignedTeamId} = req.body;
    const {email}= req.user;
        
        try {
                
            
          // Query the database for the user by email
          const sql = "SELECT * FROM collectors WHERE email = ?";
          const [rows] = await pool.execute(sql, [email]);
            

                    if (rows.length != 0 && collectorId == rows[0].collector_id ) {       //Checking whether the collector of the token is the same as the collector of the body    
                                   
                                    const sql = "SELECT * FROM students WHERE student_id = ?";           //get student in student database
                                    const [rows] = await pool.execute(sql, [StudentId]);
                                    const sql1 = "SELECT * FROM daily_collections WHERE student_id = ?";          //get student in payment database 
                                    const [rows1] = await pool.execute(sql1, [StudentId]);


                                    if(rows.length != 0 && rows1.length == 0 ){      //Checking if a student is present
                                                    
                                                    const sql=`INSERT INTO daily_collections(student_id,collector_id,amount_collected,payment_status,Year,month) VALUES (?, ?, ?, ?, ?, ?) `;
                                                    const values = [StudentId,collectorId,AmountCollected,PaymentStatus,Year,Month];
                                                    //  Update the monthly collection in `collection_teams`
                                                    const sql1 = `UPDATE collection_teams 
                                                                                    SET monthly_collection = monthly_collection + ?
                                                                                     WHERE collection_team_id = ? `;
                                                    await pool.execute(sql1, [AmountCollected, assignedTeamId]);
                                                    await pool.execute(sql, values); 

                                                    res.status(200).json({ message: "saved successfully"})

                                                    return

                                                    
                                    }else{
                                        res.status(401).json({
                                            Message:"check your student......."   
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


export async function searchPayment(req,res) {
    const Date=req.params.Date;
    const {email}= req.user;
        
        try {
                
            
          // Query the database for the user by email
          const sql = "SELECT * FROM collectors WHERE email = ?";
          const sql1 = "SELECT * FROM coaches WHERE email = ?";

          
          const [rows] = await pool.execute(sql, [email]);
          const [rows1] = await pool.execute(sql1, [email]);
        
         
                    if (rows.length != 0 || rows1.length != 0 ) {                //check  authorization

                        const sql = "SELECT * FROM daily_collections WHERE DATE(collected_time) = ?";
                        const [rows] = await pool.execute(sql, [Date]);

                        res.status(200).json({
                            Message:rows
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

export async function updatePayment(req,res) {
    /* const {StudentId,Year,Month,Amount}=req.body;
    const {email}= req.user;
        
        try {
                
            
          // Query the database for the user by email
          const sql = "SELECT * FROM collector WHERE email = ?";
          const sql1 = "SELECT * FROM coach WHERE email = ?";

          
          const [rows] = await pool.execute(sql, [email]);
          const [rows1] = await pool.execute(sql1, [email]);
        
         
                    if (rows.length != 0 || rows1.length != 0 ) {     //check  authorization

                        const sql =`SELECT * FROM payment WHERE student_id = ? AND payment_Year = ? AND payment_month = ?`;
                        const [rows] = await pool.execute(sql, [StudentId,Year,Month]);
                        let fee=rows[0].fee;                    //now paid amount

                                    if(rows.length != 0){       //Check if there is a student with this StudentId,Year,Month
                                                    fee=parseFloat(fee)+ parseFloat(Amount);       //calculate fee
                                                    if (fee <= 5000){
                                                                    // Update the fee in the payment record
                                                                    const sql = `UPDATE payment SET fee = 5000 WHERE student_id = ? AND payment_Year = ? AND payment_month = ?`;
                                                                    await pool.execute(sql, [StudentId,Year,Month]);

                                                                    res.status(200).json({ message: "Paid Successfully" });


                                                                    return

                                                        

                                                    }else{
                                                        res.status(402).json({
                                                            message:"Check Amount and try Again"
                                                        })

                                                        return
                                                    }


                                                  
                                    }else{
                                        res.status(401).json({
                                            message:"You have not paid any money."
                                        })

                                        return
                                    }



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
             } */
}
