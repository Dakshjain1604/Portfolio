
import { useLocation } from "react-router-dom";
const defaultStyling = "p-4 w-fit flex justify-center rounded-3xl gap-5 md:gap-10 lg:gap-20   text-lg cursor-pointer ";



export function Headerbar() {
    const location = useLocation();

  return (
    <div className="flex justify-center py-3 ">
        <nav className="flex space-x-4 text-white">
      <a href="/" className={`${location.pathname === '/' ? 'bg-blue-500 text-white' : ''} px-2 py-1 rounded-md`}>
        Home
      </a>
      <a href="/about" className={`${location.pathname === '/about' ? 'bg-blue-500 text-white' : ''} px-2 py-1 rounded-md`}>
        About
      </a>
      <a href="https://drive.google.com/drive/folders/17dRozDJ1YzoZLawDuOlTiMQDqodHz8Ed?usp=sharing" target="_blank"  className={`${location.pathname === '/resume' ? 'bg-blue-500 text-white' : ''} px-2 py-1 rounded-md`}>
        Resume
      </a>
      <a href="/contacts" className={`${location.pathname === '/contacts' ? 'bg-blue-500 text-white' : ''} px-2 py-1 rounded-md`}>
        Contacts
      </a>
      {/* <a href="/Projects" className={`${location.pathname === '/Projects' ? 'bg-blue-500 text-white' : ''} px-2 py-1 rounded-md`}>
        Projects
      </a> */}
    </nav>
    </div>
  );
}

