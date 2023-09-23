"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HubConnection } from "@microsoft/signalr";
import { Send } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

function Main({ connection }: { connection: HubConnection | null }) {
  const [userName, setUserName] = useState("");
  const [name, setName] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setUserName(e.target.value);
  }

  async function handleSubmit() {
    setName(userName);
    setIsConnected(true);
    await connection?.invoke("NewUser", userName, groupName);
  }

  async function handleSend() {
    await connection?.invoke(
      "SendMessageToGroup",
      userName,
      groupName,
      message
    );
  }

  useEffect(() => {
    if (connection) {
      connection.on("NewUserArrived", (message: any) => {
        console.log(message);
      });
      connection.on("NewMessageArrived", (data: any) => {
        data = JSON.parse(data);
        console.log(data);
        const newMessage = {
          userName: data.userName,
          message: data.message,
        };
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, newMessage];
          return updatedMessages;
        });
      });
    }
  }, [connection]);

  return (
    <div className="mt-10 container mx-auto">
      {!isConnected ? (
        <div className="flex space-x-4">
          <Input
            type="text"
            className="w-44 border-slate-700"
            placeholder="Name"
            onChange={handleChange}
          />
          <Input
            type="text"
            className="w-44 border-slate-700"
            placeholder="Group Name"
            onChange={(e) => setGroupName(e.target.value)}
          />
          <Button onClick={handleSubmit}>Connect</Button>
        </div>
      ) : (
        <div>
          <p>Connected as {name}</p>
          <div className="flex space-x-4">
            <Input
              type="text"
              className="w-44 border-slate-700"
              placeholder="Message"
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={handleSend}>
              <Send className="mr-2" size={17} /> send
            </Button>
          </div>
          <div className="space-y-2">
            {messages.map((m, i) => (
              <div className="flex space-x-4" key={i}>
                <p className="font-bold">{m.userName}</p>
                <p>{m.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
