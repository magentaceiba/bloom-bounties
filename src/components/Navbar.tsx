'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'
import NextLink from 'next/link'
import ThemeSwitcher from './ThemeSwitcher'
import Link from 'next/link'
import { Button, Dropdown } from 'react-daisyui'
import WalletWidget from './WalletWidget'
import { GiHamburgerMenu } from 'react-icons/gi'
import cn from 'classnames'
import { useRole } from '@/hooks'
import { PathStatePostRequest, PathsCorrespondingTo } from '@/lib/types/paths'
import { firstLetterToUpper } from '@/lib/utils'

type NavbarFields = Exclude<PathStatePostRequest, 'bounties' | 'funds'>

const NavItems = ({
  pathname,
  reverse = false,
}: {
  pathname: string
  reverse?: boolean
}) => {
  const { roles } = useRole()
  const iS = roles.isSuccess

  const can: Record<NavbarFields, boolean> = {
    post: iS && roles.data!.isIssuer,
    verify: iS && roles.data!.isVerifier,
    admin: iS && roles.data!.isOwner,
    claims: iS && roles.data!.isClaimer,
  }

  const arr = [
    { href: '/', label: 'Bounties' },
    { href: '/funds', label: 'Funds' },
  ]

  Object.entries(PathsCorrespondingTo).forEach(([key, value]) => {
    if (can[key as NavbarFields])
      arr.push({
        href: value,
        label: firstLetterToUpper(key),
      })
  })

  if (reverse) arr.reverse()

  return arr.map((i, index) => {
    if (reverse) {
      const className = cn(
        'my-1 p-2 text-md',
        pathname === i.href && 'bg-base-200'
      )
      return (
        <Dropdown.Item href={i.href} key={index} className={className}>
          {i.label}
        </Dropdown.Item>
      )
    }
    return (
      <Link href={i.href} key={index}>
        <Button size={'sm'} {...(pathname !== i.href && { color: 'ghost' })}>
          {i.label}
        </Button>
      </Link>
    )
  })
}

export default function Navbar() {
  const pathname = usePathname()
  return (
    <div className="navbar-c bottom-0 drop-shadow-2xl rounded-tl-xl rounded-tr-xl bg-base-100 border-t border-x">
      <NextLink href="/">
        <Image
          priority
          src="/inverter-light-logo.svg"
          alt="inverter_logo"
          width={42}
          height={42}
        />
      </NextLink>

      <ThemeSwitcher className="lg:flex hidden" />

      <WalletWidget />

      <div className="items-center lg:flex hidden gap-4">
        <h1>|</h1>
        <NavItems pathname={pathname} />
      </div>

      <Dropdown className="relative items-center flex lg:hidden">
        <Button tag="label" color="ghost" className="py-0 px-1" tabIndex={0}>
          <GiHamburgerMenu className="fill-current w-5 h-5" />
        </Button>
        <Dropdown.Menu className="menu-sm absolute bottom-[120%] right-0">
          <Dropdown.Item className="flex gap-2">
            <ThemeSwitcher className="w-full" />
          </Dropdown.Item>
          <NavItems pathname={pathname} reverse />
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}
