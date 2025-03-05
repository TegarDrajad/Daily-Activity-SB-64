import { NextApiRequest, NextApiResponse } from 'next'

export default async function DeletePosts(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ errorMessage: 'Method not allowed' })
  }

  try {
    const { id } = req.query
    if (!id) {
      return res.status(400).json({ errorMessage: 'Post ID is required' })
    }

    const token = req.headers.authorization || ''
    if (!token) {
      return res.status(401).json({ errorMessage: 'Unauthorized' })
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/post/delete/${id}`,
      {
        method: 'DELETE',
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
        .json({ errorMessage: responseData.message })
    }

    return res.status(200).json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Internal server error', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
