import React from 'react'

import { AccentBar } from './Layout.AccentBar'
import { Container } from './Layout.Container'
import { Footer } from './Layout.Footer'
import { Main } from './Layout.Main'
import { MenuToggle } from './Layout.MenuToggle'
import { TopNav, TopNavItem } from './Layout.TopNav'
import { Root } from './Layout.Root'
import { ScrollAnimation } from './Layout.ScrollAnimation'
import { SearchBox } from './Layout.SearchBox'
import { Sidebar } from './Layout.Sidebar'

export const Layout = Object.assign(
  props => {
    const children = React.Children.toArray(props.children)
    const columns = children.filter(
      (child: any) =>
        !child.type.isCards &&
        !child.type.isTopNav &&
        !child.type.isFooter &&
        !child.type.isMenuToggle
    )
    const [topnav] = children.filter(child => (child as any).type.isTopNav)
    const [menuToggle] = children.filter(
      child => (child as any).type.isMenuToggle
    )
    const [footer] = children.filter(child => (child as any).type.isFooter)
    const cards = children.filter(child => (child as any).type.isCards)
    console.log(cards, columns)

    return (
        <Root id="layout">
          {topnav}
          {menuToggle}
          {cards.length > 0 ? (
            cards
          ) : (
           columns.length > 0 ? <Container id="layout-root-container" {...props}>{columns}</Container>
           : null )}
          {footer}
        </Root>
    )
  },
  {
    AccentBar,
    Sidebar,
    Main,
    MenuToggle,
    ScrollAnimation,
    SearchBox,
    TopNav,
    TopNavItem,
    Footer
  }
)

export default Layout
