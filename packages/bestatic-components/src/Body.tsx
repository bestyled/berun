import * as React from 'react'
import { createPortal } from 'react-dom'

const noop = () => {
  console.warn('Missing BodyProvider')
}

type BodyContextProps = {
  tags: any[]
  push: Function
}

type BodyProviderProps = {
  tags: any[]
}

export const BodyContext = React.createContext<BodyContextProps>({
  tags: [],
  push: noop
})

export class BodyProvider extends React.Component<BodyProviderProps> {
  static defaultProps = {
    tags: []
  }

  push = (elements: any) => {
    this.props.tags.push(...elements)
  }

  render() {
    const context = {
      ...this.props,
      push: this.push
    }

    return (
      <BodyContext.Provider value={context}>
        {this.props.children}
      </BodyContext.Provider>
    )
  }
}

export const Body = (props: React.PropsWithChildren<{}>) => {
  const [didMount, setDidMount] = React.useState(false)

  const rehydrate = () => {
    const children = React.Children.toArray(props.children)

    setTimeout(() => {
      const nodes = Array.from(document.body.querySelectorAll('[data-body]'))

      nodes.forEach(node => {
        //   node.remove()
      })
    }, 200)

    children.forEach((child: any) => {
      if (child.type === 'script') {
        const { id } = child.props
        let oldScript
        if (id) {
          oldScript = document.body.querySelector(`script[id="${id}"]`)
        }
        if (oldScript) {
          oldScript.remove()
        }
        appendScript(child)
      }
    })

    setDidMount(true)
  }

  const appendScript = (scriptTag: any) => {
    const {
      onError,
      onLoad,
      children,
      dangerouslySetInnerHTML,
      ...props
    } = scriptTag.props

    // Create a new HTML script element
    const newElement = document.createElement('script')

    Object.keys(props).forEach(key => newElement.setAttribute(key, props[key]))

    if (children) {
      newElement.innerHTML = children
    }
    if (dangerouslySetInnerHTML) {
      newElement.innerHTML = dangerouslySetInnerHTML.__html
    }

    // Bind event listeners
    newElement.addEventListener('load', onLoad)
    newElement.addEventListener('error', onError)

    // Append the new script tag
    document.body.appendChild(newElement)
    return newElement
  }

  React.useEffect(() => {
    rehydrate()
  }, [])

  const children = React.Children.toArray(props.children)
    // .filter((child: any) => (child.type == 'script'))
    .map((child: any) =>
      React.cloneElement(child, {
        'data-body': true
      })
    )

  if (!didMount) {
    return (
      <BodyContext.Consumer
        children={({ push }) => {
          push(children)
          return false
        }}
      />
    )
  }

  return createPortal(children, document.body)
}
