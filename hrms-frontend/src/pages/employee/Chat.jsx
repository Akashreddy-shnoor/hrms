import ChatList from '../../components/chat/ChatList'
import ChatWindow from '../../components/chat/ChatWindow'
import MessageInput from '../../components/chat/MessageInput'
import { useAuth } from '../../context/AuthContext'
import { useMessaging } from '../../context/MessagingContext'
import { useMessagingWorkspace } from '../../hooks/useMessagingWorkspace'

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
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      <div className="flex-shrink-0 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Chat</h1>
          <p className="mt-1 text-sm text-slate-500">
            Message your manager, use quick questions, and keep every conversation in one place.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-[28px] border border-slate-200 bg-white px-5 py-4 shadow-sm flex-shrink-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Unread
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{unreadCount}</p>
          </div>
          <div className="h-12 w-px bg-slate-200"></div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Attachments supported</p>
            <p className="text-xs text-slate-400">Files and screenshots up to 5 MB</p>
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
