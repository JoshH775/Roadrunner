import { piRanges } from "../../types";

export default function PI({ pi }: { pi: number }) {


  let piClass;
  let bgColor;
  let borderColor;


  const found = piRanges.find((range) => pi >= range.min && pi <= range.max);
  if (found) {
    piClass = found.class;
    bgColor = found.color;
    borderColor = found.color;
  }

  return (
    <div
      className="w-fit flex items-center p-[1px] justify-center border text-white font-semibold text-sm text-center"
      style={{ backgroundColor: bgColor, borderColor: borderColor }}
    >
      <p>{piClass}</p>
      <p className="text-black ml-1 bg-white p-0.5">{pi}</p>
    </div>
  );
}
