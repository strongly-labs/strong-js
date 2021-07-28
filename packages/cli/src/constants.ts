export enum LinkOperation {
  SYMLINK,
  COPY,
}

interface ModuleLink {
  fromSuffix: string
  toSuffix: string
  operation: LinkOperation
}

interface ModuleLinks {
  [k: string]: ModuleLink
}

export const moduleLinks: ModuleLinks = {
  core: {
    fromSuffix: '',
    toSuffix: '/.strong',
    operation: LinkOperation.SYMLINK,
  },
  admin: {
    fromSuffix: '/api',
    toSuffix: '/pages/api/s',
    operation: LinkOperation.COPY,
  },
}
