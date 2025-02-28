import { useEffect, useState } from "react";
import useSWR from "swr";

type UserProfile = {
  id: number,
  name: string,
  email: string,
  dob: string,
  phone: string,
  hobby: string,
  deleted_at: string | null,
  created_at: string,
  updated_at: string
}

type Me = {
  success: boolean
  message: string
  data: UserProfile
}

const fetcher = async (url: string) => {
  const token = localStorage.getItem('token');
  console.log(token)
  if (!token) {
    throw new Error("Unauthorized");
  }
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  return response.json();
};

export default function Profile() {
    const Api_Url = process.env.NEXT_PUBLIC_API_URL
    const {data, isLoading, error} = useSWR<Me>(`${Api_Url}/api/user/me`, fetcher, 
      {
        revalidateOnFocus: true
      }
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

    return(
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Profil Pengguna</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-lg"><strong>Nama:</strong> {name}</p>
          <p className="text-lg"><strong>Email:</strong> {email}</p>
          <p className="text-lg"><strong>Tanggal Lahir:</strong> {dob}</p>
          <p className="text-lg"><strong>Telepon:</strong> {phone}</p>
          <p className="text-lg"><strong>Hobi:</strong> {hobby}</p>
        </div>
      </div>
    )
    
}