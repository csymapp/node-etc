node-etc
========

Configuration loader for node.js applications.

[![Build Status](https://travis-ci.com/csymapp/node-etc.svg?branch=master)](https://travis-ci.com/csymapp/node-etc)

Idea
----
Your application probably needs to load configuration from multiple sources and make them available as one object. Etc is here to help!

Etc provides a fairly complete API for loading configuration from a variety of sources, however, its been engineered to easily load config from (in order of precedence): argv, environment, files in `/etc/`, package.json, and defaults.

Etc. also allows you to edit and save your configuration.

Examples
--------
#### Create configuration
```js
const conf = require('node-etc');
conf.createConfig('/etc/node-etc/conf.yaml')
```

#### add values to configuration
```js
const conf = require('node-etc');

conf.addConfig('yaml', '/etc/node-etc/conf.yaml', { Field: "value", Ta: "bitha" }));
conf.addConfig('env', '/etc/node-etc/.env', { Field: "value", Ta: "bitha" }));

```

#### Load configuration from argv, env, a file, and defaults.
```js
const conf = require('node-etc');

// read package.json
conf.packageJson('/home/brian/Code/CSECO/csycms');
conf.packageJson('CSECO');
conf.packageJson();

// read json file
conf.parseJSON('CSECO');
conf.parseJSON('/etc/node-etc/a.json');

conf.argv());

// read all enviroment values
conf.env());

// read only value in .env file
conf.parseDotEnvOnly('config/.env');

// read from yaml
conf.parseYAML('/etc/node-etc/conf.yml');
conf.parseYAML('conf.yml');
conf.parseYAML();

// read all possible configuration files from directory
conf.directory('/etc/node-etc');

```

API
---

Refer to the [documentation](/docs/ReadMe.md)

<a name="etc"></a>

## etc
**Kind**: global class  

* [etc](#etc)
    * [new etc()](#new_etc_new)
    * [.packageJson([dir])](#etc+packageJson) ⇒ <code>object</code>
    * [.parseJSON(filePath)](#etc+parseJSON) ⇒ <code>object</code>
    * [.parseYAML([filePath])](#etc+parseYAML) ⇒ <code>object</code>
    * [.argv()](#etc+argv) ⇒ <code>object</code>
    * [.parseDotEnvOnly([dir])](#etc+parseDotEnvOnly) ⇒ <code>object</code>
    * [.env([dir])](#etc+env) ⇒ <code>object</code>
    * [.directory(dir)](#etc+directory) ⇒ <code>object</code>
    * [.getFilePath(configType, fileName)](#etc+getFilePath)
    * [.readConfigData(configType, filePath, config)](#etc+readConfigData)
    * [.addConfig(configType, filePath, config)](#etc+addConfig)
    * [.deleteConfig(configType, filePath, config)](#etc+deleteConfig)
    * [.editConfig(configType, filePath, config)](#etc+editConfig)
    * [.save(configType, filePath, config)](#etc+save)
    * [.createConfig(filePath)](#etc+createConfig)
    * [.all()](#etc+all)

<a name="new_etc_new"></a>

### new etc()
constructor

<a name="etc+packageJson"></a>

### etc.packageJson([dir]) ⇒ <code>object</code>
Read package.json [1] of current project or [2] from any other location. If dir is not supplied, the function moves up the directories in the cwd path and returns the first package.json found.

**Kind**: instance method of [<code>etc</code>](#etc)  
**Returns**: <code>object</code> - - Returns json object found or empty object  

| Param | Type | Description |
| --- | --- | --- |
| [dir] | <code>string</code> | directory name from which to read package.json. Can be either a directory name or absolute path of directory |

<a name="etc+parseJSON"></a>

### etc.parseJSON(filePath) ⇒ <code>object</code>
Read json file

**Kind**: instance method of [<code>etc</code>](#etc)  
**Returns**: <code>object</code> - - Returns json object found or empty object  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | file to read |

<a name="etc+parseYAML"></a>

### etc.parseYAML([filePath]) ⇒ <code>object</code>
Read yaml file

**Kind**: instance method of [<code>etc</code>](#etc)  
**Returns**: <code>object</code> - - Returns json object found or empty object  

| Param | Type | Description |
| --- | --- | --- |
| [filePath] | <code>string</code> | file to read. Either absolute path or file name. If filename is not given, it reads conf.yaml File name is given with either .yaml/.yml extension or without. |

<a name="etc+argv"></a>

### etc.argv() ⇒ <code>object</code>
return command line arguments

**Kind**: instance method of [<code>etc</code>](#etc)  
**Returns**: <code>object</code> - - Returns object containing command line arguments  
<a name="etc+parseDotEnvOnly"></a>

### etc.parseDotEnvOnly([dir]) ⇒ <code>object</code>
Loads only environment variables from a .env file in either [1] current project or [2] from any other location and returns process.env. If dir is not supplied, the function moves up the directories in the cwd path and returns the first .env file found.

**Kind**: instance method of [<code>etc</code>](#etc)  
**Returns**: <code>object</code> - - Returns json object found or empty object  

| Param | Type | Description |
| --- | --- | --- |
| [dir] | <code>string</code> | - directory name from which to read .env file. Can be either a directory name or absolute path of directory |

<a name="etc+env"></a>

### etc.env([dir]) ⇒ <code>object</code>
Loads environment variables from a .env file in either [1] current project or [2] from any other location and returns process.env. If dir is not supplied, the function moves up the directories in the cwd path and returns the first .env file found.
If absolute path is not given for dir, it also loads .env from /etc/{dir}. If dir is not given, it is taken as the program name as contained in the package.json file in the root directory of the project.

**Kind**: instance method of [<code>etc</code>](#etc)  
**Returns**: <code>object</code> - - Returns json object found or empty object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [dir] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | directory name from which to read .env file. Can be either a directory name or absolute path of directory |

<a name="etc+directory"></a>

### etc.directory(dir) ⇒ <code>object</code>
read configuration from .yaml/.yml, .env and json files in given directory.

**Kind**: instance method of [<code>etc</code>](#etc)  

| Param | Type | Description |
| --- | --- | --- |
| dir | <code>string</code> | absolute path of directory |

<a name="etc+getFilePath"></a>

### etc.getFilePath(configType, fileName)
Get filepath if file with given name exists in root directory or project or in /etc/{programName}

**Kind**: instance method of [<code>etc</code>](#etc)  

| Param | Type |
| --- | --- |
| configType | <code>&#x27;json&#x27;</code> \| <code>&#x27;yaml&#x27;</code> \| <code>&#x27;yml&#x27;</code> \| <code>&#x27;env&#x27;</code> | 
| fileName | <code>string</code> | 

<a name="etc+readConfigData"></a>

### etc.readConfigData(configType, filePath, config)
readConfiguration of configType from given path

**Kind**: instance method of [<code>etc</code>](#etc)  

| Param | Type | Description |
| --- | --- | --- |
| configType | <code>&#x27;json&#x27;</code> \| <code>&#x27;yaml&#x27;</code> \| <code>&#x27;yml&#x27;</code> \| <code>&#x27;env&#x27;</code> |  |
| filePath | <code>string</code> | filename with/without extension/ absolute path |
| config | <code>object</code> |  |

<a name="etc+addConfig"></a>

### etc.addConfig(configType, filePath, config)
Add new values to config/modify existing ones

**Kind**: instance method of [<code>etc</code>](#etc)  

| Param | Type | Description |
| --- | --- | --- |
| configType | <code>&#x27;json&#x27;</code> \| <code>&#x27;yaml&#x27;</code> \| <code>&#x27;yml&#x27;</code> \| <code>&#x27;env&#x27;</code> |  |
| filePath | <code>string</code> | filename with/without extension/ absolute path |
| config | <code>object</code> |  |

<a name="etc+deleteConfig"></a>

### etc.deleteConfig(configType, filePath, config)
Delete values from config

**Kind**: instance method of [<code>etc</code>](#etc)  

| Param | Type | Description |
| --- | --- | --- |
| configType | <code>&#x27;json&#x27;</code> \| <code>&#x27;yaml&#x27;</code> \| <code>&#x27;yml&#x27;</code> \| <code>&#x27;env&#x27;</code> |  |
| filePath | <code>string</code> | filename with/without extension/ absolute path |
| config | <code>array</code> | fields to remove |

<a name="etc+editConfig"></a>

### etc.editConfig(configType, filePath, config)
Add new values to config/modify existing ones

**Kind**: instance method of [<code>etc</code>](#etc)  

| Param | Type | Description |
| --- | --- | --- |
| configType | <code>&#x27;json&#x27;</code> \| <code>&#x27;yaml&#x27;</code> \| <code>&#x27;yml&#x27;</code> \| <code>&#x27;env&#x27;</code> |  |
| filePath | <code>string</code> | filename with/without extension/ absolute path |
| config | <code>object</code> |  |

<a name="etc+save"></a>

### etc.save(configType, filePath, config)
Save config values

**Kind**: instance method of [<code>etc</code>](#etc)  

| Param | Type | Description |
| --- | --- | --- |
| configType | <code>&#x27;json&#x27;</code> \| <code>&#x27;yaml&#x27;</code> \| <code>&#x27;yml&#x27;</code> \| <code>&#x27;env&#x27;</code> |  |
| filePath | <code>string</code> | absolute path |
| config | <code>array</code> | fields to save |

<a name="etc+createConfig"></a>

### etc.createConfig(filePath)
create file if it does not exists

**Kind**: instance method of [<code>etc</code>](#etc)  

| Param | Type |
| --- | --- |
| filePath | <code>string</code> | 

<a name="etc+all"></a>

### etc.all()
Load all configurations

**Kind**: instance method of [<code>etc</code>](#etc)  

Credits
-------
Inspired by [cpsubrian/node-etc](https://github.com/cpsubrian/node-etc)

Developed by [CSECO](http://www.cseco.co.ke)
--------------------------------------------------------
CSECO is a mechatronics firm specializing in engineering technology to be cheap enough to be affordable to low income earners.


[http://www.cseco.co.ke](http://www.cseco.co.ke)

Todo
- [ ] Add ~/etc to paths for config files
- [ ] fix yaml extension in parseYAML

