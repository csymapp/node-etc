const path = require("path");
const { argv } = require('yargs')
const clone = require('clone')
const dotenv = require('dotenv')
const fs = require("fs-extra")
const yaml = require('js-yaml')
const merge = require('tea-merge')

class etc {
    /** constructor */
    constructor() { }

    /**
     * Read package.json [1] of current project or [2] from any other location. If dir is not supplied, the function moves up the directories in the cwd path and returns the first package.json found.
     * @param {string} [dir] - directory name from which to read package.json. Can be either a directory name or absolute path of directory
     * @returns {object} - Returns json object found or empty object 
     */
    packageJson(dir = '') {
        if (dir[0] === '/') { // absolute path supplied
            return require(path.join(dir, 'package.json'))
        }
        let directoryPath = process.cwd();
        let loops = true;
        if (dir !== '') { // directory name supplied
            loops = false;
            let re = new RegExp(`(/${dir}[^\n]*)`);
            directoryPath = directoryPath.replace(re, `/${dir}`)
        }

        let tryReading = (location) => {
            location = path.join(location, 'package.json')
            let tmp = false
            try {
                tmp = require(location)
                return tmp
            } catch (error) {
                error = tmp;
                return error
            }
        }
        let ret = false;
        while (true) {
            ret = tryReading(directoryPath)
            if (ret || directoryPath.length <= 1) break;
            directoryPath = directoryPath.replace(/\/[^\/]*$/, '')
            if (!loops) break
        }
        if (!ret) ret = {}
        return ret
    }

    /**
     * Read json file
     * @param {string} filePath - file to read
     * @returns {object} - Returns json object found or empty object
     */
    parseJSON(filePath) {
        try {
            return require(filePath);
        } catch (error) {
            error = {}
            return error
        }
    }

    /**
     * Read yaml file
     * @param {string} [filePath] - file to read. Either absolute path or file name. If filename is not given, it reads conf.yaml File name is given with either .yaml/.yml extension or without.
     * @returns {object} - Returns json object found or empty object
     */
    parseYAML(filePath = '') {
        let filePaths = []
        if (filePath === '') {
            filePath = 'conf'
        }
        if (filePath[0] === '/') { // absolute path supplied
            filePaths.push(filePath)
        } else {
            // check if it has extension
            let filenames = []
            let packageJson = this.packageJson();
            if (!filePath.match(/\.y[a]?ml$/)) {
                filenames.push(`${filePath}.yml`)
                filenames.push(`${filePath}.yaml`)
                if (packageJson.name) {
                    filePaths.push(`/etc/${packageJson.name}/${filePath}.yml`)
                    filePaths.push(`/etc/${packageJson.name}/${filePath}.yaml`)
                }
            } else {
                filenames.push(filePath)
                if (packageJson.name) {
                    filePaths.push(`/etc/${packageJson.name}/${filePath}`)
                }
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
            filenames = filenames.map(fileName => lookforFile(directoryPath, fileName))
            filenames.map(fileName => fileName ? filePaths.push(fileName) : false)
        }
        let ret = {}
        filePaths.map(filePath => {
            let yamlObject = {}
            try {
                let savedConfigs = fs.readFileSync(
                    filePath,
                    'utf-8'
                )
                yamlObject = yaml.safeLoad(savedConfigs) || {}
            } catch (error) {
                error = {}
                yamlObject = error
            }
            ret = merge(ret, yamlObject)
        })
        return ret
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
     * Loads only environment variables from a .env file in either [1] current project or [2] from any other location and returns process.env. If dir is not supplied, the function moves up the directories in the cwd path and returns the first .env file found.
     * @param {string} [dir] -  - directory name from which to read .env file. Can be either a directory name or absolute path of directory
     * @returns {object} - Returns json object found or empty object 
     */
    parseDotEnvOnly(dir = '') {
        let tmp = clone(process.env);
        let allEnv = this.env(dir);
        let ret = {};
        for (let i in allEnv) {
            if (!tmp[i]) {
                ret[i] = allEnv[i]
            }
        }

        for (let i in ret) {
            delete process.env[i]
        }
        return ret
    }

    /**
     * Loads environment variables from a .env file in either [1] current project or [2] from any other location and returns process.env. If dir is not supplied, the function moves up the directories in the cwd path and returns the first .env file found.
     * If absolute path is not given for dir, it also loads .env from /etc/{dir}. If dir is not given, it is taken as the program name as contained in the package.json file in the root directory of the project.
     * @param {string} [dir=''] - directory name from which to read .env file. Can be either a directory name or absolute path of directory
     * @returns {object} - Returns json object found or empty object 
     */
    env(dir = '') {
        let env = {};
        let loops = true;
        let directoryPath = process.cwd();
        let absolutePath = false;
        let dirProvided = false;

        if (dir[0] === '/') { // absolute path supplied
            loops = false;
            absolutePath = true;
            let envPath;
            if (!dir.match(/\.env$/)) {
                envPath = path.join(dir, '.env')
            } else {
                envPath = dir
            }
            dotenv.config({ path: envPath })
        }

        if (dir !== '') { // directory name supplied
            loops = false;
            dirProvided = true;
            let re = new RegExp(`(/${dir}[^\n]*)`);
            directoryPath = directoryPath.replace(re, `/${dir}`)
        }

        let tryReading = (location) => {
            if (!location.match(/\.env$/)) {
                location = path.join(location, dir)
            }
            if (!location.match(/\.env$/)) {
                location = path.join(location, '.env')
            }
            // location = path.join(location, '.env')
            let tmp = false
            try {
                if (fs.existsSync(location)) {
                    dotenv.config({ path: location })
                } else {
                    throw 1
                }
                return tmp
            } catch (error) {
                error = tmp;
                return error
            }
        }
        let ret = false;
        while (true) {
            ret = tryReading(directoryPath)
            if (ret || directoryPath.length <= 1) break;
            directoryPath = directoryPath.replace(/\/[^\/]*$/, '')
            if (!loops) break
        }
        if (!absolutePath) {
            directoryPath = ''
            if (dirProvided) {
                directoryPath = `/etc/${dir}`;
            } else {
                let packageJson = this.packageJson();
                if (packageJson.name) {
                    directoryPath = `/etc/${packageJson.name}`;
                }
            }
            loops = false;
            ret = tryReading(directoryPath);
        }

        env = clone(process.env)
        delete env["_"]
        return env;
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
     * Get filepath if file with given name exists in root directory or project or in /etc/{programName}
     * @param {('json'|'yaml'|'yml'|'env')} configType 
     * @param {string} fileName 
     */
    getFilePath(configType = '', fileName = '') {
        if (fileName[0] === '/') { // absolute path supplied as argument
            return fileName
        }
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
        // look in project directory
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
        let filePath = lookforFile(directoryPath, fileName);
        if (!fs.existsSync(filePath)) {
            let projectName = this.packageJson().name || false
            if (projectName) {
                filePath = lookforFile(path.join('/etc', projectName, fileName), fileName);
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
        let configData = this.readConfigData(configType, filePath)
        configData = merge(configData, config)
        this.save(configType, filePath, configData)
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
     * create file if it does not exists
     * @param {string} filePath 
     */
    createConfig(filePath) {
        if (!fs.existsSync(filePath)) {
            fs.createFileSync(filePath)
        }
    }

    /**
     * Load all configurations
     */
    all() {
        return merge(this.argv(), this.parseDotEnvOnly(), this.packageJson(), this.parseYAML());
    };
}

module.exports = new etc();