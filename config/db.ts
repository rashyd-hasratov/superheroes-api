import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('postgresql://postgres:m09MNSzXm0X6rhVsPRTe@containers-us-west-22.railway.app:6043/railway');

export const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testDbConnection();