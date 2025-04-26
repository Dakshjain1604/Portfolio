import{useNavigate} from "react-router-dom";
const defaultStyling="flex justify-center gap-5 md:gap-10 lg:gap-20 py-3 text-lg cursor-pointer  ";
export function Headerbar() {
    const navigate = useNavigate();
    return <>
        <div className={`${defaultStyling}` }>
            <div className="hover:text-white text-slate-300" onClick={()=>{
                navigate('/');
            }}>Home</div>
            <div className="hover:text-white text-slate-300" onClick={()=>{
                navigate('/about');
            }}>About</div>
            <div className="hover:text-white text-slate-300" onClick={()=>{
                window.open("https://drive.google.com/drive/folders/17dRozDJ1YzoZLawDuOlTiMQDqodHz8Ed?usp=sharing","_blank");
            }}>Resume</div>
            <div className="hover:text-white text-slate-300" onClick={()=>{
              navigate('/contacts');
            }}>Contacts</div>
        </div>
    </>
}

