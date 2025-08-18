'use client'
import * as motion from 'motion/react-client'

import { Button } from '@/app/components/ui/button'
import {  SendHorizontal } from 'lucide-react'

import { Spinner } from '@/app/components/ui/shadcn-io/spinner'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleCTAButton = () => {
    if (!session) {
      router.push('/login')
    } else {
      router.push('/chat')
    }
  }

  return (
    <div className='flex flex-col items-center px-4 pt-24 text-center mt-30'>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 120, duration: 0.8 }}
        className='text-4xl md:text-5xl font-bold mb-4'
      >
        Crew AI
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 120, duration: 0.8, delay: 0.1 }}
        className='text-2xl md:text-4xl mb-8'
      >
        Meet your AI Crew – All in One Conversation
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 120, duration: 0.8, delay: 0.2 }}
        className='mb-8 max-w-2xl'
      >
        <h2 className='text-3xl font-semibold mb-2'>What is Crew AI?</h2>
        <p className='text-xl leading-relaxed'>
          Connect, chat, and explore ideas with multiple AI personalities at once. Every conversation is smarter, more fun, and completely unique.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 120, duration: 0.8, delay: 0.3 }}
        className='mb-8 max-w-3xl text-lg leading-relaxed'
      >
        Crew AI brings a new twist to AI chat. Instead of talking to just one AI, you can engage with multiple AI models simultaneously – each with their own personality, knowledge, and style. Whether you want advice, brainstorming, or just casual banter, your AI crew is here to chat.
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 120, duration: 0.8, delay: 0.4 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='text-xl cursor-pointer rounded-[6px] bg-purple-600 text- p-2'
          onClick={() =>  handleCTAButton()}
        >
          Start Chatting with Crew AI
        </motion.button>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 120, duration: 0.8, delay: 0.4 }}
        className='w-screen'
      >
        <div className="mt-8 w-full max-w-2xl mx-auto text-left">
          <div className="relative">
            <div
              id="samplePrompt"
              className="pr-28 cursor-default h-20 w-full border border-gray-300 rounded-xl bg-gray-500/20 flex items-center px-4 text-white"
            >
              <span className="font-bold text-blue-700 mr-1">@Gemini</span><span>How do I write a sci-fi story?</span>
            </div>
            <Button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white px-4 py-2 rounded-3xl bg-gray-500/20 hover:bg-gray-500/20 pointer-events-none"
              size="icon"
            >
              <SendHorizontal />
            </Button>

          </div>
          <p className="mt-2 text-sm text-gray-500">
            Tag a specific AI model to get responses from that model.
          </p>
        </div>

      </motion.section>


    </div>
  )
}
