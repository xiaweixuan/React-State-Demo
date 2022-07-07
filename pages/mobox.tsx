import { Button } from "antd";
import { useQueryParams } from "./hooks";

export default function Mobox() {
  // console.log(window)
  const [page, setPage] = useQueryParams('page', 0, Number)
  const [current, setCurrent] = useQueryParams('current', 0, Number)

  return (
    <div>
      <Button onClick={() => setPage(page + 1)}>{page}</Button>
      <Button onClick={() => setCurrent(current + 1)}>{current}</Button>
      <h1>Mobox</h1>
    </div>
  );
}
