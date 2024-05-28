module.exports={
    HOST:'localhost',
    USER:'root',
    PASSWORD:'Babish@1998',
    DB:'DigitalCard',
    dialect:'mysql',
    PORT:3306,
    db_schema:'DigitalCard',
    migrationStorag: "sequelize",
    seederStorage: "sequelize",


    pool:{
        max:5,
        min:0,
        acquire: 30000,
        idel:10000
    }
}


