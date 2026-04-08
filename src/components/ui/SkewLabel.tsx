type SkewLabelProps = {
    text: string;
    orientation?: 'horizontal' | 'vertical';
    skew?: number; // grados
    className?: string;
};

export default function SkewLabel({
    text,
    orientation = 'horizontal',
    skew = -20,
    className = '',
}: SkewLabelProps) {
    const isVertical = orientation === 'vertical';

    return (
        <div className="inline-block">
            <div
                className={`bg-white  flex items-center justify-center inline-flex ${className}`}
                style={{
                    transform: isVertical
                        ? `skewY(${skew}deg)` // 🔥 skew vertical
                        : `skewX(${skew}deg)`, // 🔥 skew horizontal
                }}
            >
                <span
                    className="block font-semibold whitespace-nowrap px-4 py-1"
                    style={{
                        display: 'inline-block',
                        transform: isVertical
                            ? `skewY(${-skew}deg) rotate(-90deg)` // 🔥 compensa + rota
                            : `skewX(${-skew}deg)`,
                        transformOrigin: 'center',
                    }}
                >
                    {text}
                </span>
            </div>
        </div>
    );
}