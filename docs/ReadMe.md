<a name="etc"></a>

## etc
**Kind**: global class  

* [etc](#etc)
    * [new etc()](#new_etc_new)
    * [.createConfig(filePath)](#etc+createConfig)
    * [.packageJson([dir])](#etc+packageJson) ⇒ <code>object</code>
    * [.packageJsonDir(dir)](#etc+packageJsonDir) ⇒ <code>string</code>
    * [.parseJSONPath(filePath)](#etc+parseJSONPath) ⇒ <code>object</code>
    * [.projectRoot()](#etc+projectRoot) ⇒ <code>string</code>
    * [.parseJSON(filePath)](#etc+parseJSON) ⇒ <code>object</code>
    * [.argv()](#etc+argv) ⇒ <code>object</code>
    * [.directory(dir)](#etc+directory) ⇒ <code>object</code>
    * [.parseYAML([filePath])](#etc+parseYAML) ⇒ <code>object</code>
    * [.env([dir])](#etc+env) ⇒ <code>object</code>
    * [.getFilePath(configType, fileName)](#etc+getFilePath)
    * [.readConfigData(configType, filePath, config)](#etc+readConfigData)
    * [.addConfig(configType, filePath, config)](#etc+addConfig)
    * [.deleteConfig(configType, filePath, config)](#etc+deleteConfig)
    * [.editConfig(configType, filePath, config)](#etc+editConfig)
    * [.save(configType, filePath, config)](#etc+save)
    * [.all()](#etc+all)

<a name="new_etc_new"></a>

### new etc()
constructor

<a name="etc+createConfig"></a>

### etc.createConfig(filePath)
create configuration file in filePath if it does not exists

**Kind**: instance method of [<code>etc</code>](#etc)  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | with the extensions [.json|.yaml|.yml|.env]if filename is supplied instead of absolute path, create in /etc/{appName} or in ~/etc/{appName} if permission is denied for /etc |

<a name="etc+packageJson"></a>

### etc.packageJson([dir]) ⇒ <code>object</code>
Read package.json [1] of current project or [2] from any other location. 
If relative path is supplied for dir such as package.json or node-etc/package.json(=node-etc), the file will we looked for in [1] the cwd path moving down one level till it is found, [2] in /etc/${appName}, [3] in ~/etc/${appName}, [4] {projectRoot}/etc, [5] {projectRoot}/.etc, [6] {projectRoot}/config, [7] {projectRoot}/config

**Kind**: instance method of [<code>etc</code>](#etc)  
**Returns**: <code>object</code> - - Returns json object found or empty object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [dir] | <code>string</code> | <code>&quot;&#x27;package.json&#x27;&quot;</code> | Either absolute or relative path, with/without package.json at the end. |

<a name="etc+packageJsonDir"></a>

### etc.packageJsonDir(dir) ⇒ <code>string</code>
Get path to package.json read by packageJson

**Kind**: instance method of [<code>etc</code>](#etc)  
**Returns**: <code>string</code> - the path to the package.json read by packageJson  

| Param | Type | Default |
| --- | --- | --- |
| dir | <code>string</code> | <code>&quot;package.json&quot;</code> | 

<a name="etc+parseJSONPath"></a>

### etc.parseJSONPath(filePath) ⇒ <code>object</code>
Read json file and return path if json file is valid

**Kind**: instance method of [<code>etc</code>](#etc)  
**Returns**: <code>object</code> - - Returns json object found or empty object  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | relative or absolute path of file to read. If relative path is supplied for dir such as package.json or node-etc/package.json(=node-etc), the file will we looked for in [1] the cwd path moving down one level till it is found, [2] in /etc/${appName}, [3] in ~/etc/${appName}, [4] {projectRoot}/etc, [5] {projectRoot}/.etc, [6] {projectRoot}/config, [7] {projectRoot}/config |

<a name="etc+projectRoot"></a>

### etc.projectRoot() ⇒ <code>string</code>
Get the root dir of current project by locating package.json

**Kind**: instance method of [<code>etc</code>](#etc)  
**Returns**: <code>string</code> - - project root directory  
<a name="etc+parseJSON"></a>

### etc.parseJSON(filePath) ⇒ <code>object</code>
Read json file

**Kind**: instance method of [<code>etc</code>](#etc)  
**Returns**: <code>object</code> - - Returns json object found or empty object  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | relative or absolute path of file to read. If relative path is supplied for dir such as package.json or node-etc/package.json(=node-etc), the file will we looked for in [1] the cwd path moving down one level till it is found, [2] in /etc/${appName}, [3] in ~/etc/${appName}, [4] {projectRoot}/etc, [5] {projectRoot}/.etc, [6] {projectRoot}/config, [7] {projectRoot}/config |

<a name="etc+argv"></a>

### etc.argv() ⇒ <code>object</code>
return command line arguments

**Kind**: instance method of [<code>etc</code>](#etc)  
**Returns**: <code>object</code> - - Returns object containing command line arguments  
<a name="etc+directory"></a>

### etc.directory(dir) ⇒ <code>object</code>
read configuration from .yaml/.yml, .env and json files in given directory.

**Kind**: instance method of [<code>etc</code>](#etc)  

| Param | Type | Description |
| --- | --- | --- |
| dir | <code>string</code> | absolute path of directory |

<a name="etc+parseYAML"></a>

### etc.parseYAML([filePath]) ⇒ <code>object</code>
Read yaml file

**Kind**: instance method of [<code>etc</code>](#etc)  
**Returns**: <code>object</code> - - Returns json object found or empty object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [filePath] | <code>string</code> | <code>&quot;&#x27;conf&#x27;&quot;</code> | relative or absolute path of file to read,  with either .yaml/.yml extension or without. If argument supplied is file.yaml, but file.yml is found instead, file.yml will be returned. If relative path is supplied for filePath such as config.yaml or node-etc/config.yaml(=node-etc/config), the file will we looked for in [1] the cwd path moving down one level till it is found, [2] in /etc/${appName}, [3] in ~/etc/${appName}, [4] {projectRoot}/etc, [5] {projectRoot}/.etc, [6] {projectRoot}/config, [7] {projectRoot}/config |

<a name="etc+env"></a>

### etc.env([dir]) ⇒ <code>object</code>
Loads environment variables from a .env file in either [1] current project or [2] from any other location and returns process.env. If dir is not supplied, the function moves up the directories in the cwd path and returns the first .env file found.
If absolute path is not given for dir, it also loads .env from /etc/{dir}. If dir is not given, it is taken as the program name as contained in the package.json file in the root directory of the project.

**Kind**: instance method of [<code>etc</code>](#etc)  
**Returns**: <code>object</code> - - Returns json object found or empty object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [dir] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | directory name from which to read .env file. Can be either a directory name or absolute path of directory |

<a name="etc+getFilePath"></a>

### etc.getFilePath(configType, fileName)
Get filepath if file with given name exists in: [1] the cwd path moving down one level till it is found [2] /etc/${appName} [3] ~/etc/${appName} [4] {projectRoot}/etc [5] {projectRoot}/.etc [6] {projectRoot}/config [7] {projectRoot}/config

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

<a name="etc+all"></a>

### etc.all()
Load all configurations

**Kind**: instance method of [<code>etc</code>](#etc)  
