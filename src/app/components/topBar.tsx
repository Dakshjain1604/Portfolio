export function Headerbar() {
    return (
      <div className="flex justify-center mt-5">
        <div className="flex flex-row justify-center itmes-center py-3  border-white/50 border-1 w-fit px-5 rounded-xl shadow-white/20 shadow-lg">
        <nav className="flex space-x-4 text-white">
          <a className="px-2 py-1 rounded-md cursor-pointer hover:scale-120 hover:border-blue-500 hover:border-b-1" href="#home">Home</a>
          <a className="px-2 py-1 rounded-md cursor-pointer hover:scale-120 hover:text-blue-500" href="#about">About</a>
          <a className="px-2 py-1 rounded-md cursor-pointer hover:scale-120 hover:text-blue-500"  href="https://drive.google.com/drive/folders/17dRozDJ1YzoZLawDuOlTiMQDqodHz8Ed?usp=sharing"
          target="_blank">Resume</a>
          <a className="px-2 py-1 rounded-md cursor-pointer hover:scale-120 hover:text-blue-500">Contacts</a>
        </nav>
      </div>
      </div>
    );
  }
  