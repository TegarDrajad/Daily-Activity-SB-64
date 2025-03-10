import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const unlikeSchema = z.object({
  post_id: z.number(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ errorMessage: 'Method not allowed' })
  }

  try {
    const { post_id } = unlikeSchema.parse(req.body)

    const token = req.headers.authorization || ''
    if (!token) {
      return res.status(401).json({ errorMessage: 'Unauthorized' })
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/unlikes/post/${post_id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    )

    const responseData = await response.json()
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ errorMessage: responseData.message || 'Failed to unlike post' })
    }

    return res.status(200).json(responseData)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.flatten().fieldErrors
      return res.status(400).json({ errors })
    }

    console.error('Server Error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
