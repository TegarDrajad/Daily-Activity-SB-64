import { useEffect, useState } from 'react'
import Link from 'next/link'
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
  data: Post[]
  message: string
}

export default function PostsClientPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = Cookies.get('token')
        if (!token) {
          setError('Token tidak ditemukan. Silakan login.')
          setLoading(false)
          return
        }

        const Api_Url = process.env.NEXT_PUBLIC_API_URL
        const response = await fetch(`${Api_Url}/api/posts?type=all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error('Gagal mengambil data')

        const data = await response.json()
        setPosts(data.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  if (loading) return <p className="text-center text-gray-500">Loading...</p>
  if (error) return <p className="text-center text-red-500">Error: {error}</p>

  return (
    <div className="w-auto mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Daftar Postingan
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => {
          const initial = post.user.name.charAt(0).toUpperCase()
          const bgColor = `hsl(${post.user.name.length * 42}, 70%, 50%)`

          return (
            <Link
              href={'/'}
              key={post.id}
              className="block bg-white p-5 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 flex items-center justify-center text-white font-bold rounded-full"
                  style={{ backgroundColor: bgColor }}
                >
                  {initial}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {post.user.name}
                </h2>
                <p className="text-gray-500 text-sm">{post.user.email}</p>
              </div>
              <p className="mt-2 text-gray-700">{post.description}</p>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                <span>❤️ {post.likes_count} Likes</span>
                <span>💬 {post.replies_count} Replies</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
