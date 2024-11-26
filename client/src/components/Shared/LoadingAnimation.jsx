import { AiOutlineLoading } from 'react-icons/ai';

const LoadingAnimation = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <AiOutlineLoading className="animate-spin text-6xl text-primary" />
        </div>
    );
};

export default LoadingAnimation;