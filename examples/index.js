let test = require("etc");

console.log(test.packageJson('/home/brian/Code/CSECO/csycms'));
console.log(test.packageJson('CSECO'));
console.log(test.packageJson());

console.log(test.parseJSON('CSECO'));
console.log(test.argv());
console.log(test.env());
console.log(test.parseYAML('/etc/node-etc/conf.yml'));
console.log(test.parseYAML('conf.yml'));
console.log(test.parseYAML());
console.log(test.directory('/etc/node-etc'));
test.createConfig('/etc/node-etc/sample.json')
console.log(test.addConfig('env', 'config/.env', { add: "ADDED", BRIAN: "ABC" }));
console.log(test.addConfig('json', '/etc/node-etc/a.json', { add: "ADDED", BRIAN: "ABC", "SO": "ER" }));
console.log(test.deleteConfig('json', '/etc/node-etc/a.json', ["SO"]));
console.log(test.deleteConfig('env', 'config/.env', ["BRIAN"]));
console.log(test.parseJSON('/etc/node-etc/a.json'))
console.log(test.addConfig('env', 'config/.env', { add: "ADDED", BRIANE: "ABC" }));
console.log('READING')
console.log(test.parseDotEnvOnly('config/.env'))