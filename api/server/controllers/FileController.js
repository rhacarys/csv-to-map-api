import https from 'https';
import parse from 'csv-parse';
import FileService from '../services/FileService';
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
  
    async function retrieveCSV(url, file) {
      return new Promise((resolve, reject) => {

        const request = https.get(`https://${url}`, response => {
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
            return;
          }

          try{
            const parser = parse( (err, records) => {
              for (const row of records) {
                const lat = parseFloat(row[0]);
                const lon = parseFloat(row[1]);

                if (lat && lon) {
                  const point = {
                    geom: {
                      type: 'Point', coordinates: [lon, lat]
                    }
                  }
                  file.points.push(point);
                }
              }

              console.log('CSV file processed');
              resolve();
            });

            response.pipe(parser);

          } catch (err) {
            reject(err);
          }
          
          response.on('error', () => {
            reject(err);
          });
        });

        request.on('error', err => {
          reject(err);
        });

        request.end();
      });
    }

    const url = req.body.url;
    const newFile = {
      filename: url,
      points: []
    }

    try {
      console.log(`Retrieving file on ${url}`);
      await retrieveCSV(url, newFile);

      var createdFile = await FileService.addFile(newFile);
      util.setSuccess(201, 'File Added!', createdFile);
      return util.send(res);

    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
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