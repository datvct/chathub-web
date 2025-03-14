import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import { Button } from "./ui/button";

interface ModalConfirmProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
  message: string;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({ isOpen, setIsOpen, onConfirm, onCancel, title, message }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {
        onCancel ? onCancel() : setIsOpen(false);
      }}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-sm">
              <DialogTitle className="text-lg font-bold text-gray-800">{title}</DialogTitle>
              <p className="text-gray-600 mt-2">{message}</p>

              <div className="flex justify-end space-x-3 mt-4">
                <Button onClick={() => setIsOpen(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">
                  Cancel
                </Button>
                <Button onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                  Confirm
                </Button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalConfirm;
