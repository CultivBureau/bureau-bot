"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BotDetailsPageShell } from "../../../components/bot-details/shared/BotDetailsPageShell";
import ConversationsPageContent from "@/app/components/bot-details/conversations/ConversationsPageContent";
import { ConversationsSidebar } from "@/app/components/bot-details/conversations/ConversationsSidebar";
import { ConversationsChatWindow } from "@/app/components/bot-details/conversations/ConversationsChatWindow";

function ConversationsPageC() {
  const searchParams = useSearchParams();
  const botId = searchParams.get("botId");

  return (
    <BotDetailsPageShell botId={botId} title="Conversations" description="Manage conversations">
      <ConversationsSidebar />
      <ConversationsChatWindow />
    </BotDetailsPageShell>
  );
}

export default function ConversationsPage() {
  return (
    <Suspense
      fallback={
        <BotDetailsPageShell botId={null} title="Conversations" loading={true}>
          <div />
        </BotDetailsPageShell>
      }
    >
      <div className="flex h-screen w-full overflow-hidden">
        {/* Container for the app effect */}
        <div className="flex w-full h-full shadow-2xl">
          <ConversationsPageC />
        </div>
      </div>
    </Suspense>
  );
}
