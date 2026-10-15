import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    const ltaKeyConfigured = Boolean(
      process.env.LTA_ACCOUNT_KEY || process.env.LTA_API_KEY
    );

    return res.status(200).json({
      status: 'ok',
      service: 'SG Bus Arrival Serverless Proxy',
      timestamp: new Date().toISOString(),
      ltaKeyConfigured,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return res.status(500).json({
      status: 'error',
      error: message
    });
  }
}
