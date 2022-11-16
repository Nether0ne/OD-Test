import IHttpResponse from "@models/misc/http-response.model";

export default interface IHttpException extends IHttpResponse {
  success: boolean;
  message: string;
}
