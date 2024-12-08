import { AiOutlineFrown } from "react-icons/ai";
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <AiOutlineFrown className="text-9xl mb-4 animate-bounce" />
      <h1 className="text-5xl font-extrabold mb-2">404</h1>
      <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
      <p className="text-lg mb-8">Oops! The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary transform hover:scale-105 transition-transform duration-300">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;