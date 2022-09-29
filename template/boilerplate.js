function ControllerBoilerPlate(controllerName) {
  return `import Cent, {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Request,
    Response,
    Next,
} from "@centjs/core";
import * as CentOrm from "@centjs/orm";

/** 
 * file created detail
 * ${String(controllerName)} Controller
 * created At : ${new Date()}
*/

@Controller("/${String(controllerName).toLowerCase()}")
export default class ${String(controllerName)}_Controller {
    @Get("/")
    public index(request: Request, response: Response) {
        response.json({
            message: "Welcome To ${controllerName}",
        });
    }
}`;
}

function ModelBoilerPlate(modelName) {
  return `import * as CentOrm from "@centjs/orm";

/** 
 * file created detail
 * ${String(modelName)} Model
 * created At : ${new Date()}
*/

@CentOrm.Model("table_name")
export default class ${modelName}_Model {

    @CentOrm.Column({ serializeName: "id" })
    public id: CentOrm.integer

    @CentOrm.Column({ serializeName: "name" })
    public name: CentOrm.varchar
}`;
}

function indexServerBoilerplate() {
  return `import Cent, { LoadRouters } from "@centjs/core";
import cors from "cors";
import "reflect-metadata";
import path from "path";
import { config } from "dotenv";

config();
const port = process.env.PORT || 5555;

const App = Cent.Instance();

App.use(cors());
App.use(Cent.Instance.json());
App.use(Cent.Instance.urlencoded({ extended: false }));

App.use(LoadRouters("src/app/controller"));

App.listen(port, () => {
  console.log("⚡️[server]: Server is running at Port: "+port);
});
`;
}

function createEnvFile() {
  return `PORT=5555

MSSQL_CONFIG_SERVER=
MSSQL_CONFIG_USERNAME=
MSSQL_CONFIG_PASSWORD=
MSSQL_CONFIG_DBNAME=

MYSQL_CONFIG_SERVER=
MYSQL_CONFIG_USERNAME=
MYSQL_CONFIG_PASSWORD=
MYSQL_CONFIG_DBNAME=`;
}

function createTSConfig() {
  return `{
  "compilerOptions": {
    "target": "ES2021",
    "lib": ["ES2021.String"],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "declaration": true,
    "declarationDir": "./build/modules",
    "declarationMap": true,
    "module": "CommonJS",
    "outDir": "./build",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitAny": false,
    "skipLibCheck": true
  }
}
`;
}

function createDBConfig() {
  return `import Database from "@centjs/data";

/**
 * SQL Server Database Connection Configurations,
 * setting that content of database cofigurations in .env file
 * @example
 * MSSQL_CONFIG_SERVER=localhost
 * MSSQL_CONFIG_USERNAME=centadmin
 * MSSQL_CONFIG_PASSWORD=qwrtsr4321
 * MSSQL_CONFIG_DBNAME=db_greetings
 */
export const MSSQLDB = new Database({
  provider: "sqlserver",
  config: {
    server: process.env.MSSQL_CONFIG_SERVER,
    user: process.env.MSSQL_CONFIG_USERNAME,
    password: process.env.MSSQL_CONFIG_PASSWORD,
    database: process.env.MSSQL_CONFIG_DB_NAME,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
    pool: {
      idleTimeoutMillis: 30000,
      max: 10,
      min: 1,
    },
  },
});

/**
 * MYSQL Database Connection Configurations,
 * setting that content of database cofigurations in .env file
 * @example
 * MYSQL_CONFIG_SERVER=localhost
 * MYSQL_CONFIG_USERNAME=centadmin
 * MYSQL_CONFIG_PASSWORD=qwrtsr4321
 * MYSQL_CONFIG_DBNAME=db_greetings
 */

export const MYSQLDB = new Database({
  provider: "mysql",
  config: {
    host: process.env.MYSQL_CONFIG_SERVER,
    user: process.env.MYSQL_CONFIG_USERNAME,
    password: process.env.MYSQL_CONFIG_PASSWORD,
    database: process.env.MYSQL_CONFIG_DBNAME,
  },
});
`;
}

function createWelcomeController() {
  return `import Cent, {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Request,
  Response,
  Next,
} from "@centjs/core";
import * as CentOrm from "@centjs/orm";

@Controller("/")
export default class Welcome {
  @Get("/welcome")
  public welcomeMessage(request: Request, response: Response) {
    response.json({
      message: "Welcome To CentJs Framework",
    });
  }
}
`;
}

function createPackageJson(project_name) {
  return `{
  "name": \"${project_name}\",
  "version": "1.0.0",
  "description": "centjs starter kit framerwork integrated with express js",
  "main": "index.js",
  "scripts": {
    "build": "npx tsc",
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts"
  },
  "author": "",
  "license": "ISC"
}
`;
}

exports.makeEnvBoilerplate = createEnvFile;
exports.makeDbConfigBoilerplate = createDBConfig;
exports.makeTsConfigBoilerplate = createTSConfig;
exports.makeIndexServerBoilerplate = indexServerBoilerplate;
exports.makeModelBoilerplate = ModelBoilerPlate;
exports.makeControllerBoilerplate = ControllerBoilerPlate;
exports.makePackageJsonFile = createPackageJson;
exports.makeWelcomeController = createWelcomeController;
