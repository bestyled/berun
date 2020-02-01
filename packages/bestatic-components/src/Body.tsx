import React from 'react'
import { createPortal } from 'react-dom'

const noop = () => {
  console.warn('Missing BodyProvider')
}

type ContextProps = {
  tags: any[]
  push: Function
}

type BodyProviderProps = {
  tags: any[]
}

export const Context = React.createContext<ContextProps>({
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
      <Context.Provider value={context}>{this.props.children}</Context.Provider>
    )
  }
}

export class Body extends React.Component<any, any> {
  state = {
    didMount: false
  }

  rehydrate = () => {
    const children = React.Children.toArray(this.props.children)

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
        this.appendScript(child)
      }
    })

    this.setState({
      didMount: true
    })
  }

  appendScript(scriptTag: any) {
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

  componentDidMount() {
    this.rehydrate()
  }

  render() {
    const children = React.Children.toArray(this.props.children)
      // .filter((child: any) => (child.type == 'script'))
      .map((child: any) =>
        React.cloneElement(child, {
          'data-body': true
        })
      )

    const { didMount } = this.state

    if (!didMount) {
      return (
        <Context.Consumer
          children={({ push }) => {
            push(children)
            return false
          }}
        />
      )
    }

    return createPortal(children, document.body)
  }
}
