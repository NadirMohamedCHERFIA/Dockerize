const express=require('express');
const mysql=require('mysql');
const cors=require('cors');
const mqtt=require('mqtt');
const { json } = require('express/lib/response');


//const connectWithREtry = () =>{
///Create connection 
const db=mysql.createConnection({
    host:"localhost",
    user:'root',
    password:'Cherfianadir2022@',
    database: 'iot_air_quality'
});
//connect
db.connect((err)=>{
    if(err){
        throw err;
        setTimeout(connectWithREtry,5000)
    }
    console.log('mysql connected ....');
});
//}
options={
    username:"iot_enst",
    password:"cherfianadir",
    clean:true}
var client = mqtt.connect("mqtt://localhost",options)
client.on("connect",function(){	
    console.log("mosquitto connected");
})
client.on("error",function(error){
    console.log("Can't connect" + error);
    process.exit(1)});
    var topic1="esp/jsonFormatedData1";
    var topic2="esp/jsonFormatedData2";
    console.log("subscribing t/o topic");
    client.subscribe(topic1,{qos:1});
    client.subscribe(topic2,{qos:1});
    var sql="";
    client.on('message',function(topic, message, packet){
        const jsonFormatedData=JSON.parse(message);
        sql +='INSERT INTO air_quality SET'+'temperature='+jsonFormatedData.temperature+',humidity='+jsonFormatedData.humidity+',altitude='+jsonFormatedData.altitude+',pressure='+jsonFormatedData.pressure+',PM10='+jsonFormatedData.PM10+',PM25='+jsonFormatedData.PM25+',PM100='+jsonFormatedData.PM100+
        ',P03um='+jsonFormatedData.P03um+',P05um='+jsonFormatedData.P05um+',P10um='+jsonFormatedData.P10um+',P25um='+jsonFormatedData.P25um+',P50um='+jsonFormatedData.P50um+',P100um='+jsonFormatedData.P100um;
        //console.log(sql)
        console.log("message is "+ message);
        console.log("topic is "+ topic);
    });
    client.on('message',function(topic, message, packet){
        const jsonFormatedData2=JSON.parse(message);
        sql +=',CO2='+jsonFormatedData2.CO2+',TVOC='+jsonFormatedData2.TVOC+',AIR_QUALITY='+jsonFormatedData2.AIR_QUALITY+',GAS_RESISTANCE='+jsonFormatedData2.GAS_RESISTANCE;
        //console.log(sql)
        console.log("message is "+ message);
        console.log("topic is "+ topic);
        db.query(sql,(err,result)=>{
            if(err) throw err;
            console.log(result);
        });
    });
 
//connectWithREtry();

const app = express();
app.use(cors({
    origin:'*',
}));
//db creation 
app.get('/createdb',(req,res)=>{
    let sql = 'CREATE DATABASE iot_air_quality';
    db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('database created .....');
    });
});
//db creation 
app.get('/createdb',(req,res)=>{
    let sql = 'CREATE DATABASE iot_air_quality';
    db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('database created .....');
    });
});
//create table
app.get('/createtable',(req,res)=>{
    let sql ='CREATE TABLE air_quality(id INT AUTO_INCREMENT PRIMARY KEY ,temperature VARCHAR(20),humidity VARCHAR(20),altitude VARCHAR(20),pressure VARCHAR(20),PM10 VARCHAR(20),PM25 VARCHAR(20),PM100 VARCHAR(20),P03um VARCHAR(20),P05um VARCHAR(20),P10um VARCHAR(20),P25um VARCHAR(20),P50um VARCHAR(20),P100um VARCHAR(20),CO2 VARCHAR(20),TVOC VARCHAR(20),AIR_QUALITY VARCHAR(20),GAS_RESISTANCE VARCHAR(20),TIME TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)';
    db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send("Tablecreated.....");
    });
});

//welcome route
app.get('/',(req,res)=>{
    res.send('<h1>!WELCOME TO YOUR DOCKER!!</h1>')
});
//inert data
app.get('/insert',(req,res)=>{
    //res.setHeader("Acces-Control-Allow-Origin","*");
    //console.log(req.query);
    let post=req.query;
    let sql ='INSERT INTO air_quality SET ?';
    db.query(sql,post,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(req.query);
    });

});
const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Server started on port :${port}`);
})

