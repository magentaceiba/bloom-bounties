import Link from 'next/link'
import { JsonView } from '@/components/ui'

export default function HasError({ error }: { error: any }) {
  return (
    <div className="felx flex-col gap-5 max-w-full">
      <h1>We Have Encountered An Error Gathering The Data</h1>
      <div className="divider" />
      <JsonView json={error} />
      <div className="divider" />
      <Link href="/">
        <button className="btn btn-primary">Home</button>
      </Link>
    </div>
  )
}
