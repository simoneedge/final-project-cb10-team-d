import Image from 'next/image';
import NavBar from './NavBar';


const Header = () => {
  return (
    <header className="bg-bianco p-0 m-0">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Image 
            src="/siclipulse-02.svg" 
            alt="Logo" 
            width={200} 
            height={50} 
          />
        </div>
        <NavBar />
      </div>
    </header>
  );
};

export default Header;
