'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { auth, db } from '@/firebaseconfig'; // Importa db per Firestore
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Importa getDoc da Firestore
import LoginButton from './Login';
import { toast } from 'react-toastify';

interface NavLink {
  name: string;
  href: string;
}

interface NavBarProps {
  links?: NavLink[];
}

const NavBar = ({ links = [] }: NavBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(links[0]?.name);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null); // Stato per nome utente
  const router = useRouter(); // Initialize useRouter
  const pathname = usePathname();

  // Funzione per recuperare i dati dell'utente da Firestore
  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.firstName); // Imposta il nome
      } else {
        console.log('No user data found!');
      }
    } catch (error) {
      console.error('Errore nel recupero dei dati utente:', error);
    }
  };

  useEffect(() => {
    // Se sei su /profile, non selezionare nessun elemento
    if (pathname === "/profile") {
      setActiveItem(null);
    } else {
      // Controlla se l'item corrente è già attivo prima di aggiornarlo
      if (activeItem !== links.find((link) => link.href === pathname)?.name) {
        const currentLink = links.find((link) => link.href === pathname);
        if (currentLink) {
          setActiveItem(currentLink.name);
        }
      }
    }
  }, [pathname, activeItem, links]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        fetchUserData(user.uid); // Richiama la funzione per recuperare nome e cognome
        setActiveItem(links[0]?.name);
      } else {
        setUserEmail(null);
        setUserName(null);
        setActiveItem(links[0]?.name);
      }
    });

    return () => unsubscribe();
  }, [router, links]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLoginSuccess = (item: string) => {
    setActiveItem(item);
    setIsOpen(false);
  };

  const handleClick = (item: string) => {
    setActiveItem(item);
    setIsOpen(false);
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUserEmail(null);
      setUserName(null);
      setActiveItem(links[0]?.name); // Reset the active item to "Home" after logging out
      router.push('/'); // Redirect to Home after logout
      toast.info('Logout effettuato con successo!');
    });
  };

  return (
    <header className="relative bg-bianco p-4">
      <div className="hidden md:flex space-x-6 items-center">
        {links.map((link) => {
          if (link.name === 'Proponi Evento') {
            // Se l'utente è autenticato, mostra il link normalmente
            if (userEmail) {
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => handleClick(link.name)}
                  className={`text-verde hover:text-verde hover:font-bold ${
                    activeItem === link.name ? 'font-bold' : ''
                  }`}
                >
                  {link.name}
                </Link>
              );
            } else {
              // Se l'utente non è autenticato, mostra il componente LoginButton
              return (
                <LoginButton
                  key={`login-${link.name}`}
                  buttonLabel="Proponi evento"
                  redirectTo="/propose"
                  onLoginSuccess={() => handleLoginSuccess(links[4]?.name)}
                  buttonClassName="text-verde hover:text-verde hover:font-bold"
                />
              );
            }
          }

          // Rendi normalmente gli altri link
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => handleClick(link.name)}
              className={`text-verde hover:text-verde hover:font-bold ${
                activeItem === link.name ? 'font-bold' : ''
              }`}
            >
              {link.name}
            </Link>
          );
        })}

        {userName ? (
          <>
            <Link href="/profile">
              <div className="flex items-center justify-center w-8 h-8 bg-red-600 text-white rounded-full cursor-pointer">
                {userName.charAt(0).toUpperCase()}
              </div>
            </Link>
            <button onClick={handleLogout} className="text-verde ml-2">
              LOGOUT
            </button>
          </>
        ) : (
          <LoginButton />
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="text-verde focus:outline-none">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
      {/* Mobile Menu */}
        <div
          className={`fixed top-50px right-0 w-full h-80 bg-bianco z-50 transform transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <button
            onClick={toggleMenu}
            className="p-4 text-verde focus:outline-none absolute top-4 right-4"
          >
          </button>
          <div className="flex flex-col items-center space-y-4 p-6 text-center h-auto">
            {/* Cambia h-full a h-auto */}
            {links.map((link) => {
              if (link.name === 'Proponi Evento') {
                if (userEmail) {
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => handleClick(link.name)}
                      className={`block text-verde hover:text-verde hover:font-bold ${
                        activeItem === link.name ? 'font-bold' : 'font-normal'
                      } py-2`}
                    >
                      {link.name}
                    </Link>
                  );
                } else {
                  return (
                    <LoginButton
                      key={`login-${link.name}`}
                      buttonLabel="Proponi evento"
                      redirectTo="/propose"
                      onLoginSuccess={() => handleLoginSuccess(links[4]?.name)}
                      buttonClassName="text-verde hover:text-verde hover:font-bold"
                    />
                  );
                }
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => handleClick(link.name)}
                  className={`text-verde hover:text-verde hover:font-bold ${
                    activeItem === link.name ? 'font-bold' : ''
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            {userName ? (
              <>
                <Link href="/profile">
                  <div className="flex items-center justify-center w-8 h-8 bg-red-600 text-white rounded-full cursor-pointer">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </Link>
                <button onClick={handleLogout} className="text-verde ml-2">
                  LOGOUT
                </button>
              </>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      
    </header>
  );
};

export default NavBar;
