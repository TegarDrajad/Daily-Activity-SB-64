import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const parsedData = loginSchema.parse(req.body)

    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsedData),
    })

    const result = await response.json()

    if (!response.ok) {
      return res.status(response.status).json(result)
    }

    return res.status(200).json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: 'Validation failed', errors: error.errors })
    }

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
