"use client";

import signalR, {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { ChangeEvent, useEffect, useState } from "react";
import Main from "./_components/Main";

export default function Home() {
  const [connection, setConnection] = useState<HubConnection | null>();

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl("http://localhost:5085/hubs")
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connect.start();
    setConnection(connect);
    connection?.on("NewUserArrived", (message: any) => {
      console.log(message);
    });
  }, []);

  return (
    <div>
      <Main connection={connection!} />
    </div>
  );
}
