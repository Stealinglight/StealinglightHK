import { ButtonProps } from '../types';

/**
 * Reusable button component with multiple variants
 * Can render as button or anchor tag
 */
export function Button({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    as = 'button',
    href,
    external = false,
    className = '',
    children,
    ...props
}: ButtonProps) {
    const baseClass = 'btn';
    const variantClass = `btn--${variant}`;
    const sizeClass = `btn--${size}`;
    const widthClass = fullWidth ? 'btn--full-width' : '';

    const combinedClassName = [baseClass, variantClass, sizeClass, widthClass, className]
        .filter(Boolean)
        .join(' ');

    if (as === 'a' && href) {
        return (
            <a
                href={href}
                className={combinedClassName}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
            >
                {children}
            </a>
        );
    }

    return (
        <button className={combinedClassName} {...props}>
            {children}
        </button>
    );
}
