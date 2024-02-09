export type PathState = {
  bounties: number
  verify: number
  claims: number
  post: number
  funds: number
  admin: number
}

export type PathStatePostRequest = keyof PathState

export enum PathsCorrespondingTo {
  bounties = '/',
  claims = '/claims',
  post = '/post',
  funds = '/funds',
  verify = '/verify',
  admin = '/admin',
}

export const initialPathsState: PathState = {
  bounties: 0,
  verify: 0,
  claims: 0,
  post: 0,
  funds: 0,
  admin: 0,
}
