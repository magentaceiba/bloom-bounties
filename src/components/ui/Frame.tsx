import { cn } from '@/styles/cn'

export default function Frame(props: React.HtmlHTMLAttributes<HTMLDivElement>) {
  const classes = cn(
    'container bg-base-100 rounded-box flex flex-col gap-3 mx-auto p-4 border rounded-box border-faint',
    props.className
  )
  return <div className={classes}>{props.children}</div>
}
