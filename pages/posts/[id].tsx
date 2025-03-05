'use client'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

type User = {
  id: number
  name: string
  email: string
  dob: string
  phone: string
  hobby: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

type ListPosts = {
  id: number
  description: string
  users_id: number
  deleted_at: string | null
  created_at: string
  updated_at: string
  is_like_post: boolean
  is_own_post: boolean
  user: User
}

type PostsResponse = {
  success: boolean
  message: string
  data: ListPosts
}

export default function PostEditPage() {
  const router = useRouter()
  const { id } = router.query // id dari URL
  const [postData, setPostData] = useState<ListPosts | null>(null)
  const [loading, setLoading] = useState(true)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [error, setError] = useState<string>('')

  // Client-side fetch data berdasarkan ID dengan token dari cookie
  useEffect(() => {
    if (!id) return // Tunggu sampai id tersedia
    const token = Cookies.get('token')
    if (!token) {
      alert('Unauthorized! Please log in.')
      router.push('/auth/login')
      return
    }

    fetch(`https://service.pace-unv.cloud/api/post/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch post data')
        return res.json()
      })
      .then((data: PostsResponse) => {
        setPostData(data.data)
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
      })
  }, [id, router])

  // Handle update, hanya mengirim field description
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!postData) return
    setUpdateLoading(true)
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Unauthorized! Please log in.')
      router.push('/auth/login')
      return
    }
    try {
      const response = await fetch(
        `https://service.pace-unv.cloud/api/post/update/${postData.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ description: postData.description }),
        },
      )
      const result = await response.json()
      if (!response.ok) {
        alert('Failed to update post!')
        return
      }
      alert(result.message)
      router.push('/posts')
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Internal Server Error!')
    } finally {
      setUpdateLoading(false)
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">{error}</p>
  if (!postData) return <p>No post data found.</p>

  return (
    <div className="flex flex-col gap-5 justify-center p-6">
      {/* Card Post Detail */}
      <div className="p-4 bg-white shadow-sm rounded-lg">
        <h1 className="text-xl font-semibold">Post Detail</h1>
        <p className="text-gray-700">{postData.description}</p>
        <p className="text-sm text-gray-500 mt-2">By {postData.user.name}</p>
      </div>

      {/* Form Update */}
      <div className="w-auto sm:min-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Post</h2>
        <form className="space-y-4" onSubmit={handleUpdate}>
          {/* Description Input */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Update description..."
              value={postData.description}
              onChange={(e) =>
                setPostData(
                  (prev) => prev && { ...prev, description: e.target.value },
                )
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer disabled:bg-gray-400"
            disabled={updateLoading}
          >
            {updateLoading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
