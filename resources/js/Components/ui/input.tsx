import * as React from "react";
import { InputHTMLAttributes, useEffect, useRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    isFocused?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", type = "text", isFocused = false, ...props }, ref) => {
        const internalRef = useRef<HTMLInputElement>(null);
        const inputRef = (ref || internalRef) as React.RefObject<HTMLInputElement>;

        useEffect(() => {
            if (isFocused && inputRef.current) {
                inputRef.current.focus();
            }
        }, [isFocused, inputRef]);

        return (
            <input
                type={type}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
                ref={inputRef}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };

