import { img } from "./svg-cr9xn";

function Group() {
  return <img className="block w-12 h-12 object-contain" src={img} />;
}

export default function Icon1() {
  return (
    <div className="relative w-40 h-40" data-name="Icon 1">
      <Group />
    </div>
  );
}