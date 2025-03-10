import { useEffect, useState } from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { toast } from 'sonner'
import Replies from './replies'

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

// type ApiResponse = {
//   success: boolean
//   data: Post[]
//   message: string
// }

export default function PostsClientPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)

  const handleLikeToggle = async (postId: number, isLiked: boolean) => {
    try {
      const token = Cookies.get('token')
      if (!token) {
        setError('Token tidak ditemukan. Silahkan login.')
        return
      }

      const apiChoice = isLiked ? '/api/posts/unlikes' : '/api/posts/likes'
      const response = await fetch(apiChoice, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ post_id: postId }),
      })

      const data = await response.json()
      if (!response.ok)
        throw new Error(data.errorMessage || 'Gagal memperbarui likes')

      toast.success(isLiked ? 'Unlike berhasil!' : 'Like berhasil!')

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                is_like_post: !isLiked, // Toggle status like
                likes_count: isLiked
                  ? post.likes_count - 1
                  : post.likes_count + 1, // Update jumlah like
              }
            : post,
        ),
      )
    } catch (error) {
      console.log('internal server error', error)
    }
  }

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
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
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
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  {post.user.name}
                  {post.is_own_post && (
                    <span className="text-sm text-white bg-gray-400 px-2 py-1 rounded-md">
                      You
                    </span>
                  )}
                </h2>
                <p className="text-gray-500 text-sm">{post.user.email}</p>
              </div>
              <p className="mt-2 text-gray-700">{post.description}</p>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleLikeToggle(post.id, post.is_like_post)
                  }}
                  className={`flex items-center gap-1 ${
                    post.is_like_post ? 'text-red-500' : 'text-gray-500'
                  } cursor-pointer hover:scale-125`}
                >
                  {post.likes_count}
                  {post.is_like_post ? '❤️' : '🤍'}{' '}
                </button>
                <button
                  className="text-sm text-black mt-2 cursor-pointer"
                  onClick={() => setSelectedPostId(post.id)}
                >
                  💬 {post.replies_count} Replies
                </button>
                {selectedPostId === post.id && (
                  <Replies
                    postId={post.id}
                    open={selectedPostId !== null}
                    onClose={() => (setSelectedPostId(null), fetchPosts())}
                  ></Replies>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
