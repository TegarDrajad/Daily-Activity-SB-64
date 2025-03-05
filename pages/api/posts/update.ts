import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const formSchema = z.object({
    description: z.string().min(1, 'Description wajib diisi !'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ errorMessage: 'Method not allowed' });
    }

    try { 
        const { id } = req.query;
        if (!id || typeof id !== 'string') {
            return res.status(400).json({errorMessage: "post id is required"})
        }
        // Validasi input
        const validateData = formSchema.parse(req.body);

        const token = req.headers.authorization || "";
        if (!token) {
            return res.status(401).json( {errorMessage: "Unauthorized"});
        }

        // Kirim data ke API eksternal
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/update/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify(validateData),
        });

        // Cek apakah request ke API eksternal berhasil
        const responseData = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({ errorMessage: responseData.message || "Request failed" });
        }

        // Pastikan response mengandung data yang diharapkan
        if (responseData.success) {
            return res.status(201).json(responseData);
        } else {
            return res.status(400).json({ errorMessage: "Failed to update post" });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Ambil error validasi dengan cara yang benar
            const errors = error.flatten().fieldErrors;
            return res.status(400).json({ errors });
        }

        console.error("Server Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
