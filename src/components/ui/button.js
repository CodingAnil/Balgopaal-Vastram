'use client'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-peacock-600 hover:bg-peacock-700 text-white focus:ring-peacock-500',
    secondary:
      'bg-copper-600 hover:bg-copper-700 text-white focus:ring-copper-500',
    outline:
      'border-2 border-peacock-600 text-peacock-600 hover:bg-peacock-600 hover:text-white focus:ring-peacock-500',
    ghost: 'text-peacock-600 hover:bg-peacock-50 focus:ring-peacock-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  }

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
