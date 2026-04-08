"use client"

export const ColumnCard = ({ c, colWord }: { c: number, colWord: string }) => {
    return (
        <div key={`col-${c}`} className="flex flex-col rounded-lg overflow-hidden border-4 border-[#C9797D] shadow-xl bg-white/95 h-full w-full">
            <div className="flex-1 flex items-center justify-center text-[7vh] font-display text-slate-800 drop-shadow-sm font-black text-center pt-1">
                <p className="font-display index-stroke">{c + 1}</p>
            </div>
            <div className="bg-[#6EAAAD] h-[35%] flex flex-col items-center justify-center border-t-4 border-slate-800/20 px-1 py-1">
                <span className="text-white font-bold uppercase text-[1.8vh] leading-tight text-center tracking-widest drop-shadow-md">
                    {colWord}
                </span>
            </div>
        </div>
    );
}