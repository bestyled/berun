// zero-config presets
export { DocsLayout } from './layouts/DocsLayout'
export { HeroLayout } from './layouts/HeroLayout'
export { BlogLayout } from './layouts/BlogLayout'

// individual components
export { ScrollTop } from './components/ScrollTop'
export { Post } from './components/Cards'
export { Button, ButtonGroup } from './components/Button'
export { BeStyledLogo } from './img/bestyled'
export { Link } from './components/Link'

export { Layout } from './components/Layout'

export { useToggle, ToggleProvider } from './providers/ToggleProvider'

export { NavLinks, NavLink } from './components/NavLinks'

export { Pagination } from './components/Pagination'

// pass thru style provider
export { default as StyleProvider } from '@bestatic/styled'

// pass thru helmet head provider
export { Head, HeadProvider, Body, BodyProvider } from '@bestatic/components'
