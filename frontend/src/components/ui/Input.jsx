import { useId } from "react";

function Input({
  label,
  error,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  className = "",
  helperText,
  ...props
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className={`flex flex-col gap-1.5 w-full text-left ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-bold text-gray-700 dark:text-gray-300 select-none flex items-center gap-1"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={!!error}
        aria-describedby={
          error ? errorId : helperText ? helperId : undefined
        }
        className={`w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 transition-colors focus:ring-offset-0 ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 dark:border-gray-700"
        }`}
        {...props}
      />

      {error ? (
        <p id={errorId} className="text-xs text-red-500 font-semibold mt-0.5">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-gray-450 dark:text-gray-500 mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export default Input;
