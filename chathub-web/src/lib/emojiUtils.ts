export const isOnlyEmoji = (text?: string): boolean => {
    if (!text) return false
    const emojiRegex = /^[\p{Emoji}\u200d\s]+$/u
    return emojiRegex.test(text)
}
