import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader } from 'lucide-react'

interface VerificationPopupProps {
  isVerifying: boolean
  isVerifyingSuccess: boolean
  onCancel:()=>void
  errorData: any // Replace 'any' with the actual type of errorData
}

export default function VerificationPopup({ isVerifying, isVerifyingSuccess, errorData, onCancel }: VerificationPopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        {isVerifying && (
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-black" />
            <h2 className="text-2xl font-bold mb-2">Verifying Document</h2>
            <p className="text-gray-600">Please wait while we verify your document...</p>
          </div>
        )}
        {/**
         * Here use errorData to check whether to show error ui or approved ui
         */}
        {isVerifyingSuccess && (
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-2xl font-bold mb-2">Document Verification Complete</h2>
            <p className="text-gray-600 mb-4">We found some errors in your document.</p>
            <div className="gap-x-4">
            <Button className="bg-black text-white hover:bg-gray-800">
              Fix Errors
            </Button>
            <Button onClick={onCancel} className="bg-black ml-4 text-white hover:bg-gray-800">
              Cancel
            </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

