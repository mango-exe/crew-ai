import React from "react"

type UserSender = {
  id: string
  name: string
  avatar: string
  messageColor: string
}

type AISender = {
  id: string
  model: string
  llm: string
  avatar: string
  messageColor: string
}

type Message = {
  id: number
  type: "user" | "ai"
  text: string
  senderDetails: UserSender | AISender
}

export default function ChatMessages() {
  const messages: Message[] = [
    {
      id: 1,
      type: "user",
      text: "Hey, how are you?",
      senderDetails: { id: "u1", name: "John", avatar: "https://i.pravatar.cc/40?img=5", messageColor: "bg-blue-500/80" },
    },
    {
      id: 2,
      type: "ai",
      text: "I'm good, thanks! How about you?",
      senderDetails: { id: "ai1", model: "GPT-4", llm: "OpenAI", avatar: "https://i.pravatar.cc/40?img=12", messageColor: "bg-purple-600/80" },
    },
    {
      id: 3,
      type: "user",
      text: "Doing well, just testing the chat layout.",
      senderDetails: { id: "u1", name: "John", avatar: "https://i.pravatar.cc/40?img=5", messageColor: "bg-blue-500/80" },
    },
    {
      id: 4,
      type: "ai",
      text: "Looks like it’s working nicely!",
      senderDetails: { id: "ai1", model: "GPT-4", llm: "OpenAI", avatar: "https://i.pravatar.cc/40?img=12", messageColor: "bg-purple-600/80" },
    },
  ]

  return (
    <div className="h-[90vh] w-full p-4 flex flex-col gap-3 overflow-y-auto">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex items-end gap-2 ${
            msg.type === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {/* AI avatar on left */}
          {msg.type === "ai" && (
            <img
              src={msg.senderDetails.avatar}
              alt="AI Avatar"
              className="h-8 w-8 rounded-full"
            />
          )}

          <div className="flex flex-col">
            {/* Message bubble */}
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl text-white break-words shadow-md ${
                msg.type === "user"
                  ? `${msg.senderDetails.messageColor} rounded-br-none`
                  : `${msg.senderDetails.messageColor} rounded-bl-none`
              }`}
            >
              {msg.text}
            </div>

            {/* AI model info below the bubble */}
            {msg.type === "ai" && "model" in msg.senderDetails && (
              <div className="mt-1 text-xs text-gray-300">
                {msg.senderDetails.llm} - {msg.senderDetails.model}
              </div>
            )}
          </div>

          {/* User avatar on right */}
          {msg.type === "user" && (
            <img
              src={msg.senderDetails.avatar}
              alt="User Avatar"
              className="h-8 w-8 rounded-full"
            />
          )}
        </div>
      ))}
    </div>
  )
}
