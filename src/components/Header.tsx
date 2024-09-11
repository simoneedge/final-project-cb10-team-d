import Image from 'next/image';
import NavBar from './NavBar';
import { links } from '@/data/nav_link';


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
        <NavBar links={links} />
      </div>
    </header>
  );
};

export default Header;
