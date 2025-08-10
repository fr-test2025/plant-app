import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="py-6 px-6 w-full flex items-center justify-center ">
        <Link to="/login" className="mr-4">
            <button class="bg-green-800 text-white text-4xl px-6 py-6 rounded">
            ‧₊˚❀༉‧₊˚. Welcome .˚₊‧༉❀˚₊‧
            </button>
        </Link>
    </div>
  );
};

export default Home;

