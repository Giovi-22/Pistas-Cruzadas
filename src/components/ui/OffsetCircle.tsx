type OffsetCircleProps = {
    value: string | number;
    color?: string;
    size?: number;
    offset?: number;
    borderWidth?: number;
    ovalX?: number;
    ovalY?: number;
    animated?: boolean;
    className?: string;
};

export default function OffsetCircle({
    value,
    color = '#ef4444',
    size = 32,
    offset = 4,
    borderWidth = 2,
    ovalX = 1.15,
    ovalY = 0.85,
    animated = false,
    className = '',
}: OffsetCircleProps) {
    return (
        <div
            className={`relative flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
        >
            {/* borde animado */}
            <div
                className={`absolute inset-0 rounded-full ${animated ? 'animate-offset-wiggle' : ''
                    }`}
                style={{
                    border: `${borderWidth}px solid ${color}`,
                    transform: `translate(${offset}px, ${offset}px) scale(${ovalX}, ${ovalY})`,
                }}
            />

            {/* círculo base */}
            <div className="absolute inset-0 rounded-full bg-white" />

            {/* contenido */}
            <span
                className="relative font-black"
                style={{
                    color,
                    fontSize: size * 0.5,
                    userSelect: 'none',
                    caretColor: 'transparent',
                }}
            >
                {value}
            </span>
        </div>
    );
}