import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import Cookies from 'js-cookie'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

type User = {
  id: number
  name: string
  email: string
}

type Reply = {
  id: number
  description: string
  posts_id: number
  users_id: number
  is_own_reply: boolean
  user: User
}

type RepliesProps = {
  postId: number
  open: boolean
  onClose: () => void
}

export default function Replies({ postId, open, onClose }: RepliesProps) {
  const [replies, setReplies] = useState<Reply[]>([])
  const [replyInput, setReplyInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    if (open) {
      fetchReplies()
    }
  }, [open])

  const fetchReplies = async () => {
    try {
      const token = Cookies.get('token')
      const Api_Url = process.env.NEXT_PUBLIC_API_URL
      const res = await fetch(`${Api_Url}/api/replies/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setReplies(data.data)
      }
    } catch (error) {
      console.error('Error fetching replies:', error)
    }
  }

  const handleReplySubmit = async () => {
    try {
      if (!replyInput) return
      const token = Cookies.get('token')
      setLoading(true)

      const res = await fetch(`/api/posts/replies/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: replyInput, post_id: postId }), // Sesuai dengan field dari API
      })
      const newReply = await res.json()
      if (newReply.success) {
        setReplies([...replies, newReply.data]) // Menambahkan reply baru ke daftar
        setReplyInput('')
        toast.success('Replies this post success')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error to replies this post')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReply = async () => {
    setLoading(true)

    if (!deleteId) return

    const token = Cookies.get('token')
    if (!token) {
      return toast.error('Unauthorized')
    }

    try {
      const res = await fetch(`/api/posts/replies/delete?id=${deleteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        toast.error('Error to delete this replies')
      } else {
        toast.success('Delete replies has sucessfully')
      }
    } catch (error) {
      toast.error('Failed to delete post')
      console.error('Delete error:', error)
    } finally {
      setDeleteId(null)
      setLoading(false)
      fetchReplies()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Replies</DialogTitle>
        </DialogHeader>
        <div className="p-3 space-y-2">
          {replies.length > 0 ? (
            replies.map((reply) => (
              <div
                key={reply.id}
                className="bg-gray-100 p-2 rounded-lg flex justify-between items-center"
              >
                <p className="text-gray-900">
                  <strong>{reply.user.name}:</strong> {reply.description}
                </p>
                {reply.is_own_reply && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        onClick={() => setDeleteId(reply.id)}
                        className="px-2 py-1 text-sm font-medium bg-gray-400 text-black rounded-lg hover:bg-red-500 hover:text-white transition"
                      >
                        Delete
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteId(null)}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async (event) => {
                            event.preventDefault()
                            await handleDeleteReply()
                          }}
                          className="bg-red-600 text-white"
                        >
                          {loading ? 'Loading..' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">Belum ada reply.</p>
          )}
        </div>
        <div className="mt-3 flex">
          <Input
            type="text"
            placeholder="Tambahkan reply..."
            value={replyInput}
            onChange={(e) => setReplyInput(e.target.value)}
          />
          <Button className="ml-2" onClick={handleReplySubmit}>
            {loading ? 'Loadings...' : 'Kirim'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
