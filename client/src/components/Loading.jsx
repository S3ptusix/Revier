import { Loader } from "lucide-react";

export default function Loading() {

    return (
        <div className='h-full w-full bg-white text-black flex-center z-100'>
            <Loader className='animate-spin' />
        </div>
    );
}