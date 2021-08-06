import { JsonObject } from 'type-fest'

export interface StrongConfig {
  packages: string[]
}

export interface AppManifest {
  name: string
  path: string
  config?: StrongConfig
}

export interface PackageManifest {
  org: string
  name: string
  workspace: string
  template: string
  config?: JsonObject | null
}

export interface PostProcessArgs {
  mainZone: string
  packageName: string
  port: number
  envFileNames: string[]
  nextConfigFileName: string
  zoneHost: string
}
