'use client'

import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Cookies from 'js-cookie'

type User = {
  id: number
  name: string
  email: string
}

type Post = {
  id: number
  description: string
  users_id: number
  deleted_at: string | null
  created_at: string
  updated_at: string
  likes_count: number
  replies_count: number
  is_like_post: boolean
  is_own_post: boolean
  user: User
}

type ApiResponse = {
  success: boolean
  message: string
  data: Post[]
}

const fetcher = async (url: string): Promise<ApiResponse> => {
  const token = Cookies.get('token')
  if (!token) throw new Error('Unauthorized')

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }

  return res.json()
}

export default function MyPostsPage() {
  const router = useRouter()
  const api_url = process.env.NEXT_PUBLIC_API_URL
  const { data, error, isLoading } = useSWR<ApiResponse>(
    `${api_url}/api/posts?type=me`,
    fetcher,
    { revalidateOnFocus: true },
  )

  if (isLoading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">{error.message}</p>

  const posts = data?.data || []

  return (
    <div className="container mx-auto p-4 flex flex-col gap-5">
      <div className="flex flex-row justify-between px-3">
        <h1 className="text-2xl font-bold">My Posts</h1>
        <button
          onClick={() => router.push('/posts/create')}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
        >
          + New Post
        </button>
      </div>

      <div>
        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <ul className="space-y-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`}>
                <li className="p-4 border rounded shadow mb-4">
                  <h2 className="text-xl font-semibold">{post.description}</h2>
                  <p className="text-gray-600">
                    Author: {post.user.name} / You
                  </p>
                  <p className="text-gray-500 text-sm">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex gap-4 mt-2">
                    <span>❤️ {post.likes_count}</span>
                    <span>💬 {post.replies_count}</span>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
