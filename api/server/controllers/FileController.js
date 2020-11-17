import https from "https";
import parse from "csv-parse";
import FileService from "../services/FileService";
import Util from "../utils/Utils";

const util = new Util();

/**
 * Controller to handle operations on File objects.
 */
class FileController {
  /**
   * Retieve all files stored in the database, without points.
   *
   * @param {Object} req The request object.
   * @param {Object} res The response object.
   */
  static async getAllFiles(req, res) {
    try {
      const allFiles = await FileService.getAllFiles();
      if (allFiles.length > 0) {
        util.setSuccess(200, "Files retrieved.", allFiles);
      } else {
        util.setSuccess(200, "No File found.");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  /**
   * Insert a new file in the database. A valid csv file url is required.
   * Return the inserted file or an error if the url is invalid or the file cannot be properly parsed.
   *
   * @param {Object} req The request object.
   * @param {Object} res The response object.
   */
  static async addFile(req, res) {
    if (!req.body.url) {
      util.setError(400, "Please provide complete details.");
      return util.send(res);
    }

    /**
     * Return a Promise to retrieve the csv file via https request.
     * The promise will resolve if the csv file be successfully parsed into the File object given,
     * or reject otherwise.
     *
     * @param {string} url The csv file url
     * @param {Object} file The File object to fill with the csv parsed data
     */
    async function retrieveCSV(url, file) {
      return new Promise((resolve, reject) => {
        const request = https.get(`https://${url}`, (response) => {
          if (response.statusCode !== 200) {
            reject(
              new Error(`Failed to get '${url}' (${response.statusCode})`)
            );
            return;
          }

          try {
            /**
             * Try to parse the file with csv-parse lib
             */
            const parser = parse((err, records) => {
              if (records) {
                for (const row of records) {
                  /**
                   * Try to read the first two columns of each row as Float values and ignore any extra data.
                   */
                  const lat = parseFloat(row[0]);
                  const lon = parseFloat(row[1]);

                  if (lat && lon) {
                    /**
                     * Create the Point object with the latitude and longitude read.
                     */
                    const point = {
                      geom: {
                        type: "Point",
                        coordinates: [lon, lat],
                      },
                    };
                    /**
                     * Insert the Point in the File onject.
                     */
                    file.points.push(point);
                  }
                }
              } else {
                reject(
                  new Error(
                    `The inserted file could not be processed: ${err.message}`
                  )
                );
                return;
              }

              resolve();
            });

            /**
             * Pipes the response stream to the csv parser.
             */
            response.pipe(parser);
          } catch (err) {
            reject(err);
            return;
          }

          response.on("error", () => {
            reject(err);
          });
        });

        request.on("error", (err) => {
          reject(err);
        });

        request.end();
      });
    }

    /**
     * The csv file url sent in the request
     */
    const url = req.body.url;

    /**
     * New File to be inserted in the database
     */
    const newFile = {
      filename: url,
      points: [],
    };

    try {
      /**
       * Wait until the file is retrieved via https request
       */
      await retrieveCSV(url, newFile);

      /**
       * If Promise is resolved, insert the File with the retrieved Points into the database
       */
      var createdFile = await FileService.addFile(newFile);
      util.setSuccess(201, "File Added!", createdFile);
      return util.send(res);
    } catch (error) {
      /**
       * If Promise is rejected, send an error in the response
       */
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  /**
   * Retrieve an eager loaded file with the given ID.
   *
   * @param {Object} req The request object.
   * @param {Object} res The response object.
   */
  static async getAFile(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, "Please input a valid numeric value.");
      return util.send(res);
    }

    try {
      const theFile = await FileService.getAFile(id);

      if (!theFile) {
        util.setError(404, `Cannot find File with the id ${id}.`);
      } else {
        util.setSuccess(200, "Found File.", theFile);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  /**
   * Delete a file and all its related points with the given ID.
   *
   * @param {Object} req The request object.
   * @param {Object} res The response object.
   */
  static async deleteFile(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, "Please provide a numeric value.");
      return util.send(res);
    }

    try {
      const FileToDelete = await FileService.deleteFile(id);

      if (FileToDelete) {
        util.setSuccess(200, "File deleted.");
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
