const express = require('express');
const conn = require('./connection');

const app = express();

app.use(express.json());

conn.connect((err)=> {
    if(err){
        throw err;       
    }
});

app.get('/create_db', (req,res) => {    

    let sql = "CREATE TABLE IF NOT EXISTS users(\
        id INT PRIMARY KEY AUTO_INCREMENT,\
        usename VARCHAR(50) NOT NULL UNIQUE\
        )";

    conn.query(sql,(err,result) =>{
        if(err){
            return res.json({
                error : err
            }); 
            return res.json({
                rows: result
            });
        }        
    });
});

app.post('/users', (req,res) => {
    let user  = { 
        usename: req.body.username
    };
    
    conn.query("INSERT INTO users SET ?",user,(err,rows) => {
        if(err){
            return res.json({
                error : err
            }); 
        }

        res.json({
            id: rows.insertId,
            username: req.body.username
        });
    });   
});

app.get('/users',(request,response) => {   

    let sql = 'SELECT * FROM users';

    conn.query(sql,(err,rows) => {
        if(err){
            return response.json({
                error : err
            }); 
        }

        response.json({
            users: rows
        });        
    });
});

app.get("/users/:id", (request,response) => {
    let id = request.params.id;
    
    conn.query('SELECT * FROM users WHERE id= ?',[id], (err,rows,fields) => {
        if(err){
            return response.json({
                error : err
            }); 
        }

        return response.json({
            user: rows
        });
    });
});

app.put('/users', (request,response) => {

});

app.delete('/users/:id', (request, response) => {
    let id = request.params.id;

    conn.query('DELETE FROM users WHERE id = ?',[id], (err, rows) => {
        if(err){
            return response.json({
                error : err
            }); 
        }

        return response.json(rows);
        
    });
});


app.listen(3000,()=> {
    console.log('connected on port 3000...');
});