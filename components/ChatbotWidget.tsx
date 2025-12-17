"use client";

import { useState } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import { MessageCircle, X } from "lucide-react";
import { createChatBotMessage } from "react-chatbot-kit";

export const botConfig = {
  botName: "AI Job Assistant",
  initialMessages: [
    createChatBotMessage(
      "Hi 👋 I am your AI Job Assistant. How can I help you today?",
      {}
    ),
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#2563eb",
      color: "#fff",
      fontSize: "15px",
      lineHeight: "1.5",
    },
    chatButton: {
      backgroundColor: "#2563eb",
      borderRadius: "50%",
    },
  },
};


export class MessageParser {
  actionProvider: any;

  constructor(actionProvider: any) {
    this.actionProvider = actionProvider;
  }

  parse(message: string) {
    this.actionProvider.handleUserMessage(message);
  }
}


export class ActionProvider {
  createChatBotMessage: any;
  setState: any;

  constructor(createChatBotMessage: any, setStateFunc: any) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  async handleUserMessage(userMessage: string) {
    const loadingMessage = this.createChatBotMessage("Thinking...", {
      loading: true,
    });

    this.addMessage(loadingMessage);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      const aiMessage = this.createChatBotMessage(data.reply, {});
      this.addMessage(aiMessage);
    } catch (error) {
      const errorMessage = this.createChatBotMessage(
        "Something went wrong. Please try again.",
        {}
      );
      this.addMessage(errorMessage);
    }
  }

  addMessage(message: any) {
    this.setState((prev: any) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }
}


export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* CHAT PANEL */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[90vw] h-[500px]
        transition-all duration-500 ease-in-out
        ${open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-6 pointer-events-none"}`}
      >
        <div className="flex flex-col h-full rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-white/90 backdrop-blur-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-violet-600 text-white">
            <h3 className="text-lg font-semibold">AI Job Assistant</h3>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chatbot Content */}
          <div className="flex-1 overflow-y-auto">
            <Chatbot
              config={botConfig}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
            />
          </div>

          {/* Footer / Input area (optional if you want) */}
          {/* <div className="px-4 py-2 border-t border-gray-200">
            <input type="text" placeholder="Type a message..." className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div> */}
        </div>
      </div>

      {/* FLOATING BUTTON */}

      <div className="fixed flex h-20 w-20  animate-pulse transition-all duration-10    rounded-full  h-16 w-16 bg-blue-400 bottom-6 right-6 z-50">
        </div>
      <button
        onClick={() => setOpen(!open)}
        className={`cursor-pointer fixed  bottom-8 right-8.5 z-50 h-15 w-15 rounded-full bg-violet-600 text-white
        flex items-center justify-center shadow-xl hover:shadow-2xl
        transition-all duration-100`}
      >
        {open ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
      
    </>
  );
}
