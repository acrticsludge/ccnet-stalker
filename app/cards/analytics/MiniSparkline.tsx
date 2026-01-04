import { LineChart, Line } from "recharts";

export default function MiniSparkline({
  data,
}: {
  data: { d: string; r: number }[];
}) {
  return (
    <LineChart width={100} height={30} data={data.slice(-7)}>
      <Line type="monotone" dataKey="r" strokeWidth={2} dot={false} />
    </LineChart>
  );
}
