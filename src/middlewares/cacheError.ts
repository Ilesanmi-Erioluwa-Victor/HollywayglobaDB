import { Error } from "../types/requestErrorType"


export const throwError= (errorMsg:string,statusCode:number) => {
    const error:Error=new Error(errorMsg)
    error.statusCode=statusCode
    throw error
}
