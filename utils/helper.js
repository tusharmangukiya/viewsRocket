const {validIdPattern} = require("../common");
const passport = require('passport');

var getErrorResponse = (err) => {
	return {
		status: false,
		error: err
	}
}

var authCheck = passport.authenticate('jwt', { session: false });

var getSuccessResponse = (respObject) => {
	return {
		status: true,
		data: respObject
	}
}

var removeFields = (obj, keys, removeBasicFields = true) => {
	var basicFields = ["createdAt", "updatedAt", "isDeleted", "deletedBy", "deletedAt", "__v"];
	keys = typeof keys == "string" ? [keys] : keys || [];

    if(removeBasicFields)
        keys = keys.concat(basicFields);
 
    keys.forEach(key => {
        delete obj[key]
    });
    return obj;
}

var isValidId = (id) => {
	id = id.toString();
	return id.match(validIdPattern) != null;
}

module.exports = {
	getErrorResponse,
    getSuccessResponse,
    removeFields, isValidId, authCheck
};