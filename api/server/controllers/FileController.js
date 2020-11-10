import csv from 'csv-parse';
import https from 'https';
import FileService from '../services/FileService';
import PointService from '../services/PointService';
import Util from '../utils/Utils';

const util = new Util();

class FileController {
  static async getAllFiles(req, res) {
    try {
      const allFiles = await FileService.getAllFiles();
      if (allFiles.length > 0) {
        util.setSuccess(200, 'Files retrieved.', allFiles);
      } else {
        util.setSuccess(200, 'No File found.');
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async addFile(req, res) {
    if (!req.body.url) {
      util.setError(400, 'Please provide complete details.');
      return util.send(res);
    }

    const url = req.body.url;
    const newFile = {
      filename: url
    }

    try {
      var createdFile = await FileService.addFile(newFile);
      util.setSuccess(201, 'File Added!', createdFile);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
    
    try {
      console.log(`Retrieving file on ${url}`);

      https.get(`https://${url}`, response => {
        response.pipe(csv())
          .on('data', (row) => {

            try {
              const lat = parseFloat(row[0]);
              const lon = parseFloat(row[1]);

              if (lat && lon) {
                const point = {
                  coordinates: {
                    type: 'Point', coordinates: [lon, lat]
                  },
                  FileId: createdFile.id
                }

                console.log(point);
                
                (async () => {
                  try {
                    PointService.addPoint(point);
                  } catch (error) {
                    console.log(error);
                  }
                })();

              }
            } catch (e) { }
          })
          .on('end', () => {
            console.log('CSV file processed');
          });
      });
    } catch (error) {
      console.log(error);
    }

    return util.send(res);
  
  }

  static async getAFile(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value.');
      return util.send(res);
    }

    try {
      const theFile = await FileService.getAFile(id);

      if (!theFile) {
        util.setError(404, `Cannot find File with the id ${id}.`);
      } else {
        util.setSuccess(200, 'Found File.', theFile);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async deleteFile(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, 'Please provide a numeric value.');
      return util.send(res);
    }

    try {
      const FileToDelete = await FileService.deleteFile(id);

      if (FileToDelete) {
        util.setSuccess(200, 'File deleted.');
      } else {
        util.setError(404, `File with the id ${id} cannot be found.`);
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }
}

export default FileController;