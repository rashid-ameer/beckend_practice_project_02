import ERROR_CODES from "../constants/errorCodes";
import HTTP_CODES from "../constants/httpCodes";

class ApiError extends Error {
  public status: HTTP_CODES;
  public errorCode?: ERROR_CODES;

  constructor(status: HTTP_CODES, message: string, errorCode?: ERROR_CODES) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
  }
}

export default ApiError;
