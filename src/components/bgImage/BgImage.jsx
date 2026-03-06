const BgImage = ({ text = "Human Ethics Research" }) => {
    return (
      <div className="relative w-full">
        <img src="iitr-main-building.png" alt="Human Ethics Research" className="blur-[2px] w-full"/>
        <div className="absolute top-0 left-0 w-full h-full bg-[#00000088] flex items-center justify-center">
          <h1 className="text-[#ebebeb] text-3xl font-extrabold text-center px-4 shadow-2xl uppercase">{text}</h1>
        </div>
      </div>
    );
  };
  
  export default BgImage;