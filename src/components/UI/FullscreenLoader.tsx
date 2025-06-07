export default function FullscreenLoader() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="relative w-16 h-16">
                <span className="absolute inset-0 rounded-full border-4 border-red-500 border-t-transparent animate-spin"></span>
                <span className="absolute inset-2 rounded-full border-4 border-pink-400 border-b-transparent animate-spin"></span>
            </div>
        </div>
    );
}