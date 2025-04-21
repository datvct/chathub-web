"use client"

import React, { Fragment, useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react"

import { ZoomIn, ZoomOut, RotateCcw, RotateCw, RefreshCcw } from "lucide-react"
import { Images } from "~/constants/images"

interface ModalImageViewerProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  imageUrl: string | null
  imageAlt?: string
}

const ModalImageViewer: React.FC<ModalImageViewerProps> = ({ isOpen, setIsOpen, imageUrl, imageAlt }) => {
  const [zoomLevel, setZoomLevel] = useState(0.5)
  const [rotation, setRotation] = useState(0)

  const MAX_ZOOM = 5
  const MIN_ZOOM = 0.5
  const ZOOM_STEP = 0.3

  useEffect(() => {
    if (isOpen) {
      setZoomLevel(0.5)
      setRotation(0)
    }
  }, [isOpen, imageUrl])

  if (!imageUrl) return null

  const handleClose = () => setIsOpen(false)

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM))
  }

  const handleRotateRight = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleRotateLeft = () => {
    setRotation(prev => (prev - 90 + 360) % 360)
  }

  const handleReset = () => {
    setZoomLevel(0)
    setRotation(0)
  }

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

        <div className="fixed inset-0 overflow-hidden flex items-center justify-center">
          <div className="flex min-h-full w-full h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="relative w-full h-full flex items-center justify-center max-w-full max-h-full transform text-left align-middle transition-all bg-transparent">
                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-[90] rounded-full p-1"
                  aria-label="Close image viewer"
                >
                  <Image src={Images.IconCloseModal} alt="close modal" width={50} height={50} />
                </button>

                <div
                  className="relative flex items-center justify-center cursor-grab active:cursor-grabbing w-full h-full"
                  style={{ overflow: "hidden" }}
                >
                  <div
                    className="relative transition-transform duration-300 ease-in-out"
                    style={{
                      transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                      transformOrigin: "center",
                      maxWidth: "100%",
                      maxHeight: "100%",
                    }}
                  >
                    <Image
                      src={imageUrl}
                      alt={imageAlt || "Viewed Image"}
                      layout="intrinsic"
                      width={1000}
                      height={800}
                      quality={90}
                      priority
                      unoptimized={imageUrl.endsWith(".gif")}
                      className="block max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>

                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-[80] flex items-center gap-2 rounded-full bg-black bg-opacity-60 p-2 backdrop-blur-sm">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= MIN_ZOOM}
                    className="p-2 text-white rounded-full hover:bg-white/20 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                    aria-label="Zoom out"
                  >
                    <ZoomOut size={22} />
                  </button>
                  <button
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= MAX_ZOOM}
                    className="p-2 text-white rounded-full hover:bg-white/20 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                    aria-label="Zoom in"
                  >
                    <ZoomIn size={22} />
                  </button>
                  <button
                    onClick={handleRotateLeft}
                    className="p-2 text-white rounded-full hover:bg-white/20 transition-colors"
                    aria-label="Rotate left"
                  >
                    <RotateCcw size={22} />
                  </button>
                  <button
                    onClick={handleRotateRight}
                    className="p-2 text-white rounded-full hover:bg-white/20 transition-colors"
                    aria-label="Rotate right"
                  >
                    <RotateCw size={22} />
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={zoomLevel === 1 && rotation === 0}
                    className="p-2 text-white rounded-full hover:bg-white/20 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                    aria-label="Reset view"
                  >
                    <RefreshCcw size={20} />
                  </button>
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
