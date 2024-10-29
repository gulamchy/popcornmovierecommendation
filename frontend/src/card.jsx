import "remixicon/fonts/remixicon.css";

// eslint-disable-next-line react/prop-types
const Card = ({ title, vote_average, poster, provider, release_date }) => {
  return (
    <div>
      <div className="flex items-center justify-between w-full">
        <h4 className="text-base text-slate-800 font-inter font-medium">
          {title}
        </h4>
        <div className="flex items-center justify-right gap-1">
          <p className="text-base text-slate-800 font-inter">{vote_average}</p>
          <i className="ri-heart-fill text-slate-400"></i>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center p-8 w-full">
        <img
          src={poster}
          alt={title}
          className="rounded-xl h-full w-auto mx-auto rounded-2xl shadow-2xl object-contain"
        />
      </div>

      <div className="flex items-center justify-between w-full">
        <p className="text-base text-slate-800 font-inter">{provider}</p>
        <p className="text-base text-slate-800 font-inter">{release_date}</p>
      </div>
    </div>
  );
};

export default Card;
