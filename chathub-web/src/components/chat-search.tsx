"use client"
import { useState, useEffect, useRef } from "react"
import { IoClose, IoSearch } from "react-icons/io5"

interface ChatSearchProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const ChatSearch = ({ isOpen, setIsOpen }: ChatSearchProps) => {
  const searchRef = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [setIsOpen])

  return (
    <div className="bg-[#292929] text-white h-screen overflow-hidden overflow-y-auto w-1/4 p-4">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <h2 className="text-lg font-bold">Search Message</h2>
        <button onClick={() => setIsOpen(false)}>
          <IoClose size={24} />
        </button>
      </div>
      <div className="relative w-full p-4">
        <IoSearch size={20} className="absolute left-[6%] top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Enter keywords..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="bg-[#2e2e3e] flex items-center w-full pl-10 p-2 text-white border rounded-lg"
        />
      </div>
      <div className="flex items-center justify-center text-gray-200 mt-5">
        Enter keywords to search for messages ....
      </div>
    </div>
  )
}

export default ChatSearch
