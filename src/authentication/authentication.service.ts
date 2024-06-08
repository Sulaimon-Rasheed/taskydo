import { Injectable, ForbiddenException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
dotenv.config();

@Injectable()
export class AuthenticationService {
  private readonly jwtSecret: string = process.env.JWT_SECRET;

  generateJwtToken(id: number, email: string, userName: string): string {
    try {
      const tokenPayload = { id, email, userName };
      return jwt.sign(tokenPayload, this.jwtSecret, { expiresIn: '2h' });
    } catch (err) {
      throw new Error(err.meessage);
    }
  }

  async ensureLogin(req: Request, res: Response) {
    try {
      const token: string = req.cookies.jwt;
      if (!token) {
        throw new ForbiddenException('Jwt is required');
      } else {
        const decoded = await jwt.verify(token, this.jwtSecret);
        res.locals.user = decoded;
      }
    } catch (err) {
      throw new ForbiddenException('Jwt is required');
    }
  }
}
