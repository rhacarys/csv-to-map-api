import database from '../src/models';

class FileService {
  static async getAllFiles() {
    try {
      return await database.File.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async addFile(newFile) {
    try {
      return await database.File.create(newFile);
    } catch (error) {
      throw error;
    }
  }

  static async updateFile(id, updateFile) {
    try {
      const FileToUpdate = await database.File.findOne({
        where: { id: Number(id) }
      });

      if (FileToUpdate) {
        await database.File.update(updateFile, { where: { id: Number(id) } });

        return updateFile;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async getAFile(id) {
    try {
      const theFile = await database.File.findOne({
        where: { id: Number(id) }
      });

      return theFile;
    } catch (error) {
      throw error;
    }
  }

  static async deleteFile(id) {
    try {
      const FileToDelete = await database.File.findOne({ where: { id: Number(id) } });

      if (FileToDelete) {
        const deletedFile = await database.File.destroy({
          where: { id: Number(id) }
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