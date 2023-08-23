//add all the models assosiations

export const relations = {
  associateRelationships: (Models: any) => {
    Models.Role.hasMany(Models.UserRole, {
      foreignKey: "role_id",
    });

    Models.UserRole.belongsTo(Models.Role, {
      foreignKey: "role_id",
      sourceKey: "role_id",
    });

    Models.User.hasMany(Models.UserRole, {
      foreignKey: "user_id",
    });

    Models.UserRole.belongsTo(Models.User, {
      foreignKey: "user_id",
      sourceKey: "user_id",
    });

    Models.Location.hasMany(Models.ChargeStation, {
      foreignKey: "location_id",
      as: "chargeStations",
    });

    Models.ChargeStation.belongsTo(Models.Location, {
      foreignKey: "location_id",
      sourceKey: "location_id",
    });

    Models.Client.hasMany(Models.Location, {
      foreignKey: "client_id",
    });

    Models.Location.belongsTo(Models.Client, {
      foreignKey: "client_id",
      sourceKey: "client_id",
    });

    Models.User.hasOne(Models.Client, {
      foreignKey: "user_id",
      as: "client",
    });

    Models.Client.hasOne(Models.User, {
      foreignKey: "user_id",
      sourceKey: "user_id",
      as: "user"
    });
    return Models;
  },
};
