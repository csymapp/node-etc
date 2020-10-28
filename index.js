const path = require("path");
const { argv } = require('yargs')
const clone = require('clone')
const dotenv = require('dotenv')
const fs = require("fs-extra")
const yaml = require('js-yaml')
// const shell = require('shelljs');
const child_process = require('child_process');
const merge = require('deepmerge')

class etc {
    /** constructor */
    constructor() { }

    /**
     * create configuration file in filePath if it does not exists
     * @param {string} filePath - with the extensions [.json|.yaml|.yml|.env]if filename is supplied instead of absolute path, create in /etc/{appName} or in ~/etc/{appName} if permission is denied for /etc
     */
    createConfig(filePath) {
        let extension = filePath.split('.').slice(-1)[0]

        let extensions = ["json", "env", "yaml", "yml"];
        if (!extensions.includes(extension)) {
            let err = `unsupported extension ${extension}. use one of ${extensions}`
            throw err
        }
        let isAbsolutePath = false;
        if (filePath[0] === '/') {
            isAbsolutePath = true;
        }
        // let homeDir = shell.exec('echo ~', { silent: true }).stdout.replace(/\n/, '')
        let homeDir = child_process.execSync('echo ~').toString().replace(/\n/, '')
        let homeEtc = path.join(homeDir, 'etc');
        if (isAbsolutePath) {
            try {
                let dirPath = filePath.replace(/\/[^\/]*$/, '')
                fs.mkdirSync(dirPath, {
                    recursive: true
                });
                if (!fs.existsSync(filePath)) {
                    fs.createFileSync(filePath)
                }
                return true
            } catch (error) {
                if (filePath.replace(/^\/etc/, homeEtc)) {
                    filePath = filePath.replace(/^\/etc/, homeEtc)
                    let dirPath = filePath.replace(/\/[^\/]*$/, '')
                    fs.mkdirSync(dirPath, {
                        recursive: true
                    });
                    if (!fs.existsSync(filePath)) {
                        fs.createFileSync(filePath)
                    }
                }
                return true
            }
        }
        let packageJson = this.packageJson();
        let appName = packageJson.name;
        let dirPath, filePathtoCreate;
        try {
            dirPath = path.join('/etc', appName)
            fs.mkdirSync(dirPath, {
                recursive: true
            });
            filePathtoCreate = path.join(dirPath, filePath)
            if (!fs.existsSync(filePathtoCreate)) {
                fs.createFileSync(filePathtoCreate)
            }
        } catch (error) {
            error = filePath
            dirPath = path.join(homeEtc, appName)
            fs.mkdirSync(dirPath, {
                recursive: true
            });
            filePathtoCreate = path.join(dirPath, filePath)
            if (!fs.existsSync(filePathtoCreate)) {
                fs.createFileSync(filePathtoCreate)
            }
        }
    }

    /**
     * Read package.json [1] of current project or [2] from any other location. 
     * If relative path is supplied for dir such as package.json or node-etc/package.json(=node-etc), the file will we looked for in [1] the cwd path moving down one level till it is found, [2] in /etc/${appName}, [3] in ~/etc/${appName}, [4] {projectRoot}/etc, [5] {projectRoot}/.etc, [6] {projectRoot}/config, [7] {projectRoot}/config
     * @param {string} [dir='package.json'] - Either absolute or relative path, with/without package.json at the end.
     * @returns {object} - Returns json object found or empty object 
     */
    packageJson(dir = 'package.json') {
        if (!dir.match(/package\.json$/)) {
            dir = path.join(dir, 'package.json')
        }
        return this.parseJSON(dir)
    }

    /**
     * Get the root dir of current project by locating package.json
     * @returns {string} - project root directory
     */
    projectRoot() {
        let cwd1 = process.cwd()
        let lookforFile = (location, fileName) => {
            let whichLocation = path.join(location, fileName)
            if (fs.existsSync(whichLocation)) {
                return [location]
            }
            if (location.length <= 1) return false;
            location = location.replace(/\/[^\/]*$/, '')
            return [location, lookforFile(location, fileName)]
        }
        let root = lookforFile(cwd1, 'package.json');
        return root[0]
    }

    /**
     * Read json file
     * @param {string} filePath - relative or absolute path of file to read.
     * If relative path is supplied for dir such as package.json or node-etc/package.json(=node-etc), the file will we looked for in [1] the cwd path moving down one level till it is found, [2] in /etc/${appName}, [3] in ~/etc/${appName}, [4] {projectRoot}/etc, [5] {projectRoot}/.etc, [6] {projectRoot}/config, [7] {projectRoot}/config
     * @returns {object} - Returns json object found or empty object
     */
    parseJSON(filePath) {
        try {
            return require(this.getFilePath('json', filePath));
        } catch (error) {
            error = {}
            return error
        }
    }

    /**
    * return command line arguments
    * @returns {object} - Returns object containing command line arguments
    */
    argv() {
        let ret = clone(argv)
        delete ret["_"]
        delete ret["$0"]
        return ret;
    }

    /**
     * read configuration from .yaml/.yml, .env and json files in given directory. 
     * @param {string} dir - absolute path of directory
     * @returns {object}
     */
    directory(dir) {
        if (!fs.existsSync(dir)) {
            return {}
        }
        let files = fs.readdirSync(dir);
        let jsonFiles = files.filter(file => file.match(/\.json$/))
        let dotEnvFiles = files.filter(file => file.match(/\.env$/))
        let yamlFiles = files.filter(file => file.match(/\.y[a]?ml$/))
        let ret = {};
        jsonFiles.map(filePath => {
            ret = merge(ret, this.parseJSON(filePath))
        })
        yamlFiles.map(filePath => {
            ret = merge(ret, this.parseYAML(filePath))
        })
        dotEnvFiles.map(filePath => {
            ret = merge(ret, this.env(filePath))
        })
        return ret
    }

    /**
     * Read yaml file
     * @param {string} [filePath='conf'] - relative or absolute path of file to read,  with either .yaml/.yml extension or without. If argument supplied is file.yaml, but file.yml is found instead, file.yml will be returned.
     * If relative path is supplied for filePath such as config.yaml or node-etc/config.yaml(=node-etc/config), the file will we looked for in [1] the cwd path moving down one level till it is found, [2] in /etc/${appName}, [3] in ~/etc/${appName}, [4] {projectRoot}/etc, [5] {projectRoot}/.etc, [6] {projectRoot}/config, [7] {projectRoot}/config
     * @returns {object} - Returns json object found or empty object
     */
    parseYAML(filePath = 'conf') {
        let configType = 'yml'
        if (filePath.match(/\.yaml$/)) {
            configType = 'yaml'
        }
        let yFilePath = this.getFilePath(configType, filePath)
        let yamlObject = {}
        try {
            let savedConfigs = fs.readFileSync(
                yFilePath,
                'utf-8'
            )
            yamlObject = yaml.safeLoad(savedConfigs) || {}
        } catch (error) {
            error = {}
            yamlObject = error
        }
        return yamlObject
    }

    /**
     * Loads environment variables from a .env file in either [1] current project or [2] from any other location and returns process.env. If dir is not supplied, the function moves up the directories in the cwd path and returns the first .env file found.
     * If absolute path is not given for dir, it also loads .env from /etc/{dir}. If dir is not given, it is taken as the program name as contained in the package.json file in the root directory of the project.
     * @param {string} [dir=''] - directory name from which to read .env file. Can be either a directory name or absolute path of directory
     * @returns {object} - Returns json object found or empty object 
     */
    env(dir = '') {
        return dotenv.config({ path: this.getFilePath('env', dir) }).parsed || {}
    }

    /**
     * Get filepath if file with given name exists in: [1] the cwd path moving down one level till it is found [2] /etc/${appName} [3] ~/etc/${appName} [4] {projectRoot}/etc [5] {projectRoot}/.etc [6] {projectRoot}/config [7] {projectRoot}/config
     * @param {('json'|'yaml'|'yml'|'env')} configType 
     * @param {string} fileName 
     */
    getFilePath(configType = '', fileName = '') {
        switch (configType) {
            case "json":
                if (!fileName.match(/\.json$/)) {
                    fileName = `${fileName}.json`
                }
                break;
            case "yaml":
                if (!fileName.match(/\.yaml$/)) {
                    fileName = `${fileName}.yaml`
                }
                break;
            case "yml":
                if (!fileName.match(/\.yml$/)) {
                    fileName = `${fileName}.yml`
                }
                break;
            case "env":
                if (!fileName.match(/\.env$/)) {
                    fileName = `${fileName}.env`
                }
                break;
            default:
                throw `Unsupported configType ${configType}`
        }
        let directoryPath = process.cwd();
        let lookforFile = (location, fileName) => {
            let whichLocation = path.join(location, fileName)
            if (fs.existsSync(whichLocation)) {
                return whichLocation
            }
            if (location.length <= 1) return false;
            location = location.replace(/\/[^\/]*$/, '')
            return lookforFile(location, fileName)
        }

        if (fileName[0] === '/') { // absolute path supplied as argument

            let filePath = lookforFile(fileName, fileName);
            if (filePath === false) {
                if (configType === 'yaml' || configType === 'yml') {
                    if (fileName.match(/\.yaml$/)) {
                        fileName = fileName.replace(/\.yaml$/, '.yml')
                    } else {
                        fileName = fileName.replace(/\.yml$/, '.yaml')
                    }
                }
            }
            return fileName
        }

        let filePath = lookforFile(directoryPath, fileName);
        let projectName = this.packageJson().name || false
        if (!fs.existsSync(filePath)) {
            if (projectName) {
                filePath = lookforFile(path.join('/etc', projectName, fileName), fileName);
                if (filePath === false) {
                    if (configType === 'yaml' || configType === 'yml') {
                        if (fileName.match(/\.yaml$/)) {
                            fileName = fileName.replace(/\.yaml$/, '.yml')
                        } else {
                            fileName = fileName.replace(/\.yml$/, '.yaml')
                        }
                        filePath = lookforFile(path.join('/etc', projectName, fileName), fileName);
                    }
                }
            }
        }
        if (!fs.existsSync(filePath)) {
            if (projectName) {
                // let homeDir = shell.exec('echo ~', { silent: true }).stdout.replace(/\n/, '')
                let homeDir = child_process.execSync('echo ~').toString().replace(/\n/, '')
                let homeEtc = path.join(homeDir, 'etc')
                filePath = lookforFile(path.join(homeEtc, projectName, fileName), fileName);
                if (filePath === false) {
                    if (configType === 'yaml' || configType === 'yml') {
                        if (fileName.match(/\.yaml$/)) {
                            fileName = fileName.replace(/\.yaml$/, '.yml')
                        } else {
                            fileName = fileName.replace(/\.yml$/, '.yaml')
                        }
                        filePath = lookforFile(path.join(homeEtc, projectName, fileName), fileName);
                    }
                }
            }
        }
        if (!fs.existsSync(filePath)) {
            let projectRoot = this.projectRoot();
            filePath = lookforFile(path.join(projectRoot, 'etc', fileName), fileName);
            if (!fs.existsSync(filePath)) {
                filePath = lookforFile(path.join(projectRoot, '.etc', fileName), fileName);
                if (filePath === false) {
                    if (configType === 'yaml' || configType === 'yml') {
                        if (fileName.match(/\.yaml$/)) {
                            fileName = fileName.replace(/\.yaml$/, '.yml')
                        } else {
                            fileName = fileName.replace(/\.yml$/, '.yaml')
                        }
                        filePath = lookforFile(path.join(projectRoot, '.etc', fileName), fileName);
                    }
                }
            }
            if (!fs.existsSync(filePath)) {
                filePath = lookforFile(path.join(projectRoot, 'config', fileName), fileName);
                if (filePath === false) {
                    if (configType === 'yaml' || configType === 'yml') {
                        if (fileName.match(/\.yaml$/)) {
                            fileName = fileName.replace(/\.yaml$/, '.yml')
                        } else {
                            fileName = fileName.replace(/\.yml$/, '.yaml')
                        }
                        filePath = lookforFile(path.join(projectRoot, 'config', fileName), fileName);
                    }
                }
            }
            if (!fs.existsSync(filePath)) {
                filePath = lookforFile(path.join(projectRoot, '.config', fileName), fileName);
                if (filePath === false) {
                    if (configType === 'yaml' || configType === 'yml') {
                        if (fileName.match(/\.yaml$/)) {
                            fileName = fileName.replace(/\.yaml$/, '.yml')
                        } else {
                            fileName = fileName.replace(/\.yml$/, '.yaml')
                        }
                        filePath = lookforFile(path.join(projectRoot, '.config', fileName), fileName);
                    }
                }
            }

        }
        if (!fs.existsSync(filePath)) {
            throw `${fileName} not found`
        }
        return filePath
    }

    /**
     * readConfiguration of configType from given path
     * @param {('json'|'yaml'|'yml'|'env')} configType 
     * @param {string} filePath - filename with/without extension/ absolute path
     * @param {object} config 
     */
    readConfigData(configType = '', filePath = '') {
        try {
            filePath = this.getFilePath(configType, filePath)
        } catch (error) {
            throw error
        }
        let configData;
        switch (configType) {
            case "json":
                configData = this.parseJSON(filePath);
                break;
            case "yaml":
            case "yml":
                configData = this.parseYAML(filePath);
                break;
            case "env":
                configData = this.parseDotEnvOnly(filePath);
                break;
        }
        return configData;
    }

    /**
     * Add new values to config/modify existing ones
     * @param {('json'|'yaml'|'yml'|'env')} configType 
     * @param {string} filePath - filename with/without extension/ absolute path
     * @param {object} config 
     */
    addConfig(configType = '', filePath = '', config = {}) {
        try {
            filePath = this.getFilePath(configType, filePath)
        } catch (error) {
            throw error
        }
        let configData = this.readConfigData(configType, filePath);
        // check that config data does not exist in configData;
        for (let key in config) {
            if(configData[key] !== undefined){
                throw new Error('The configuration to add already exists and we cannot overwrite. Try editConfig() instead')
            }
        }
        configData = merge(configData, config)
        this.save(configType, filePath, configData)
        return true
    }

    /**
     * Delete values from config
     * @param {('json'|'yaml'|'yml'|'env')} configType 
     * @param {string} filePath - filename with/without extension/ absolute path
     * @param {array} config - fields to remove
     */
    deleteConfig(configType = '', filePath = '', config = []) {
        try {
            filePath = this.getFilePath(configType, filePath)
        } catch (error) {
            throw error
        }
        let configData = this.readConfigData(configType, filePath)
        for (let i of config) {
            delete configData[i]
        }
        this.save(configType, filePath, configData)
    }

    /**
     * Add new values to config/modify existing ones
     * @param {('json'|'yaml'|'yml'|'env')} configType 
     * @param {string} filePath - filename with/without extension/ absolute path
     * @param {object} config 
     */
    editConfig(configType = '', filePath = '', config = {}) {
        try {
            filePath = this.getFilePath(configType, filePath)
        } catch (error) {
            throw error
        }
        let configData = this.readConfigData(configType, filePath)
        configData = merge(configData, config)
        this.save(configType, filePath, configData)
    }

    /**
     * Save config values
     * @param {('json'|'yaml'|'yml'|'env')} configType 
     * @param {string} filePath - absolute path
     * @param {array} config - fields to save
     */
    save(configType, filePath, config) {
        try {
            filePath = this.getFilePath(configType, filePath)
        } catch (error) {
            throw error
        }
        switch (configType) {
            case "json":
                // configData = this.parseJSON(filePath);
                fs.writeFileSync(filePath, `${JSON.stringify(config).replace(/^{/, "{\n").replace(/","/g, `",\n"`).replace(/}$/, "\n}")}`);
                break;
            case "yaml":
            case "yml":
                // configData = this.parseYAML(filePath);
                fs.writeFileSync(filePath, `${yaml.safeDump(config)}`);
                break;
            case "env":
                fs.writeFileSync(filePath, `${yaml.safeDump(config).replace(/: /g, "=")}`);
                break;
            default:
                throw `unsupported config type ${configType}`
        }
    }

    /**
     * Load all configurations
     */
    all() {
        return merge(this.argv(), this.packageJson(), this.parseYAML(), this.parseJSON(), this.env());
    };
}

module.exports = new etc();