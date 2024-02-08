export type PathState = {
  bounties: number
  verify: number
  claims: number
}

export type PathStatePostRequest = keyof PathState

export enum PathsCorrespondingTo {
  bounties = '/',
  verify = '/verify',
  claims = '/claims',
}
