export const TOPICS = {
  STATUS: "/topic/status",
  NOTIFICATIONS: (userId: string) => `/topic/notifications/${userId}`,
  CONVERSATION: (id: string) => `/topic/conversation/${id}`,
  MESSAGE: (id: string) => `/topic/message/${id}`,
  TYPING_STATUS: (id: string) => `/topic/typing-status/${id}`,
  SEEN_MESSAGE: (id: string) => `/topic/seen-message/${id}`,
  REACT_MESSAGE: (id: string) => `/topic/react-message/${id}`,
  USER: (id: string) => `/topic/user/${id}`,
}
