import { Headerbar } from "../compoents/topBar"

export function AboutMe() {
  return (
    <div className="bg-black text-white h-screen">
        <Headerbar></Headerbar>
      <div className="text-lg px-20 pt-20 flex flex-col">
        <div className="text-3xl pb-10">
        Hi, <b className="text-5xl ">I’m Daksh Jain</b>
        </div>
        <div className="text-2xl items-center text-justify ">
            <div>
            Full-stack web developer with a strong foundation in building scalable and secure web applications using technologies like Node.js, Express, React.js, MySQL, and Docker. I’ve gained industry experience through internships at Celebal Technologies, where I worked on backend systems, JWT authentication, API design, and containerized deployments. I also have hands-on knowledge in data science and machine learning, including experience with classification models and tools like Pandas, NumPy, and Scikit-learn.
            </div>
            <div className="pt-5">
               <ul>
                <li className="pt-5"><b>Brainly – Personal Content Saver:</b> A platform to save, organize, and share content across platforms with features like JWT authentication, public/private links, and embedded media previews.</li>
                <li className="pt-5">
                <b>Live Tracking Application:</b> A real-time tracking tool focused on smooth UI interaction and efficient backend logic for location-based services

                </li>
               </ul>
              <div className="pt-5">
              I'm a <b>5×</b> Microsoft Certified professional and a consistent learner who’s always exploring new technologies and improving my craft. I enjoy turning ideas into reliable solutions and collaborating on meaningful projects. Let’s connect and build something impactful together!
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
