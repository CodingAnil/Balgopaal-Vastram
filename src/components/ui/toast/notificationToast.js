import toast from 'react-hot-toast'

// Custom toast component with close button and icon
const ToastWithClose = ({ message, type = 'default' }) => {
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          background: 'rgba(16, 185, 129, 0.1)',
          color: '#065f46',
          border: '2px solid #059669',
          boxShadow: '0 8px 32px rgba(5, 150, 105, 0.2)',
        }
      case 'error':
        return {
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#991b1b',
          border: '2px solid #dc2626',
          boxShadow: '0 8px 32px rgba(220, 38, 38, 0.2)',
        }
      case 'warning':
        return {
          background: 'rgba(245, 158, 11, 0.1)',
          color: '#92400e',
          border: '2px solid #d97706',
          boxShadow: '0 8px 32px rgba(217, 119, 6, 0.2)',
        }
      case 'info':
        return {
          background: 'rgba(59, 130, 246, 0.1)',
          color: '#1e40af',
          border: '2px solid #2563eb',
          boxShadow: '0 8px 32px rgba(37, 99, 235, 0.2)',
        }
      default:
        return {
          background: 'rgba(107, 114, 128, 0.1)',
          color: '#374151',
          border: '2px solid #6b7280',
          boxShadow: '0 8px 32px rgba(107, 114, 128, 0.2)',
        }
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return 'ℹ️'
    }
  }

  const styles = getToastStyles()

  return (
    <div
      style={{
        ...styles,
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '16px 20px',
        fontSize: '14px',
        letterSpacing: '0.5px',
        fontWeight: '600',
        minWidth: '300px',
        maxWidth: '400px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <span style={{ fontSize: '18px', flexShrink: 0 }}>{getIcon()}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={() => toast.dismiss()}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'inherit',
          fontSize: '18px',
          fontWeight: 'bold',
          padding: '4px',
          opacity: '0.7',
          transition: 'opacity 0.2s',
          lineHeight: '1',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
        }}
        onMouseEnter={(e) => {
          e.target.style.opacity = '1'
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = '0.7'
          e.target.style.backgroundColor = 'transparent'
        }}
      >
        ×
      </button>
    </div>
  )
}

// Toast notification functions with glassmorphism design and close buttons
export const showSuccessToast = (message) => {
  const toastId = message
  return toast.custom(<ToastWithClose message={message} type="success" />, {
    id: toastId,
    duration: 4000,
    position: 'top-right',
  })
}

export const showErrorToast = (message) => {
  const toastId = message
  return toast.custom(<ToastWithClose message={message} type="error" />, {
    id: toastId,
    duration: 5000,
    position: 'top-right',
  })
}

export const showWarningToast = (message) => {
  const toastId = message
  return toast.custom(<ToastWithClose message={message} type="warning" />, {
    id: toastId,
    duration: 4000,
    position: 'top-right',
  })
}

export const showInfoToast = (message) => {
  const toastId = message
  return toast.custom(<ToastWithClose message={message} type="info" />, {
    id: toastId,
    duration: 4000,
    position: 'top-right',
  })
}

// Legacy function for backward compatibility
export const showToast = (message, type) => {
  switch (type) {
    case 'success':
      return showSuccessToast(message)
    case 'error':
      return showErrorToast(message)
    case 'warning':
      return showWarningToast(message)
    case 'info':
      return showInfoToast(message)
    default:
      return showInfoToast(message)
  }
}
