import useSWR from 'swr'
import Cookies from 'js-cookie'

type UserProfile = {
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

type Me = {
  success: boolean
  message: string
  data: UserProfile
}

const fetcher = async (url: string) => {
  const token = Cookies.get('token')
  console.log(token)
  if (!token) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user data')
  }

  return response.json()
}

export default function Profile() {
  const Api_Url = process.env.NEXT_PUBLIC_API_URL
  const { data, isLoading, error } = useSWR<Me>(
    `${Api_Url}/api/user/me`,
    fetcher,
    {
      revalidateOnFocus: true,
    },
  )
  if (isLoading) {
    return <div>Loading....</div>
  }
  if (error) {
    return <div>Error...</div>
  }
  if (!data?.data) {
    return <div>No user data found</div>
  }

  const { name, email, dob, phone, hobby } = data.data

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profil Pengguna</h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-auto">
        <table>
          <tbody>
            <tr>
              <td className="text-lg font-semibold pr-5">Nama</td>
              <td className="text-lg">{name}</td>
            </tr>
            <tr>
              <td className="text-lg font-semibold pr-5">Email</td>
              <td className="text-lg">{email}</td>
            </tr>
            <tr>
              <td className="text-lg font-semibold pr-5">Tanggal Lahir</td>
              <td className="text-lg">{dob}</td>
            </tr>
            <tr>
              <td className="text-lg font-semibold pr-5">Telepon</td>
              <td className="text-lg">{phone}</td>
            </tr>
            <tr>
              <td className="text-lg font-semibold pr-5">Hobi</td>
              <td className="text-lg">{hobby}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
