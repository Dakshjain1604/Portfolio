import { Github } from "../../icons/github";

interface images {
  Name?: string;
  GithubLink: string;
  mainImage: string;
  image1: string;
  image2: string;
  image3: string;
  description: string;
}

export const ProjectBento = (props: images) => {
  return (
    <div className="shadow-md shadow-gray-600 mt-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between px-2 sm:px-3 py-1 sm:py-2">
        <div className="text-xl sm:text-2xl font-bold mb-1 sm:mb-0">{props.Name}</div>
        <div
          className="hover:scale-110 hover:text-gray-400 transition-all cursor-pointer"
          onClick={() => {
            window.open(`${props.GithubLink}`, "_blank");
          }}
        >
          <Github height={24} width={24} />
        </div>
      </div>

      <div className="w-full rounded-lg p-1 sm:p-2">
        {/* Main large image container */}
        <div className="w-full h-36 sm:h-48 md:h-56 mb-1 sm:mb-2 rounded-lg overflow-hidden">
          <img
            src={props.mainImage}
            alt="Main project"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Three smaller images container - stack on mobile, row on larger screens */}
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
          {/* First small image */}
          <div className="w-full sm:flex-1 h-28 sm:h-32 md:h-40 rounded-lg overflow-hidden mb-1 sm:mb-0">
            <img
              src={props.image1}
              alt="Project detail 1"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Second small image */}
          <div className="w-full sm:flex-1 h-28 sm:h-32 md:h-40 rounded-lg overflow-hidden mb-1 sm:mb-0">
            <img
              src={props.image2}
              alt="Project detail 2"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Third small image */}
          <div className="w-full sm:flex-1 h-28 sm:h-32 md:h-40 rounded-lg overflow-hidden mb-1 sm:mb-0">
            <img
              src={props.image3}
              alt="Project detail 3"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <div className="text-xs sm:text-sm text-gray-400 px-2 sm:px-4 py-1 sm:py-2 text-center sm:text-left">
        {props.description}
      </div>
    </div>
  );
};