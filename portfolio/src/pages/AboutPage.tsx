import { Headerbar } from "../compoents/topBar"
import { ContactBottomBar } from "./Contact";

export function AboutMe() {
  return (
    <div className="bg-black text-white min-h-screen h-[100%]">
   <Headerbar/>
      <div className="flex justify-center items-center px-10">
      <div className="text-base sm:text-lg px-6 sm:px-20 pt-20 flex flex-col pb-20">
        <div className="text-2xl sm:text-4xl pb-8">
          Hi, I’m <b className="text-4xl sm:text-5xl text-white">Daksh Jain</b>
        </div>
        <div className="text-lg sm:text-xl text-justify leading-relaxed">
          <div>
            Full-stack web developer with a strong foundation in building scalable and secure web applications using technologies like Node.js, Express, React.js, MySQL, and Docker. I’ve gained industry experience through internships at Celebal Technologies, where I worked on backend systems, JWT authentication, API design, and containerized deployments. I also have hands-on knowledge in data science and machine learning, including experience with classification models and tools like Pandas, NumPy, and Scikit-learn.
          </div>
          <div className="pt-6">
            <ul className="list-disc pl-5">
              <li className="pt-4">
                <b>Brainly – Personal Content Saver:</b> A platform to save, organize, and share content across platforms with features like JWT authentication, public/private links, and embedded media previews.
              </li>
              <li className="pt-4">
                <b>Live Tracking Application:</b> A real-time tracking tool focused on smooth UI interaction and efficient backend logic for location-based services.
              </li>
            </ul>
          </div>
          <div className="pt-6">
            I'm a <b>5×</b> Microsoft Certified professional and a consistent learner who’s always exploring new technologies and improving my craft. I enjoy turning ideas into reliable solutions and collaborating on meaningful projects. Let’s connect and build something impactful together!
          </div>
        </div>
      </div>
        <div>
          <img src="src/images/Dakshbest.jpg" className="rounded-[50%]"></img>
        </div>
      <ContactBottomBar/>
      </div>
    </div>
  );
}

