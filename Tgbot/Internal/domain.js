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
  const cf = req.body.cfKey;

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

    let userFileObj = JSON.parse(fs.readFileSync('./PJBX/config/user.json'));
    userFileObj.CF_WORKER_URL = workerUrl;

    // Perform domain rewriting logic here
    // For example, you can update the Nginx configuration to include a server block for the custom domain

    // Save the updated user configuration file
    fs.writeFileSync('./PJBX/config/user.json', JSON.stringify(userFileObj, '', 4));

    return res.json({
      status: '',
      error: null,
     : 0,
      message: 'Successfully Added Worker Script',
      info: { url: workerUrl },
    });
  });
};

exports.removeWorker = (req, res) => {
  let userFileObj = JSON.parse(fs.readFileSync('./PJBX/config/user.json'));
  userFileObj.CF_WORKER_URL = '';

  // Perform domain rewriting logic here
  // For example, you can update the Nginx configuration to remove the server block for the custom domain

  // Save the updated user configuration file
  fs.writeFileSync('./PJBX/config/user.json', JSON.stringify(userFileObj, '', 4));

  return res.json({
    status: 'Success',
    error: null,
    code: 0,
    message: 'Successfully Removed Cloudflare Worker Script',
    info: 'Deleted Cloudflare Worker',
  });
};

exports.fetchDomains = (req, res) => {
  if (!fs.existsSync('./PJBX/config/ssl.json')) {
    console.error('SSL files not found, please rerun config');
    return res.json({
      status: 'Error',
      error: 'Failed to Find SSL Files',
      information: null,
      message: 'Failed to Find SSL Files',
    });
  }

  const sslFileObj = JSON.parse(fs.readFileSync('./PJBX/config/ssl.json'));
  const domainNameList = [];
  let redirectDomain;

  sslFileObj.forEach(sslInfo => {
    if (sslInfo.isRedirect) {
      redirectDomain = sslInfo.domain;
    }
    domainNameList.push(sslInfo.domain);
  });

  const domainInfo = {
    ip: process.env.HOST_IP,
    domains: domainNameList,
    redirect: redirectDomain,
  };

  return res.json({
    status: 'Success',
    error: null,
    code: 0,
    message: '',
 info: domainInfo,
  });
};

exports.addDomain = (req, res) => {
  const vResult = validationResult(req);
  const hasErrors = !vResult.isEmpty();
  if (hasErrors) {
    return res.status(402).json(vResult.errors);
  }
  let domainName = req.body.domain;
  domainName = domainName.toLowerCase();

  let sslFileObj = JSON.parse(fs.readFileSync('./PJBX/config/ssl.json'));
  for (var sslVar of sslFileObj) {
    if (domainName === sslVar.domain) {
      console.error('Domain already exists');
      return res.json({
        status: 'Error',
        error: 'Invalid Domain',
        code: 1,
        message: 'Domain already exists, please check the domain name...',
      });
    }
  }

  const domainData = {
    domain: domainName,
    cert: `/path/to/${domainName}.crt`,
    key: `/path/to/${domainName}.key`,
  };

  const bashExec = exec(`bash scripts/setup-ssl.sh ${domainName}`, function (err, stdout, stderr) {
    if (err) {
      console.error('Early Failure for domain');
    }
  });

  bashExec.on('exit', function (code) {
    console.log('Code is ' + code);

    if (code === 0) {
      sslFileObj.push(domainData);

      // Perform domain rewriting logic here
      // For example, you can update the Nginx configuration to include a server block for the custom domain

      // Save the updated SSL file
      fs.writeFileSync('./PJBX/config/ssl.json', JSON.stringify(sslFileObj, '', 4));

      return res.json({
        status: 'Success',
        error null,
        code: 0,
        message: `Successfully added Domain ${domainName}. Please restart PJBX to apply the changes.`,
        info: domainName,
      });
    } else {
      return res.json({
        status: 'Error',
        error: 'Failed To Add Domain',
        code: code,
        needRestart: false,
        message: `Failed To Add Domain ${domainName}`,
      });
    }
  });
};

exports.deleteDomain = (req, res) => {
  const vResult = validationResult(req);
  const hasErrors = !vResult.isEmpty();
  if (hasErrors) {
    return res.status(402).json(vResult.errors);
  }

  let domainName = req.body.domain;
  domainName = domainName.toLowerCase();

  let sslFileObj = JSON.parse(fs.readFileSync('./PJBX/config/ssl.json'));
  const domainValueList = sslFileObj.map(obj => obj.domain);

  if (domainValueList.indexOf(domainName) === -1) {
    console.error('Domain does not exist');
    return res.json({
      status: 'Error',
      error: 'Invalid Domain',
      code: 1,
      message: 'Domain does not exist, please check the domain name...',
    });
  } else {
    sslFileObj = sslFileObj.filter(sslInfo => sslInfo.domain !== domainName);

    // Perform domain rewriting logic here
    // For example, you can update the Nginx configuration to remove the server block for the custom domain

    // Save the updated SSL file
    fs.writeFileSync('./PJBX/config/ssl.json', JSON.stringify(sslFileObj, '', 4));

    return res.json({
      status: 'Success',
      error: null,
      code: 0,
      message: `Successfully deleted Domain ${domainName}. Please restart PJBX to apply the changes.`,
      info: domainName,
    });
  }
};

// Rest of the code remains the same
