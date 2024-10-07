import {Sequelize} from 'sequelize';

//definindo o banco de dados
const sequelize =  new Sequelize('crudsimples', 'israel', '123', {
    host: 'localhost',
    dialect: 'mysql'
});

export default sequelize;
