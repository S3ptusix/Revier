import { Loader } from "lucide-react";

export default function Loading() {

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-black/50 flex-center z-100'>
            <Loader className='animate-spin' color="#ffffff" />
        </div>
    );
}