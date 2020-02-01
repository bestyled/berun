import React from 'react'
import { createPortal } from 'react-dom'

const noop = () => {
  console.warn('Missing HeadProvider')
}

type ContextProps = {
  tags: any[]
  push: Function
}

type HeadProviderProps = {
  tags: any[]
}

export const Context = React.createContext<ContextProps>({
  tags: [],
  push: noop
})

export class HeadProvider extends React.Component<HeadProviderProps> {
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

export class Head extends React.Component<any, any> {
  state = {
    didMount: false
  }

  rehydrate = () => {
    const children = React.Children.toArray(this.props.children)
    /*  const nodes = [
      ...document.head.querySelectorAll('[data-head]')
    ]

    nodes.forEach(node => {
    //  node.remove()
    }) */
    children.forEach((child: any) => {
      if (child.type === 'title') {
        const title = document.head!.querySelector('title')
        if (title) {
          title.remove()
        }
      }
      if (child.type === 'meta') {
        const { name } = child.props
        let meta
        if (name) {
          meta = document.head!.querySelector(`meta[name="${name}"]`)
        }
        if (meta) {
          meta.remove()
        }
      }
      if (child.type === 'link') {
        const { id } = child.props
        let link
        if (id) {
          link = document.head!.querySelector(`link[id="${id}"]`)
        }
        if (link) {
          link.remove()
        }
      }
    })

    this.setState({
      didMount: true
    })
  }

  componentDidMount() {
    this.rehydrate()
  }

  render() {
    const children = React.Children.toArray(this.props.children).map(
      (child: any) =>
        React.cloneElement(child, {
          'data-head': true
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

    if (!document.head) {
      throw new Error('Missing Document Head')
    }

    return createPortal(children, document.head)
  }
}
