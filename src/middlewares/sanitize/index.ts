import { Request, Response, NextFunction } from 'express';
import xss from 'xss';

class SanitizeInputMiddleware {
  static sanitizeInput(req: Request, res: Response, next: NextFunction): void {
    req.body = SanitizeInputMiddleware.sanitizeObject(req.body);
    req.query = SanitizeInputMiddleware.sanitizeObject(req.query);
    req.params = SanitizeInputMiddleware.sanitizeObject(req.params);
    next();
  }

  private static sanitizeObject(obj: any): any {
    const sanitizedObj: { [key: string]: any } = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitizedObj[key] = xss(obj[key] as string);
      }
    }

    return sanitizedObj;
  }
}

export default SanitizeInputMiddleware;
