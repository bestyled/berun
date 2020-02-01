/**
 * Copyright (c) 2018 Brent Jackson under MIT license from mdx-go
 * Portions copyright (c) 2018 BeRun Contributors
 */

import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'

export const ScrollTop = withRouter(
  class extends React.Component<{ location: any } & RouteComponentProps, any> {
    componentDidUpdate(prev) {
      if (prev.location.pathname !== this.props.location.pathname) {
        window.scrollTo(0, 0)
      }
      const { hash } = this.props.location
      if (hash) {
        const el = document.getElementById(hash.slice(1))
        if (!el) {
          return
        }
        el.scrollIntoView()
      }
    }

    render() {
      return null
    }
  }
)

export default ScrollTop
/*

import { useEffect, useContext } from 'react';
import * as ReactRouter from 'react-router'
const RouterContext = ReactRouter['__RouterContext']

export function useRouter() {
  return useContext<any>(RouterContext);
}

// Component that attaches scroll to top hanler on router change
// renders nothing, just attaches side effects
export const ScrollTop = () => {
  // this assumes that current router state is accessed via hook
  // but it does not matter, pathname and search (or that ever) may come from props, context, etc.
  const  { pathname, search } = useRouter();
  
  // just run the effect on pathname and/or search change
  useEffect(() => {
    try {
      // trying to use new API - https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } catch (error) {
      // just a fallback for older browsers
      window.scrollTo(0, 0);
    }
  }, [pathname, search]);
  
  // renders nothing, since nothing is needed
  return null;
};

export default ScrollTop
*/
