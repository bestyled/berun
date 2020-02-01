import React from 'react'

interface RouteDataProps {
  observers: Promise<null>[]
  id: string
  getData: Function
  datacache: {}
}

export class WithRouteData extends React.Component<RouteDataProps, any> {
  constructor(props: RouteDataProps) {
    super(props)
    this.prefetchData()
  }

  state = {
    loading: true
  }

  prefetchData() {
    const { id, datacache, getData, observers } = this.props

    if (datacache && id in datacache) {
      const data = datacache[id]

      this.state = { loading: false, ...data }
      // called from constructor so OK to set state directly

      return
    }

    const dataPromise = new Promise<null>(async resolve => {
      const data = await getData()
      if (datacache) {
        datacache[id] = data
      }
      this.setState({ loading: false, ...data })
      resolve(null)
    })

    observers.push(dataPromise)
  }

  render() {
    return (this.props.children as Function)(this.state)
  }
}
