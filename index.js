#!/usr/bin/env node
const { execSync } = require("child_process")
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;
const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");
const { makeControllerBoilerplate, makeModelBoilerplate, makeTsConfigBoilerplate, makeIndexServerBoilerplate, makeDbConfigBoilerplate, makeEnvBoilerplate, makePackageJsonFile, makeWelcomeController } = require("./template/boilerplate");
const prompt = inquirer.createPromptModule()
const shell = require("shelljs")
const chalk = require("chalk")
const Listr = require('listr');

function MakeModel(modelName) {
    const mpath      = path.join(process.cwd(), 'src/app/model', `${String(modelName).toLocaleLowerCase()}.model.ts`)
    const mmodule    = String(modelName).split("/")
    const mcontrol   = mmodule[mmodule.length - 1]
    const mnamespace = mmodule.filter((v) => !v.includes(mcontrol))

    const model_info = {
        model : `${ String(mcontrol).toLocaleLowerCase() }.model.ts`,
        model_path : path.join(process.cwd(), 'src/app/model', String(mnamespace.map((v) => String(v))).replaceAll(",","/"))
    }

    if (fs.existsSync(model_info.model_path)) {
        if (fs.existsSync(mpath)) {
            prompt({
                type: "confirm",
                name: "file_exist",
                message: "file already exist, did you want to overwrite it?",
                default: false
            }).then((answer) => {
                if (answer.file_exist) {
                    fs.rmSync(mpath);
                    try {
                        fs.writeFileSync(mpath, makeModelBoilerplate(mcontrol.charAt(0).toUpperCase() + mcontrol.substring(1, mcontrol.length)))
                        console.log(chalk.green(`${mcontrol}_Model has created succesfully !!`))
                    } catch (error) {
                        console.log(chalk.red(error))
                    }
                } else {
                    console.log(chalk.blue("please make sure naming controller for unique name !!"))
                }
            })
        }
    } else {
        shell.mkdir('-p',model_info.model_path)
        fs.writeFileSync(mpath, makeModelBoilerplate(mcontrol.charAt(0).toUpperCase() + mcontrol.substring(1, mcontrol.length)))
        console.log(chalk.green(`${mcontrol}_Model has created succesfully !!`))
    }

}

function MakeController(controllerName) {
    const cpath      = path.join(process.cwd(), 'src/app/controller', `${String(controllerName).toLocaleLowerCase()}.controller.ts`)
    const cmodule    = String(controllerName).split("/")
    const ccontrol   = cmodule[cmodule.length - 1]
    const cnamespace = cmodule.filter((v) => !v.includes(ccontrol))

    const controller_info = {
        controller : `${ String(ccontrol).toLocaleLowerCase() }.controller.ts`,
        controller_path : path.join(process.cwd(), 'src/app/controller', String(cnamespace.map((v) => String(v))).replaceAll(",","/"))
    }

    if (fs.existsSync(controller_info.controller_path)) {
        if (fs.existsSync(cpath)) {
            prompt({
                type: "confirm",
                name: "file_exist",
                message: "file already exist, did you want to overwrite it?",
                default: false
            }).then((answer) => {
                if (answer.file_exist) {
                    fs.rmSync(cpath);
                    try {
                        fs.writeFileSync(cpath, makeControllerBoilerplate(ccontrol.charAt(0).toUpperCase() + ccontrol.substring(1, ccontrol.length)))
                        console.log(chalk.green(`${ccontrol}_Controller has created succesfully !!`))
                    } catch (error) {
                        console.log(chalk.red(error))
                    }
                } else {
                    console.log(chalk.blue("please make sure naming controller for unique name !!"))
                }
            })
        }
    } else {
        shell.mkdir('-p',controller_info.controller_path)
        fs.writeFileSync(cpath, makeControllerBoilerplate(ccontrol.charAt(0).toUpperCase() + ccontrol.substring(1, ccontrol.length)))
        console.log(chalk.green(`${ccontrol}_Controller has created succesfully !!`))
    }
}

function runBrowser(url) {
    const { platform } = require("os")
    const { exec } = require('child_process');

    const WINDOWS_PLATFORM = 'win32';
    const MAC_PLATFORM = 'darwin';

    const osPlatform = platform();

    let command;

    if (osPlatform === WINDOWS_PLATFORM) {
    command = `start microsoft-edge:${url}`;
    } else if (osPlatform === MAC_PLATFORM) {
    command = `open -a "Google Chrome" ${url}`;
    } else {
    command = `google-chrome --no-sandbox ${url}`;
    }

    console.log(`executing command: ${command}`);

    exec(command);
}

function runServer() {
     const runCmd = (command) => {
    try {
        execSync(`${command}`, { stdio: "inherit" });
    } catch (e) {
        console.error(`failed to execute ${command}`, e);
        return false;
    }
    return true;
    };

    const run = `npm run dev`

    runCmd(run)
}

function MakeApp(AppName) {
    const runCmd = (command) => {
    try {
        execSync(`${command}`, { stdio: "inherit" });
    } catch (e) {
        console.error(`failed to execute ${command}`, e);
        return false;
    }
    return true;
    };

    // const repoName = process.argv[2];
    const gitCheckoutCmd = `git clone --depth 1 https://github.com/robinson-juniardy/centjs-framework.git ${AppName}`;
    const installDepsCmd = `cd ${AppName} && npm install`;

    console.log(`generate CentJS ${AppName} project`);
    const checkout = runCmd(gitCheckoutCmd);
    if (!checkout) process.exit(-1);

    try {
        fs.rm(path.join(process.cwd(), AppName, "package.json"))
        console.log(chalk.bgGreen("generating package.json"))

    } catch (error) {
        
    }

    console.log(`installing CentJS dependencies for ${AppName}`);
    const installedDeps = runCmd(installDepsCmd);
    if (!installedDeps) process.exit(-1);

    console.log("Congratulations! You are ready. run the following commands to start");
    console.log(`cd ${repoName} && cent serve`);
}

function createFilesProject(project_name) {

    const runCmd = (command) => {
        try {
            execSync(`${command}`, { stdio: "inherit" });
        } catch (e) {
            console.error(`failed to execute ${command}`, e);
            return false;
        }
        return true;
    };

    /**
     * create project working dir
     */
    const project_path = path.join(process.cwd(), project_name)
    shell.mkdir('-p', project_path)

    /**
     * generate project directory
     */
    const config_path       = path.join(project_path,"src/app/config")
    const controller_path   = path.join(project_path,"src/app/controller")
    const model_path        = path.join(project_path,"src/app/model")
    const data_path         = path.join(project_path,"src/app/data")
    const services_path     = path.join(project_path,"src/app/services")
    const utils_path        = path.join(project_path,"src/app/utils")
    

    // create config path
    shell.mkdir('-p', config_path)

    //create controller path
    shell.mkdir('-p', controller_path)

    //create welcome controller path
    shell.mkdir('-p', path.join(controller_path, "welcome"))

    //create model path
    shell.mkdir('-p', model_path)

    //create data path
    shell.mkdir('-p', data_path)

    //create services path
    shell.mkdir('-p', services_path)

    //create utils path
    shell.mkdir('-p', utils_path)

    /**
     * installing dependencies and more file
     */
    const installDepsCommand = `cd ${project_name} && npm install --save-dev @types/express @types/node ts-node @centjs/core @centjs/orm @types/cors @centjs/data reflect-metadata typescript @types/mssql @types/mysql @types/pg && npm install express dotenv cors mysql mssql pg`
    const initGit = `cd ${project_name} && git init && echo node_modules>>.gitignore`
    const autoRunServer = `cd ${project_name} && npm run dev`
    
    //create package json file
    fs.writeFileSync(path.join(project_path, "package.json"), makePackageJsonFile(project_name))
    runCmd(installDepsCommand)
    runCmd(initGit)


    // create default centjs tsconfig
    fs.writeFileSync(path.join(project_path, "tsconfig.json"), makeTsConfigBoilerplate())

    // create server file
    fs.writeFileSync(path.join(project_path, "src/index.ts"), makeIndexServerBoilerplate())

    //create database config file
    fs.writeFileSync(path.join(project_path, "src/app/data/cent.database.ts"), makeDbConfigBoilerplate())

    //create welcome controller file
    fs.writeFileSync(path.join(project_path, "src/app/controller/welcome/welcome.controller.ts"), makeWelcomeController())


    //create .env file
    fs.writeFileSync(path.join(project_path, ".env"), makeEnvBoilerplate())

    console.log(chalk.green("cent application dependencies has been installed successfully"))
    console.log(chalk.green("your project is ready to code.. Good Luck!"))

    runCmd(autoRunServer)
    runBrowser("http://localhost:5555/welcome")
}

function CreateArguments() {
    const arguments = argv._[0];
    if (arguments) {
        const commander = arguments.split(":")[0];
        const moduleType = arguments.split(":")[1];
        if (commander) {
            if (commander === "make") {
                const moduleName = argv._[1];
                if (moduleType === "controller") {
                    if (moduleName) {
                        MakeController(moduleName);
                    } else {
                        console.log(chalk.red("You must type controller name !!!"));
                    }
                } else if (moduleType === "model") {
                    if (moduleName) {
                        MakeModel(moduleName)
                    } else {
                        console.log(chalk.red("You must type model name !!!"));
                    }
                }
            }else if (commander === "serve") {
                runServer()
                runBrowser("http://localhost:5555/")
            } else if (commander === "create") {
                const moduleName = argv._[1];
                if (moduleType === "app") {
                    if (moduleName) {
                        console.log(__dirname)
                    } else {
                        prompt({
                            type: "input",
                            name: "appname",
                            message: "your project name ?",
                            default: __dirname.split("\\")[__dirname.split("\\").length - 1]
                        }).then((answer) => {
                            createFilesProject(answer.appname)
                        })
                    }
                }
            }
        }
    }
}


// const task = new Listr([
//     {
//         title: 'Generate File',
//         task: () => CreateArguments()
//     }
// ])

// task.run().catch(err => {
//     console.error(chalk.red("error", err))
// })

CreateArguments()



