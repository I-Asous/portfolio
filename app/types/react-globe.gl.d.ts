declare module 'react-globe.gl' {
  import { ForwardRefExoticComponent, RefAttributes } from 'react'
  import type { Object3D } from 'three'

  export type GlobeClickPoint = {
    lat: number
    lng: number
    altitude: number
  }

  export type GlobeMethods = {
    controls: () => {
      autoRotate: boolean
      autoRotateSpeed: number
      enableZoom: boolean
    }
    pointOfView: (
      pov?: { lat?: number; lng?: number; altitude?: number },
      transitionMs?: number
    ) => { lat: number; lng: number; altitude: number }
  }

  export type GlobeProps<T = Record<string, unknown>> = {
    width?: number
    height?: number
    backgroundColor?: string
    globeImageUrl?: string
    bumpImageUrl?: string
    showAtmosphere?: boolean
    atmosphereColor?: string
    objectsData?: T[]
    objectLat?: string | ((d: T) => number)
    objectLng?: string | ((d: T) => number)
    objectAltitude?: string | number | ((d: T) => number)
    objectFacesSurface?: boolean | ((d: T) => boolean)
    objectThreeObject?: string | ((d: T) => Object3D)
    objectLabel?: string | ((d: T) => string)
    onGlobeClick?: (point: GlobeClickPoint, event: MouseEvent) => void
  }

  const Globe: ForwardRefExoticComponent<
    GlobeProps & RefAttributes<GlobeMethods>
  >
  export default Globe
}
