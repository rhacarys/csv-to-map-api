export default (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  File.associate = (models) => {
    File.hasMany(models.Point, {
      as: 'points',
      onDelete: 'cascade',
      hooks: true
    });
  };

  return File;
};
