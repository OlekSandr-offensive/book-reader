import { IRequestError } from '../interfaces/requestError.interface';

const errorMessages: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    500: "Internal Server Error",
};

const RequestError = (status: number, message: string = errorMessages[status]): IRequestError => {
    const error: IRequestError = new Error(message);
    error.status = status;
    return error;
};

export default RequestError;