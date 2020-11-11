import database from '../src/models';

class PointService {
  static async getAllPoints() {
    try {
      return await database.Point.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async addPoint(newPoint, options={}) {
    try {
      return await database.Point.create(newPoint, options);
    } catch (error) {
      throw error;
    }
  }

  static async updatePoint(id, updatePoint) {
    try {
      const PointToUpdate = await database.Point.findOne({
        where: { id: Number(id) }
      });

      if (PointToUpdate) {
        await database.Point.update(updatePoint, { where: { id: Number(id) } });

        return updatePoint;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async getAPoint(id) {
    try {
      const thePoint = await database.Point.findOne({
        where: { id: Number(id) }
      });

      return thePoint;
    } catch (error) {
      throw error;
    }
  }

  static async deletePoint(id) {
    try {
      const PointToDelete = await database.Point.findOne({ where: { id: Number(id) } });

      if (PointToDelete) {
        const deletedPoint = await database.Point.destroy({
          where: { id: Number(id) }
        });
        return deletedPoint;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

export default PointService;