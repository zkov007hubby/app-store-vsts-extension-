import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import os = require('os');

let taskPath = path.join(__dirname, '..', 'app-store-release.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('authType', 'UserAndPass');
tmr.setInput('username', 'creds-username');
tmr.setInput('password', 'creds-password');
//tmr.setInput('appIdentifier', 'com.microsoft.test.appId');

// let releaseTrack: string = tl.getInput('releaseTrack', true);
tmr.setInput('releaseTrack', 'TestFlight');

// let ipaPath: string = tl.getInput('ipaPath', true);
tmr.setInput('ipaPath', 'mypackage.ipa');

// provide answers for task mock
let a: ma.TaskLibAnswers = <ma.TaskLibAnswers> {
    'which': {
        'ruby': '/usr/bin/ruby',
        'gem': '/usr/bin/gem',
        'deliver': '/usr/bin/deliver',
        'pilot': '/usr/bin/pilot'
    },
    'checkPath' : {
        '/usr/bin/ruby': true,
        '/usr/bin/gem': true,
        '/usr/bin/deliver': true,
        '/usr/bin/pilot': true
    },
    'glob': {
        'mypackage.ipa': [
            'mypackage.ipa'
        ]
    },
    'exec': {
        '/usr/bin/gem install pilot': {
            'code': 0,
            'stdout': 'truly outrageous!'
        },
        'pilot upload -u creds-username -i mypackage.ipa': {
            'code': 0,
            'stdout': 'truly outrageous!'
        }
    }
};
tmr.setAnswers(a);

// This is how you can mock NPM packages...
os.platform = () => {
    return 'darwin';
};
tmr.registerMock('os', os);

tmr.run();
