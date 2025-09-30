import {config} from 'dotenv';
config();

class AppError extends Error {
    constructor (message, statusCode){
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructot);
    }
}

export default AppError;