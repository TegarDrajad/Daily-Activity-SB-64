import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    phone: '',
    hobby: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.message)
      toast.error(data.message)
    } else {
      router.push('/auth/login')
      toast.success(data.message)
    }
    setLoading(false)
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-10">
        <div className="w-full bg-white p-6 mt-5 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-5">Register Form</h1>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg mt-1"
              ></input>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg mt-1"
              ></input>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Your Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg mt-1"
              ></input>
            </div>

            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg mt-1"
              ></input>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="ex : 081215267243"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg mt-1"
              ></input>
            </div>

            <div>
              <label
                htmlFor="hobby"
                className="block text-sm font-medium text-gray-700"
              >
                Hobby
              </label>
              <input
                type="text"
                name="hobby"
                placeholder="Your Hobby"
                value={formData.hobby}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg mt-1"
              ></input>
            </div>

            <button
              type="submit"
              className={`w-full bg-gray-950 text-white p-2 rounded mt-2 
                ${loading ? 'cursor-wait' : 'cursor-pointer'}`}
              disabled={loading}
            >
              {loading ? 'Please Waitt' : 'Regist'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
