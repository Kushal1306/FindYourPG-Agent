// components/ui/alert.js
import { CheckCircle, AlertCircle } from "lucide-react"

export const Alert = ({ variant, children, className = "" }) => {
  const alertStyles = {
    default: "bg-green-100 text-green-800 border-green-500",
    destructive: "bg-red-100 text-red-800 border-red-500",
    info: "bg-blue-100 text-blue-800 border-blue-500",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-500",
  }

  return (
    <div
      className={`p-4 border-l-4 rounded-md ${alertStyles[variant]} ${className}`}
      role="alert"
    >
      {children}
    </div>
  )
}

export const AlertTitle = ({ children }) => (
  <div className="font-semibold text-lg">{children}</div>
)

export const AlertDescription = ({ children }) => (
  <div className="text-sm text-gray-700">{children}</div>
)

export const AlertIcon = ({ variant }) => {
  const icons = {
    default: <CheckCircle className="h-4 w-4 text-green-500" />,
    destructive: <AlertCircle className="h-4 w-4 text-red-500" />,
    info: <AlertCircle className="h-4 w-4 text-blue-500" />,
    warning: <AlertCircle className="h-4 w-4 text-yellow-500" />,
  }
  return icons[variant]
}
