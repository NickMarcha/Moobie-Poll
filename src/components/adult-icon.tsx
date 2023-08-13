import WidePeepoHHappy from "../images/widePeepoHappy.png";
import Coomer from "../images/Coomer.png";
type adultIconProps = {
  adult: boolean;
};

const AdultIcon = ({ adult }: adultIconProps) => {
  if (adult === undefined) return <>undefined</>;

  if (adult) {
    return <img title="adult:true" src={Coomer} alt="adult" />;
  }

  //Happens so rarely that I don't want to make a new image for it
  //return <img title="adult:false" src={WidePeepoHHappy} alt="not adult" />;

  return <></>;
};

export default AdultIcon;
