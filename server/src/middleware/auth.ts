import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../types';

interface JwtPayload {
  id: string;
  username: string;
  email: string;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({
        success: false,
        message: 'JWT secret is not configured'
      });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    
    // Verify user still exists
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User no longer exists'
      });
      return;
    }

    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

export const generateToken = (payload: JwtPayload): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!jwtSecret) {
    throw new Error('JWT secret is not configured');
  }

  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn } as jwt.SignOptions);
};