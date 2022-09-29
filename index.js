#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;
const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");
const { makeControllerBoilerplate, makeModelBoilerplate } = require("./template/boilerplate");
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
                console.log("serve")
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



