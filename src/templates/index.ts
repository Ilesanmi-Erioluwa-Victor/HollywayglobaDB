import nodemailer from 'nodemailer';

import { UserI } from './interfaces';

import { RequestHandler, NextFunction, Request, Response } from 'express';

import { ENV } from '../configurations/env';

import { userQueries } from '../modules/User/models/user.model';

import { adminQueries } from '../modules/Admin/models/admin.models';

const { findUserMId } = userQueries;

const { findAdminIdM } = adminQueries;

export class Email {
  private async sendMailAcc(
    type: string,
    data: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let resetUrl;
    let transport;
    let mailOptions;

    switch (type) {
      case 'user':
        transport = nodemailer.createTransport({
          host: 'sandbox.smtp.mailtrap.io',
          port: 2525,
          auth: {
            user: ENV.NODEMAILER.USERNAME,
            pass: ENV.NODEMAILER.PASSWORD,
          },
        });

        resetUrl = `Kindly use this link to verify your account...
        <a href= ${req.protocol}://${req.get('host')}/api/v1/user/${
          data?.id
        }/verify_account/${data?.accountVerificationToken}>Click to verify..</a>
       `;
        mailOptions = {
          from: 'HollwayGlobalIncLimited@gmail.com',
          to: `${data?.email}`,
          subject: 'Account Verification ',
          text: `Hey ${data?.lastName} - ${data?.firstName}, Please verify your account by clicking the link below: 😉 `,
          html: resetUrl,
        };

        return await transport.sendMail(mailOptions);

      case 'admin':
        transport = nodemailer.createTransport({
          host: 'sandbox.smtp.mailtrap.io',
          port: 2525,
          auth: {
            user: ENV.NODEMAILER.USERNAME,
            pass: ENV.NODEMAILER.PASSWORD,
          },
        });

        resetUrl = `Kindly use this link to verify your account...
        <a href= ${req.protocol}://${req.get('host')}/api/v1/admin/${
          data?.id
        }/verify_account/${data?.accountVerificationToken}>Click to verify..</a>
       `;

        mailOptions = {
          from: 'HollwayGlobalIncLimited@gmail.com',
          to: `${data?.email}`,
          subject: 'Account Verification ',
          text: `Hey ${data?.name}, Please verify your account by clicking the link below: 😉 `,
          html: resetUrl,
        };

        return await transport.sendMail(mailOptions);
    }
  }

  private async sendMailToken(
    type: string,
    data: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let resetUrl;
    let transport;
    let mailOptions;

    switch (type) {
      case 'user':
        transport = nodemailer.createTransport({
          host: 'sandbox.smtp.mailtrap.io',
          port: 2525,
          auth: {
            user: ENV.NODEMAILER.USERNAME,
            pass: ENV.NODEMAILER.PASSWORD,
          },
        });

        resetUrl = `Kindly use this link to verify your account...
        <a href= ${req.protocol}://${req.get(
          'host'
        )}/api/v1/auth/resetPassword/${
          data.token
        }>Click here to reset your password..</a>
       `;

        mailOptions = {
          from: 'HollwayGlobalIncLimited@gmail.com',
          to: `${data.user.email}`,
          subject: 'Password Reset Token',
          text: `Your password reset token 😉 `,
          html: resetUrl,
        };

        return await transport.sendMail(mailOptions);

      case 'admin':
        transport = nodemailer.createTransport({
          host: 'sandbox.smtp.mailtrap.io',
          port: 2525,
          auth: {
            user: ENV.NODEMAILER.USERNAME,
            pass: ENV.NODEMAILER.PASSWORD,
          },
        });

        resetUrl = `Kindly use this link to verify your account...
        <a href= ${req.protocol}://${req.get(
          'host'
        )}/api/v1/admin/resetPassword/${
          data?.token
        }>Click here to reset your password..</a>
       `;

        mailOptions = {
          from: 'HollwayGlobalIncLimited@gmail.com',
          to: `${data?.email}`,
          subject: 'Password Reset Token',
          text: `Your password reset token 😉 `,
          html: resetUrl,
        };

        return await transport.sendMail(mailOptions);
    }
  }

  static async sendMail(
    type: string,
    data: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const mail = new Email();

    switch (type) {
      case 'user':
        console.log(data);
        return await mail.sendMailAcc('user', data, req, res, next);

      case 'admin':
        return await mail.sendMailAcc('admin', data, req, res, next);
    }
  }

  static async sendMailToken(
    type: string,
    data: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const mail = new Email();
    switch (type) {
      case 'user':
        return await mail.sendMailToken('user', data, req, res, next);

      case 'admin':
        return await mail.sendMailToken('admin', data, req, res, next);
    }
  }
}
