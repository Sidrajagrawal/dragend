import { useReactFlow } from '@xyflow/react';

function CustomControls() {
    const { zoomIn, zoomOut, fitView } = useReactFlow();

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-3 bg-white px-3 py-2 rounded-xl shadow-lg">
            <button onClick={zoomIn} className="w-3 h-3 text-2xl font-bold rounded-lg hover:bg-gray-100 mb-5" >
                +
            </button>
            <button onClick={zoomOut} className="w-3 h-3 text-2xl font-bold rounded-lg hover:bg-gray-100">
                −
            </button>
        </div>
    );
}

export default CustomControls;
