import { BottomBar } from "../compoents/BottomBar";
import { Headerbar } from "../compoents/topBar";

export function GetinTouch() {
  return (
    <div className="flex flex-col justify-center items-center pb-20 sm:pb-32">
      <div className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold flex justify-center text-gray-400 pb-5 text-center">
        GET IN TOUCH
      </div>
      <div
        className="rounded-3xl h-fit w-fit border-gray-300 border-2 p-2 sm:p-4 hover:scale-110 transition-transform duration-300 text-white cursor-pointer text-center text-sm sm:text-lg"
        onClick={() => {
          window.open(
            "https://mail.google.com/mail/u/0/#inbox?compose=CllgCJNvMZDCbHbrHplLnvQpFQCgzcbVXzLFxsfvLLjBdfQpCBpMCTsQfgZQknBgQgRTcGWmhsB",
            "_blank"
          );
        }}
      >
        dakshjain080@gmail.com
      </div>
    </div>
  );
}


export function ContactBottomBar() {
  return (
    <div className="bg-gray-900 w-full h-fit text-white">
      <div className="flex flex-col justify-center items-center">
        <div className="pt-10 text-2xl font-semibold">Contact Me</div>
        <div className=" text-center text-sm sm:text-lg text-gray-400">
          I’m always open to new opportunities,
          exciting collaborations, or
          just
          <br/>a friendly hello.
        </div>
        <div ><BottomBar/></div>
      </div>
    </div>
  );
}

export function Contact() {
  return (
    <div className="bg-black h-[100vh]">
      <Headerbar />
      <div className="flex flex-col justify-end ">
        {" "}
        <div className="pt-30"><GetinTouch /></div>
        <div className="pt-20"><ContactBottomBar /></div>
      </div>
    </div>
  );
}
