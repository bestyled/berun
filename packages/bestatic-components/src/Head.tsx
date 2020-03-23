import * as React from 'react'
import { createPortal } from 'react-dom'

const noop = () => {
  console.warn('Missing HeadProvider')
}

type HeadContextProps = {
  tags: any[]
  push: Function
}

type HeadProviderProps = {
  tags: any[]
}

export const Context = React.createContext<HeadContextProps>({
  tags: [],
  push: noop
})

export const HeadProvider = (
  props: React.PropsWithChildren<HeadProviderProps>
) => {
  const push = (elements: any) => {
    props.tags.push(...elements)
  }

  const context = {
    ...props,
    push
  }

  return <Context.Provider value={context}>{props.children}</Context.Provider>
}

export const Head = (props: React.PropsWithChildren<{}>) => {
  const [didMount, setDidMount] = React.useState(false)

  const rehydrate = () => {
    const children = React.Children.toArray(props.children)
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

    setDidMount(true)
  }

  React.useEffect(() => {
    rehydrate()
  }, [])

  const children = React.Children.toArray(props.children).map((child: any) =>
    React.cloneElement(child, {
      'data-head': true
    })
  )

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
