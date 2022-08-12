// Object.freeze prevents the modification, addition and deletion of existing values
exports.Code = Object.freeze({
    TimeOut: 110,                          // The server is not responding for too long.
    ConnectionRefused: 111,                // The server has rejected the connection
    Success: 200,                          // Success
    Created: 201,                          // The document has been saved on the server    
    BadRequest: 400,                       // Invalid query
    Unauthorized: 401,                     // Unauthorized 
    NotFound: 404,                         // Not Found
    MethodNotAllowed: 405,                 // The method contained in the request is not allowed 
    Conflict: 409,                         // Conflict, resource exists
    ServerError: 500,                      // Internal server error
});