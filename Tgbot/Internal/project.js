const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

exports.getProjects = (req, res) => {
  const projectList = [];

  const dirList = fs.readdirSync('./PJBX/projects');
  dirList.forEach(dirEntry => {
    if (fs.existsSync(path.join('./PJBX/projects', `${dirEntry}/main.js`)))      projectList.push(dirEntry);
    }
  });

  return res.json({
    status: 'Success',
    error: null,
    code: 0,
    message: 'Successfully fetched projects',
    info: projectList,
  });
};

exports.changeProject = (req, res) => {
  const vResult = validationResult(req);
  const hasErrors = !vResult.isEmpty();
  if (hasErrors) {
    return res.status(402).json(vResult.errors);
  }

  const projectName = req.body.project;
  if (!fs.existsSync(path.join('./PJBX/projects', `${projectName}/main.js`))) {
    return res.json({
      status: 'Error',
      error: 'Invalid Project',
      code: 1,
      message: 'Project does not exist, please check the projectName given...',
    });
  }

  let userFileObj = JSON.parse(fs.readFileSync('./PJBX/config/user.json'));

  userFileObj.CURRENT_PROJECT = projectName;

  fs.writeFileSync('./PJBX/config/user.json', JSON.stringify(userFileObj, '', 4));

  return res.json({
    status: 'Success',
    error: null,
    code: 0,
    message: `Successfully changed project to ${projectName}. Please restart PJBX to apply the changes.`,
    info: projectName,
  });
};

exports.getActiveProject = (req, res) => {
  let userFileObj = JSON.parse(fs.readFileSync('./PJBX/config/user.json'));
  const projectName = userFileObj.CURRENT_PROJECT;
  return res.json({
    status: 'Success',
    error: null,
    code: 0,
    message: `Current Project name is: ${projectName}`,
    info: projectName,
  });
};
