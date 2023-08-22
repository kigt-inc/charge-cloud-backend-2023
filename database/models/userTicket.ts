import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { UserTicketsModel } from "../../types/userTicket";

const UserTicket = sequelize.define<UserTicketsModel>(
  "user_tickets",
  {
    user_ticket_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    ticket_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
  },
  {
    tableName: "user_tickets",
    paranoid: true,
    timestamps: true,
  }
);

export default UserTicket;
