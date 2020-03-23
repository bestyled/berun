import { useState, PropsWithChildren } from 'react'

interface RouteDataProps {
  observers: Promise<null>[]
  id: string
  getData: Function
  datacache: {}
}

export const WithRouteData = (props: PropsWithChildren<RouteDataProps>) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  const { id, datacache, getData, observers } = props

  if (datacache && id in datacache) {
    const cachedData = datacache[id]
    setLoading(false)
    setData(cachedData)
  } else {
    const dataPromise = async () => {
      const extData = await getData()
      if (datacache) {
        datacache[id] = extData
      }
      setLoading(false)
      setData(extData)
      return null
    }

    observers.push(dataPromise())
  }

  return (props.children as Function)({ data, loading })
}
