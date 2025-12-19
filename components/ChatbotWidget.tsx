"use client";

import { useState } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import { MessageCircle, X } from "lucide-react";
import { createChatBotMessage } from "react-chatbot-kit";

/* ---------------- BOT CONFIG ---------------- */

export const botConfig = {
  botName: "AI Job Assistant",
  initialMessages: [
    createChatBotMessage(
      "Hi 👋 I am your AI Job Assistant.",
      {
        
      }
    ),
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#500890ff",
      color: "#fff",
      fontSize: "15px",
      lineHeight: "1.5",
    },
    chatButton: {
      backgroundColor: "#500890ff",
    },
  },
};

/* ---------------- MESSAGE PARSER ---------------- */

export class MessageParser {
  actionProvider: any;

  constructor(actionProvider: any) {
    this.actionProvider = actionProvider;
  }

  parse(message: string) {
    this.actionProvider.handleUserMessage(message);
  }
}

/* ---------------- ACTION PROVIDER ---------------- */

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      const aiMessage = this.createChatBotMessage(data.reply);
      this.addMessage(aiMessage);
    } catch {
      this.addMessage(
        this.createChatBotMessage("Something went wrong. Please try again.")
      );
    }
  }

  addMessage(message: any) {
    this.setState((prev: any) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }
}

/* ---------------- CHATBOT WIDGET ---------------- */

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* CHAT PANEL */}
      <div
        className={`fixed bottom-24 right-6  w-[360px] max-w-[90vw] h-[520px]
        transition-all duration-500 ease-in-out
        ${
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-6 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-white/90 backdrop-blur-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-violet-600 text-white">
            <h3 className="text-lg font-semibold">AI Job Assistant</h3>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 transition"
            >
              <X size={28} />
            </button>
          </div>

          {/* Chat Content */}
          <div className="overflow-y-auto flex-1">
            <Chatbot
              config={botConfig}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
            />
          </div>
        </div>
      </div>

      <div className="fixed  h-20 w-20 animate-pulse transition-all duration-10 rounded-full   border-8 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] bottom-6 right-6 z-50"> </div>
       <button onClick={() => setOpen(!open)} className= "cursor-pointer fixed bottom-8 right-8 z-51 h-16 w-16 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-100" > {open ? <X size={28} /> : <MessageCircle size={28} />} </button>
    </>
  );
}
