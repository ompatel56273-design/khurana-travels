'use client';

const Input = ({ label, name, type = 'text', error, required = false, className = '', theme = 'light', ...props }) => {
  const isDark = theme === 'dark';
  
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-400' : 'text-[var(--color-text-secondary)]'}`}>
          {label} {required && <span className="text-[#EF4444]">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className={`w-full backdrop-blur-xl border rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-300 focus:border-[#6366F1] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1),0_0_20px_rgba(124,58,237,0.06)]
          ${isDark 
            ? 'bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500' 
            : 'bg-black/[0.03] border-black/[0.08] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]'
          }`}
        {...props}
      />
      {error && <p className="text-xs text-[#EF4444] mt-1.5">{error}</p>}
    </div>
  );
};

export default Input;
