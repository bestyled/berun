import React from 'react'
import { StaticRouter, Route, Switch, Link, withRouter } from 'react-router-dom'
import * as ReactRouter from 'react-router'
import {
  HeadProvider,
  Head,
  BodyProvider,
  SiteDataProvider,
  WithRouteData,
  RoutesProvider
} from '@bestatic/components'
import get from 'lodash.get'
import isAbsolute from 'is-absolute-url'

function defaultComponents(routes) {
  const DefaultLayout = props =>
    props.disabled ? (
      props.children
    ) : (
      <div
        children={props.children}
        style={{
          padding: 32,
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: 768
        }}
      />
    )

  const index = routes.find(r => r.path == '/')

  const Root = withRouter(index.Root || DefaultLayout)

  const NotFound = (
    routes.find(r => r.path == '404') || {
      Component: props => (
        <Root {...props}>
          <h1>Uh oh, something went wrong</h1>
          <p>The page you are looking for doesn't exist or has been moved.</p>
          <h6>{props.location.pathname}
{' '}
404
</h6>
        </Root>
      )
    }
  ).Component

  return { NotFound, Root }
}

const ConditionalWrap = ({ condition, wrap, children }) =>
  condition ? wrap(children) : children
const ConditionalWrapData = ({ condition, wrap, children }) =>
  condition ? wrap(children) : children(null)

const generateRoute = ({
  route,
  routes,
  Root,
  NotFound,
  observers,
  datacache
}) => {
  const { children, Component, ...routeprops } = route

  // Clean up matches (if any) on routes entry, as repopulated on matched routes only
  delete route.match

  return (
    <Route
      {...routeprops}
      render={router => {
        // Save router match object on associated routes entry for Root or Component (via withRoutes) use;
        // nested routes will end up with a hierarchy of such match objects

        route.match = router.match

        return (
          // Wrap route with getData if function exists

          <ConditionalWrapData
            condition={typeof route.getData === 'function'}
            wrap={children => (
              <WithRouteData
                observers={observers}
                datacache={datacache}
                {...routeprops}
              >
                {children}
              </WithRouteData>
            )}
          >
            {data => {
              return router.match.isExact ? (
                // Render themed component if we are an exact match

                <Root meta={route.meta} routes={routes} {...router}>
                  <Component {...router} {...data} />
                </Root>
              ) : (
                // Otherwise render first child route that matches, cascading Root layout

                <Switch>
                  {children &&
                    children.map(childroute =>
                      generateRoute({
                        route: childroute,
                        routes,
                        Root: childroute.Root || Root,
                        observers,
                        datacache
                      })
                    )}
                  <Route
                    render={router => <NotFound {...router} routes={routes} />}
                  />
                </Switch>
              )
            }}
          </ConditionalWrapData>
        )
      }}
    />
  )
}

export const App = ({
  routes,
  sitedata = {},
  fullscreen = false,
  datacache = null,
  headTags = [],
  bodyTags = [],
  observers = [],
  staticrouter
}) => {
  const { NotFound, Root } = defaultComponents(routes)

  const result = (
    <HeadProvider tags={headTags}>
      <BodyProvider tags={bodyTags}>
        <SiteDataProvider {...sitedata}>
          <RoutesProvider routes={routes}>
            <Switch>
              {routes.map(route =>
                generateRoute({
                  routes,
                  Root: route.Root || Root,
                  NotFound,
                  observers,
                  datacache,
                  route
                })
              )}
              <Route
                render={router => <NotFound {...router} routes={routes} />}
              />
            </Switch>
          </RoutesProvider>
        </SiteDataProvider>
      </BodyProvider>
    </HeadProvider>
  )

  return staticrouter ? (
    <StaticRouter {...staticrouter}>{result}</StaticRouter>
  ) : (
    result
  )
}

export default App
