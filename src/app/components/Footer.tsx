import { BottomBar } from './BottomBar';

export default function Footer() {
  return (
    <footer className="bottom-0 left-0 w-full z-50 bg-gray-80/50 border-1 border-white/50 rounded-md mt-20 text-white px-6 py-10">
      <div className="flex flex-col md:flex-row justify-around items-start md:items-center">
        
        {/* Left Section - Contact Text */}
        <div className="mb-6 md:mb-0">
          <h2 className="text-4xl font-bold">CONTACT ME</h2>
          <p className="text-lg mt-2 text-gray-500">Want your next big thing to deploy right? Let’s talk.</p>
        </div>

        {/* Right Section - BottomBar and Contact Info */}
        <div className="flex flex-col items-start md:items-end gap-4">
          <BottomBar />
          <div className="text-xl">☎ +91 7627056978</div>
          <div className="text-xs text-white text-right">
            © 2024 Daksh Jain - Full Stack Developer
          </div>
        </div>

      </div>
    </footer>
  );
}
