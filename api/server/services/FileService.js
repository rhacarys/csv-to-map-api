import database from "../src/models";

/**
 * Service to handle File objects on the database
 */
class FileService {
  /**
   * Select all Files lazily.
   */
  static async getAllFiles() {
    try {
      return await database.File.findAll();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Insert a File into the database and return it.
   *
   * @param {File} newFile The File to insert into the database.
   */
  static async addFile(newFile) {
    try {
      return await database.File.create(newFile, {
        include: { model: database.Point, as: "points" },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Select a single File eagerly with the given ID.
   *
   * @param {Number} id The File ID.
   */
  static async getAFile(id) {
    try {
      const theFile = await database.File.findOne({
        where: { id: Number(id) },
        include: { model: database.Point, as: "points" },
      });

      return theFile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a File with the giver ID from the database and cascade to his associated Points.
   *
   * @param {Number} id The File ID.
   */
  static async deleteFile(id) {
    try {
      const FileToDelete = await database.File.findOne({
        where: { id: Number(id) },
      });

      if (FileToDelete) {
        const deletedFile = await database.File.destroy({
          where: { id: Number(id) },
        });
        return deletedFile;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

export default FileService;
