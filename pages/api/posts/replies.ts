import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const replySchema = z.object({
  post_id: z.number(),
  description: z.string().min(1, 'Reply tidak boleh kosong'),
})

export default async function handleReply(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ errorMessage: 'Method not allowed' })
  }

  try {
    const { post_id, description } = replySchema.parse(req.body)

    const token = req.headers.authorization || ''

    if (!token) {
      return res.status(401).json({ errorMessage: 'Unauthorized' })
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/replies/post/${post_id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ description }),
      },
    )

    const responseData = await response.json()
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ errorMessage: responseData.message || 'Failed to post reply' })
    }

    return res.status(200).json(responseData)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.flatten().fieldErrors })
    }

    console.error('Server Error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
