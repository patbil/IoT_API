// Object.freeze prevents the modification, addition and deletion of existing values
exports.Code = Object.freeze({
    TimeOut: 110,                          // The server is not responding for too long.
    ConnectionRefused: 111,                // The server has rejected the connection
    Success: 200,                          // Success
    Created: 201,                          // The document has been saved on the server 
    Accepted: 202,                         // The inquiry has been accepted and is waiting for execution   
    NoContent: 204,                        // The server has fulfilled the client's query and you do not need to address the content
    Found: 302,                            // Temporary redirection 
    SeeOther: 303,                         // Redirection for POST requests          
    BadRequest: 400,                       // Invalid query
    Unauthorized: 401,                     // Unauthorized access. Authentication required
    Forbidden: 403,                        // Forbidden - The server understood the query, but authentication is required
    NotFound: 404,                         // Not Found
    MethodNotAllowed: 405,                 // The method contained in the request is not allowed 
    RequestTimeout: 408,                   // End of waiting time for request
    Conflict: 409,                         // Conflict, resource exists
    UnprocessableEntity: 422,              // The query was well-formed but was impossible to proceed due to semantic errors. 
    TooManyRequests: 429,                  // The user has sent too many requests at the same time.
    ServerError: 500,                      // Internal server error
    NotImplemented: 501,                   // Not implemented - the server does not have the functionality required in the request
    ServiceUnavailable: 503,               // Service unavailable - the server is not able to fulfill the client's request at the moment due to overload
});