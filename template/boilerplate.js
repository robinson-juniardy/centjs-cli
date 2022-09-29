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

exports.makeModelBoilerplate = ModelBoilerPlate;
exports.makeControllerBoilerplate = ControllerBoilerPlate;
