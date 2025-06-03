export default function PI({ pi }: { pi: number }) {
  const piColors = {
    D: "#3dbaea",
    C: "#f6bf31",
    B: "#ff6533",
    A: "#fc355a",
    S1: "#bd5ee4",
    S2: "#1567d6",
    X: "#19A83C",
  };

  let piClass;
  let bgColor;
  let borderColor;
  const piRanges = [
    { min: 100, max: 500, class: "D", color: piColors["D"] },
    { min: 501, max: 600, class: "C", color: piColors["C"] },
    { min: 601, max: 700, class: "B", color: piColors["B"] },
    { min: 701, max: 800, class: "A", color: piColors["A"] },
    { min: 801, max: 900, class: "S1", color: piColors["S1"] },
    { min: 901, max: 998, class: "S2", color: piColors["S2"] },
    { min: 999, max: 999, class: "X", color: piColors["X"] },
  ];

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
