const fs = require('fs');
const { validationResult } = require('express-validator');
const VcCapture = require('../models/VcCapture'); // Replace with the path to your VcCapture model file

exports.fetchTraffic = (req, res) => {
  const vResult = validationResult(req);
  const hasErrors = !vResult.isEmpty();
  if (hasErrors) {
    return res.status(402).json(vResult.errors);
  }

  const logFilePath = '/var/log/apache2/access.log'; // Update with the actual path to your Apache access log file

  fs.readFile(logFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      return res.json({
        status: 'Error',
        error: err,
        code: 1,
        message: `Failed to read Apache access log file`,
      });
    }

    const logLines = data.trim().split('\n');
    const trafficData = {
      totalRequests: logLines.length,
      uniqueIPs: new Set(logLines.map(line => line.split ')[0size,
       // Save data to database
    const capture = new VcCapture(trafficData);
    capture.save()
      .then(savedCapture => {
        return res.json({
          status: 'Success',
          error: null,
          code: 0,
          info: savedCapture,
          message: 'Fetched Traffic Successfully',
        });
      })
      .catch(error => {
        console.error('Error saving capture:', error);
        return res.json({
          status: 'Error',
          error,
          code: 1,
          message: 'Failed to save capture',
        });
      });
  });
};
