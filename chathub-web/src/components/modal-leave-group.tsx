"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"

interface ModalLeaveGroupProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const ModalLeaveGroup = ({ isOpen, setIsOpen }: ModalLeaveGroupProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md rounded-xl bg-[#363636] border-[#363636]">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-center text-white uppercase">Leave this group</DialogTitle>
        </DialogHeader>
        <div className="text-center text-base text-white">
          You won’t be able to see message in this community after leaving
        </div>

        <div className="flex items-center justify-around">
          <Button className="p-4 h-10 bg-white text-[#2D2D2D] rounded-lg text-center" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button className="p-4 h-10 bg-[#FF2F2F] text-white rounded-lg text-center" onClick={() => setIsOpen(false)}>
            Leave group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ModalLeaveGroup
