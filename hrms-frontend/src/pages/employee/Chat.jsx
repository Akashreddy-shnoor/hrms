import ChatList from '../../features/messaging/components/ChatList'
import ChatWindow from '../../features/messaging/components/ChatWindow'
import MessageInput from '../../features/messaging/components/MessageInput'
import { useAuth } from '../../context/AuthContext'
import { useMessaging } from '../../context/MessagingContext'
import { useMessagingWorkspace } from '../../features/messaging/hooks/useMessagingWorkspace'

function EmployeeChat() {
  const { user } = useAuth()
  const { unreadCount } = useMessaging()
  const {
    conversations,
    activeConversation,
    messages,
    quickQuestions,
    listLoading,
    conversationLoading,
    error,
    selectConversation,
    sendCurrentMessage,
    sendQuickQuestion,
    editCurrentMessage,
    refreshWorkspace
  } = useMessagingWorkspace({
    withQuickQuestions: true,
    autoSelect: 'first'
  })

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-4">
      <div className="flex-shrink-0 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Chat</h1>

        <div className="flex gap-2 flex-shrink-0">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Unread</span>
              <span className="text-lg font-bold text-slate-900">{unreadCount}</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Files</span>
              <span className="text-xs font-semibold text-slate-500">Supports 5MB</span>
            </div>
          </div>
        </div>
      </div>


      {error && (
        <div className="flex-shrink-0 flex flex-col gap-3 rounded-[28px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700 sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => refreshWorkspace()}
            className="rounded-full bg-white px-4 py-2 font-semibold text-amber-700 transition hover:bg-amber-100"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex-1 min-h-0">
        <div className="grid h-full gap-6 xl:grid-cols-[360px_minmax(0,1fr)] overflow-hidden">
          <ChatList
            title="Manager Conversation"
            subtitle="Your dedicated one-to-one chat history lives here."
            conversations={conversations}
            activeConversationId={activeConversation?.user_id}
            onSelectConversation={selectConversation}
            loading={listLoading}
            emptyMessage="No manager conversation is available yet."
          />

          <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <ChatWindow
              conversation={activeConversation}
              messages={messages}
              currentUserId={user?.id}
              loading={conversationLoading}
              quickQuestions={quickQuestions}
              onQuickQuestion={sendQuickQuestion}
              onEditMessage={editCurrentMessage}
            />
            <MessageInput
              onSend={sendCurrentMessage}
              disabled={!activeConversation}
              placeholder="Type a message to your manager"
            />
          </section>
        </div>
      </div>
    </div>
  )
}

export default EmployeeChat
