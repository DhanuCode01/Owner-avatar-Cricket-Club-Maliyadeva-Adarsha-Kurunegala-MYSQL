/* const {email,password}= req.user;
        

          // Query the database for the user by email
          const sql = "SELECT * FROM coach WHERE email = ?";
          
          const [rows] = await pool.execute(sql, [email]);

          //const user = rows[0]; // Get the first (and only) user
        
          // Compare the provided password with the hashed password in the database
                             //const isPasswordCorrect = bcrypt.compareSync(password,user.password);
          // Check if the user exists
          if (rows.length != 0)  */