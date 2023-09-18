const fs = require('fs');
const superagent = require('superagent');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

exports.installWorker = (req, res) => {
  const vResult = validationResult(req);
  const hasErrors = !vResult.isEmpty();
  if (hasErrors) {
    return res.status(402).json(vResult.errors);
  }

  const scriptBase64 = req.body.script64;
  const cfEmail = req.body.cfEmail;
  const cfKey = req.body.cfKey;

  let scriptString;

  try {
    const buffer = Buffer.from(scriptBase64, 'base64');
    scriptString = buffer.toString('utf-8');
  } catch (e) {
    console.error('Error decoding base64 string:', e);

    return res.json({
      status: 'Error',
      error: 'Invalid Script',
      code: 1,
      message: "'Error decoding Worker Script:'",
    });
  }

  const cf = {
    scriptName: crypto.randomBytes(4).toString('hex'),
    script: scriptString,
    email: cfEmail,
    apiKey: cfKey,
  };

  addWorkerScript(cf, (err, workerUrl) => {
    if (err) {
      console.error(err.response);
      return res.json({
        status: 'Error',
        error: 'Add Script Error',
        code: 1,
        message: "'Error Uploading Worker Script, Is Your Account Valid?'",
      });
    }

    let userFileObj = JSON.parse(fs.readFileSync('./nkp/config/user.json'));
    userFileObj.CF_WORKER_URL = workerUrl;

    // Make configuration changes here
    userFileObj.myConfigProperty = 'myConfigValue';

    fs.writeFileSync('./nkp/config/user.json', JSON.stringify(userFileObj, '', 4));

    return res.json({
      status: 'Success',
      error: null,
      code: 0,
      message: 'Successfully Added Worker Script',
      info: { url: workerUrl },
    });
  });
};

exports.removeWorker = (req, res) => {
  let userFileObj = JSON.parse(fs.readFileSync('./nkp/config/user.json'));
  userFileObj.CF_WORKER_URL = '';

  // Make configuration changes here
  delete userFileObj.myConfigProperty;

  fs.writeFileSync('./nkp/config/user.json', JSON.stringify(userFileObj, '', 4));

  return res.json({
    status: 'Success',
    error: null,
    code: 0,
    message: 'Successfully Removed Cloudflare Worker Script',
    info: 'Deleted Cloudflare Worker',
  });
};

// Rest of the code remains the same
