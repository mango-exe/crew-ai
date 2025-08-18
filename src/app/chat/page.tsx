'use client'
import { withAuth } from '@/app/components/auth-guard'

function ChatPage() {
  return (
    <div>
      Chat page
    </div>
  )
}

export default withAuth(ChatPage)
