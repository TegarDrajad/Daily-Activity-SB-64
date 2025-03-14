import { useState } from 'react'
import { useRouter } from 'next/router'
import { z } from 'zod'
import Link from 'next/link'
import Cookies from 'universal-cookie'
import { toast } from 'sonner'

const cookies = new Cookies()

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const validation = loginSchema.safeParse(formData)
    if (!validation.success) {
      setError(validation.error.errors[0].message)
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      // console.log(result.data.token)

      if (!response.ok) {
        setError(result.message || 'Login failed')
        alert(result.message)
      } else {
        cookies.set('token', result.data.token, { path: '/' })
        toast.success('Login Succesfully')
        router.push('/')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      toast.error('Failed to login')
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96 flex flex-col justify-center items-center"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Your Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <button
          type="submit"
          className={`w-full bg-gray-950 text-white p-2 rounded mt-2 
            ${loading ? 'cursor-wait' : 'cursor-pointer'}`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Dont Have an account ?
            <Link
              href="/auth/register"
              className="text-black hover:underline font-medium underline"
            >
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
