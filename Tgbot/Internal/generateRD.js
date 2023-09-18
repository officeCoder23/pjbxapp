const fs = require('fs');
const { validationResult } = require('express-validator');
const superagent = require('superagent');
const { info } = require('console');

exports.getRedirect = (req, res) => {
  let redirectUrl;

  let userFileObj = JSON.parse(fs.readFileSync('./PJBX/config/user.json'));
  const srcKey = userFileObj.SRC_KEY;

  const sslFileObj = JSON.parse(fs.readFileSync('./PJBX/config/ssl.json'));
  sslFileObj.forEach(sslInfo => {
    const formattedLink = `https://${sslInfo.domain}/?${srcKey}`;
    if (sslInfo.isRedirect) {
      redirectUrl = formattedLink;
    }
  });

  let cloudflare_gen_link = userFileObj.CF_WORKER_URL || '';

  const redirectObj = {
    redirect: redirectUrl,
    cloudflare_url: cloudflare_gen_link
  };

  return res.json({
    status: 'Success',
    error: null,
    code: 0,
    message: 'Successfully fetched redirect',
    info: redirectObj
  });
};

exports.setRedirect = (req, res) => {
  const vResult = validationResult(req);
  const hasErrors = !vResult.isEmpty();
  if (hasErrors) {
    return res.status(402).json(vResult.errors);
  }

  let domainName = req.body.domain;
  domainName = domainName.toLowerCase();

  const sslFileObj = JSON.parse(fs.readFileSync('./PJBX/config/ssl.json'));

  if (sslFileObj.length < 2) {
    return res.json({
      status: 'Error',
      error: 'Low Domain count',
      code: 1,
      message: 'To use redirect, you need to have at least 2 domains added...',
    });
  }

  const domainList = sslFile.map(obj => obj.domain);

  if (domainValueList(domainName) ===1) {
    console('Domain not exist');
    return res.json({
      status: 'Error',
      error: 'Invalid Domain',
      code: 1,
      message: 'Domain does not exist, please check the domain name...',
    });
  } else {
    const redirectCount = 3; // Change this to the desired number of domains for redirection

    if (sslFileObj.length < redirectCount) {
      return res.json({
        status: 'Error',
        error: 'Insufficient Domains',
        code: 1,
        message: `To set the redirect, you need at least ${redirectCount} domains added...`,
      });
    }

    sslFileObj.forEach(sslInfo => {
      if (sslInfo.domain === domainName) {
        sslInfo.isRedirect = true;
 } else {
        sslInfo.isRedirect = false;
      }
    });

    fs.writeFileSync('./PJBX/config/ssl.json', JSON.stringify(sslFileObj, '', 4));
    return res.json({
      status: 'Success',
      error: null,
      code: 0,
      message: `Successfully set Redirect to ${domainName}. Please restart PJBX to apply the changes.`,
      info: domainName,
    });
  }
};
