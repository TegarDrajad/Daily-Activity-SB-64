import { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'

export default async function Logout(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const token = req.cookies.token

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

    res.setHeader(
      'Set-Cookie',
      serialize('token', '', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: -1, // Hapus cookie dengan set maxAge ke -1
      }),
    )

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
