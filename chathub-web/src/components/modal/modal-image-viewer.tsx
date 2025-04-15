"use client"

import React, { Fragment } from "react"
import Image from "next/image"
import { Images } from "../../constants/images"
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react"

interface ModalImageViewerProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  imageUrl: string | null
  imageAlt?: string
}

const ModalImageViewer: React.FC<ModalImageViewerProps> = ({ isOpen, setIsOpen, imageUrl, imageAlt }) => {
  if (!imageUrl) return null

  const handleClose = () => setIsOpen(false)

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[70]" onClose={handleClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-80 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="relative w-full max-w-4xl max-h-[90vh] transform overflow-hidden rounded-lg bg-transparent text-right align-middle shadow-xl transition-all">
                <button onClick={() => setIsOpen(false)}>
                  <Image src={Images.IconClosePurple} alt="close modal" width={40} height={40} />
                </button>

                <div className="relative w-full h-[85vh]">
                  <Image
                    src={imageUrl}
                    alt={imageAlt || "Viewed Image"}
                    layout="fill"
                    objectFit="contain"
                    quality={90}
                    priority
                    unoptimized={imageUrl.endsWith(".gif")}
                  />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ModalImageViewer
