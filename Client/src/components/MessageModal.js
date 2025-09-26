import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const MessageModal = ({ isOpen, onClose, title, message, type = 'info' }) => {
  let IconComponent;
  let iconColorClass;

  switch (type) {
    case 'success':
      IconComponent = CheckCircleIcon;
      iconColorClass = 'text-green-600';
      break;
    case 'error':
      IconComponent = ExclamationTriangleIcon;
      iconColorClass = 'text-red-600';
      break;
    case 'info':
    default:
      IconComponent = InformationCircleIcon;
      iconColorClass = 'text-blue-600';
      break;
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        {/* Modal container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6 lg:p-8 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm sm:max-w-md md:max-w-lg transform overflow-hidden rounded-2xl bg-white p-4 sm:p-6 lg:p-8 text-left align-middle shadow-xl transition-all">
                
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <IconComponent className={`h-12 w-12 sm:h-16 sm:w-16 ${iconColorClass}`} aria-hidden="true" />
                </div>

                {/* Title */}
                <Dialog.Title
                  as="h3"
                  className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 text-center"
                >
                  {title}
                </Dialog.Title>

                {/* Message */}
                <div className="mt-2">
                  <p className="text-sm sm:text-base text-gray-600 text-center">
                    {message}
                  </p>
                </div>

                {/* Button */}
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent 
                               bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 
                               hover:bg-blue-200 focus:outline-none focus-visible:ring-2 
                               focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Got it!
                  </button>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MessageModal;
