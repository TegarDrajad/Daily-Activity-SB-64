import { NextApiRequest, NextApiResponse } from 'next'

export default async function Logout(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const token = req.headers.authorization

    if (!token) {
      return res.status(401).json({ message: 'No Token Provided' })
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/logout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error('Failed to logout')
    }

    return res.status(200).json({
      message: 'Logout Successful',
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Logout failed',
      error: (error as Error).message,
    })
  }
}
