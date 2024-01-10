import { FaDatabase } from 'react-icons/fa'

export default function NoData() {
  return (
    <div className="flex flex-col justify-center items-center gap-3 p-5">
      <FaDatabase size={50} />
      <h3>No Data</h3>
    </div>
  )
}
