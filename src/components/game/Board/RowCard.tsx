"use client"

export const RowCard = ({ r, rowWord }: { r: number, rowWord: string }) => {
    return (
        <div className="flex flex-row rounded-lg overflow-hidden border-4 border-[#C9797D] shadow-xl bg-white/95 h-full w-full">
            <div className="flex-1 flex items-center justify-center text-[7vh] font-display text-slate-800 drop-shadow-sm font-black pl-1">
                <p className="relative top-0.5 font-display index-stroke">{String.fromCharCode(65 + r)}</p>
            </div>
            <div className="bg-[#6EAAAD] w-[35%] flex items-center justify-center border-l-4 border-slate-800/20 relative">
                <span className="text-white font-bold uppercase text-[1.8vh] tracking-widest drop-shadow-md whitespace-nowrap origin-center -rotate-90 absolute">
                    {rowWord}
                </span>
            </div>
        </div>
    );
}