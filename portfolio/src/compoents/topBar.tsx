import { useNavigate } from "react-router-dom";
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
      <a href="/resume" className={`${location.pathname === '/resume' ? 'bg-blue-500 text-white' : ''} px-2 py-1 rounded-md`}>
        Resume
      </a>
      <a href="/contacts" className={`${location.pathname === '/contacts' ? 'bg-blue-500 text-white' : ''} px-2 py-1 rounded-md`}>
        Contacts
      </a>
    </nav>
    </div>
  );
}

  
        // <div className="flex justify-center">
        //     <div className={`${defaultStyling}`}>
        //         <div className="hover:text-slate-300 text-white" onClick={() => {
        //             navigate('/');
        //         }}>Home</div>
        //         <div className="hover:text-white text-slate-300" onClick={() => {
        //             navigate('/about');
        //         }}>About</div>
        //         <div className="hover:text-white text-slate-300" onClick={() => {
        //             window.open("https://drive.google.com/drive/folders/17dRozDJ1YzoZLawDuOlTiMQDqodHz8Ed?usp=sharing", "_blank");
        //         }}>Resume</div>
        //         <div className="hover:text-white text-slate-300" onClick={() => {
        //             navigate('/contacts');
        //         }}>Contacts</div>
        //     </div>
        // </div>