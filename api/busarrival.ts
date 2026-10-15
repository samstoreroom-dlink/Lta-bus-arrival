import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  // Only accept GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Use GET to query bus arrival timings.'
    });
  }

  try {
    // 1. Extract query params (case-insensitive for convenience)
    const busStopCode = (req.query.BusStopCode || req.query.busStopCode || req.query.busstopcode) as string | undefined;
    const serviceNo = (req.query.ServiceNo || req.query.serviceNo || req.query.serviceno) as string | undefined;

    if (!busStopCode) {
      return res.status(400).json({
        error: 'Missing BusStopCode',
        message: 'A 5-digit bus stop code is required. Example: /api/busarrival?BusStopCode=83139'
      });
    }

    // 2. Resolve LTA Account Key (Environment Variable prioritized, fallback to request headers)
    const accountKey = (
      process.env.LTA_ACCOUNT_KEY ||
      process.env.LTA_API_KEY ||
      req.headers['accountkey'] ||
      req.headers['x-account-key'] ||
      req.query.AccountKey
    ) as string | undefined;

    if (!accountKey) {
      return res.status(401).json({
        error: 'LTA AccountKey Missing',
        message: 'No LTA Datamall AccountKey provided. Please set the LTA_ACCOUNT_KEY environment variable in your deployment or pass it via the AccountKey header.',
        hint: 'Sign up for a free developer key at https://datamall.lta.gov.sg/ to query live Datamall v3 endpoints.'
      });
    }

    // 3. Construct target LTA DataMall v3 URL
    const targetUrl = new URL('https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival');
    targetUrl.searchParams.set('BusStopCode', busStopCode.trim());
    if (serviceNo && serviceNo.trim()) {
      targetUrl.searchParams.set('ServiceNo', serviceNo.trim());
    }

    // 4. Fetch live data from LTA DataMall
    const ltaResponse = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        'AccountKey': accountKey.trim(),
        'accept': 'application/json'
      }
    });

    if (!ltaResponse.ok) {
      const errorText = await ltaResponse.text();
      return res.status(ltaResponse.status).json({
        error: 'LTA DataMall Error',
        statusCode: ltaResponse.status,
        message: `LTA server responded with status ${ltaResponse.status}`,
        details: errorText
      });
    }

    const data = await ltaResponse.json();

    // Cache headers for sensible client caching (e.g. 15-30s cache for transit countdowns)
    res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=30');

    return res.status(200).json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown internal server error';
    return res.status(500).json({
      error: 'Proxy Error',
      message: 'Failed to connect to LTA DataMall serverless endpoint',
      details: message
    });
  }
}
