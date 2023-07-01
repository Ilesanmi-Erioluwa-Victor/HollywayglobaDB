"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageNotFound = void 0;
const pageNotFound = (req, res, next) => {
    res.status(404).send('Page not found');
};
exports.pageNotFound = pageNotFound;
