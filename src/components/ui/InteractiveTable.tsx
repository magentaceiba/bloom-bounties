'use client'

import { Loading, Table } from 'react-daisyui'
import { NoData } from '.'
import { Fragment, useState } from 'react'
import cn from 'classnames'
import Link from 'next/link'

export default function InteractiveTable({
  isPending,
  heads,
  rows,
  onSelect,
  extraPadding = true,
}: {
  isPending: boolean
  heads: string[]
  rows: { row: { item: string; type?: 'url' }[] }[]
  onSelect?: (index: number) => void
  extraPadding?: boolean
}) {
  const [selected, setSelected] = useState<number>(0)

  if (isPending) return <Loading className={'m-4'} />

  if (!rows.length) return <NoData />

  return (
    <div
      className={cn(
        'overflow-y-scroll w-full max-w-4xl max-h-64',
        extraPadding && 'my-10'
      )}
    >
      <Table>
        <Table.Head>
          {heads.map((head, index) => (
            <span key={index}>{head}</span>
          ))}
        </Table.Head>

        <Table.Body>
          {rows.map(({ row }, index) => (
            <Table.Row
              className={cn(
                'cursor-pointer transition-transform duration-150 ease-in-out transform active:scale-95',
                'hover:bg-primary hover:text-primary-content',
                selected === index && 'bg-primary text-primary-content'
              )}
              key={index}
              onClick={() => {
                setSelected(index)
                onSelect?.(index)
              }}
            >
              {row.map((i, index) => {
                return (
                  <Fragment key={index}>
                    {(() => {
                      if (i.type !== 'url') return <span>{i.item}</span>

                      return (
                        <Link href={i.item} target="_blank">
                          {i.item}
                        </Link>
                      )
                    })()}
                  </Fragment>
                )
              })}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}
