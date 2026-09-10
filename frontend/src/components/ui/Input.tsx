import { InputHTMLAttributes, LabelHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

// 幅は各利用箇所で指定する(基本クラスにw-fullを含めると、呼び出し側の
// 幅指定と競合してどちらが効くかCSSの生成順に依存してしまうため)。
const fieldClasses =
  'rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input ref={ref} className={`${fieldClasses} ${className}`} {...props} />
  ),
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = '', ...props }, ref) => (
    <textarea ref={ref} className={`${fieldClasses} ${className}`} {...props} />
  ),
);
Textarea.displayName = 'Textarea';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', children, ...props }, ref) => (
    <select ref={ref} className={`${fieldClasses} ${className}`} {...props}>
      {children}
    </select>
  ),
);
Select.displayName = 'Select';

export function Label({ className = '', ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={`mb-1 block text-xs font-medium text-text-muted ${className}`} {...props} />;
}
