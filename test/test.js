var etc = require('../index'),
  assert = require('assert');

function areEqual(object1, object2) {
  return object1.name === object2.name;
}

it("Should return package.json", () => {
  let packageJson = etc.packageJson();
  console.log(packageJson)
  if (!areEqual(packageJson, require('../package.json'))) {
    throw "Not package.json"
  }
})