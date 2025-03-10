'use client'

import { useRouter } from 'next/router'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { toast } from 'sonner'

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
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const api_url = process.env.NEXT_PUBLIC_API_URL
  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(
    `${api_url}/api/posts?type=me`,
    fetcher,
    { revalidateOnFocus: true },
  )

  if (isLoading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">{error.message}</p>

  const posts = data?.data || []

  const handleDelete = async () => {
    if (!deleteId) return

    const token = Cookies.get('token')
    if (!token) {
      return alert('Unauthorized')
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/post/delete/${deleteId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!res.ok) throw new Error('Failed to delete post')
      mutate()

      toast.success('Post deleted successfully')
    } catch (error) {
      toast.error('Failed to delete post')
      console.error('Delete error:', error)
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="container mx-auto p-4 flex flex-col gap-5">
      <div className="flex flex-row justify-between px-3">
        <h1 className="text-2xl font-bold">My Posts</h1>
        <button
          onClick={() => router.push('/posts/create')}
          className="cursor-pointer px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-300 transition duration-300"
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
              <li
                key={post.id}
                className="p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-200 bg-white"
              >
                <div className="flex justify-between items-center">
                  <div className="cursor-pointer w-full">
                    <h2 className="text-xl font-bold text-gray-800">
                      {post.description}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Author : {post.user.name} / You
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex gap-4 mt-2 text-gray-700">
                      <span>❤️ {post.likes_count}</span>
                      <span>💬 {post.replies_count}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm: justify-between">
                    <button
                      onClick={() => router.push(`/posts/${post.id}`)}
                      className="px-4 py-2 text-sm font-medium text-black bg-gray-300 hover:bg-gray-200 transition duration-300 rounded-lg cursor-pointer"
                    >
                      Edit
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={() => setDeleteId(post.id)}
                          className="px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-red-600 transition duration-300 bg-gray-800 cursor-pointer"
                        >
                          Delete
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this post.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeleteId(null)}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-gray-950 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
