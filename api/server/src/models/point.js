export default (sequelize, DataTypes) => {
  const Point = sequelize.define('Point', {
    coordinates: {
      type: DataTypes.GEOMETRY,
      allowNull: false,
    },
  });
  
  Point.associate = (models) => {
    Point.belongsTo(models.File, {
      foreignKey: 'FileId',
      as: 'file',
    });
  };

  return Point;
}
