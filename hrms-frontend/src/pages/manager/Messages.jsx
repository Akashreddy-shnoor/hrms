import ChatList from '../../components/chat/ChatList'
import ChatWindow from '../../components/chat/ChatWindow'
import MessageInput from '../../components/chat/MessageInput'
import { useAuth } from '../../context/AuthContext'
import { useMessaging } from '../../context/MessagingContext'
import { useMessagingWorkspace } from '../../hooks/useMessagingWorkspace'

function ManagerMessages() {
  const { user } = useAuth()
  const { unreadCount } = useMessaging()
  const {
    conversations,
    activeConversation,
    messages,
    listLoading,
    conversationLoading,
    error,
    selectConversation,
    sendCurrentMessage,
    editCurrentMessage,
    refreshWorkspace
  } = useMessagingWorkspace({
    withQuickQuestions: false,
    autoSelect: 'unread_first'
  })

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-4">
      <div className="flex-shrink-0 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Messages</h1>

        <div className="flex gap-2 flex-shrink-0">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Unread</span>
              <span className="text-lg font-bold text-slate-900">{unreadCount}</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Chats</span>
              <span className="text-lg font-bold text-slate-900">{conversations.length}</span>
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
            title="Employee Inbox"
            subtitle="Every employee conversation is separated and preserved."
            conversations={conversations}
            activeConversationId={activeConversation?.user_id}
            onSelectConversation={selectConversation}
            loading={listLoading}
            emptyMessage="No employees are available for messaging yet."
          />

          <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <ChatWindow
              conversation={activeConversation}
              messages={messages}
              currentUserId={user?.id}
              loading={conversationLoading}
              onEditMessage={editCurrentMessage}
            />
            <MessageInput
              onSend={sendCurrentMessage}
              disabled={!activeConversation}
              placeholder="Reply to the selected employee"
            />
          </section>
        </div>
      </div>
    </div>
  )
}

export default ManagerMessages
