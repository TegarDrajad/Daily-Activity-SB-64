import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

export default function CreatePost() {
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<{
    errors: { [key: string]: string }
  } | null>(null)
  const router = useRouter()

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const token = Cookies.get('token')
    if (!token) {
      setError({ errors: { general: 'Unauthorized. Please log in first.' } })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description }),
      })

      if (!response.ok) {
        let errorMessage = { errors: { general: 'Unknown error occurred' } }

        try {
          const data = await response.json()
          errorMessage = data
          alert('Vailed to create posts')
        } catch (err) {
          console.error('Failed to parse error response:', err)
        }

        setError(errorMessage)
        return
      }

      alert('Success create posts')
      router.push('/')
    } catch (error) {
      console.error('An unexpected error happened:', error)
      setError({
        errors: { general: 'An unexpected error occurred. Please try again.' },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Create Post</h2>

      <form className="space-y-4" onSubmit={onSubmit}>
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
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Enter description..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
          {error?.errors?.description && (
            <small className="text-red-500">{error.errors.description}</small>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Submit'}
        </button>

        {/* General Error Message */}
        {error?.errors?.general && (
          <p className="text-red-500 text-center">{error.errors.general}</p>
        )}
      </form>
    </div>
  )
}
