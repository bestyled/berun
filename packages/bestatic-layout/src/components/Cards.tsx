import * as React from 'react'
import styled, { StyledComponent } from 'styled-components'
import {
  space,
  color,
  maxWidth,
  SpaceProps,
  ColorProps,
  MaxWidthProps,
  width,
  borderRadius,
  WidthProps,
  BorderRadiusProps,
  themeGet
} from 'styled-system'
import { Link } from './Link'

type CssProps = { css?: any }
const css = props => props.css

const CardsRoot = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  flex: 1;
  flex-shrink: 0;
  min-height: 0;
  ${space} ${color} ${maxWidth} ${css}
` as StyledComponent<SpaceProps & ColorProps & MaxWidthProps & CssProps, any>

CardsRoot.defaultProps = {
  mx: 0,
  mt: [-90, -90, -140],
  px: 4,
  py: 4,
  color: '#333'
}

export const Cards = props => <CardsRoot>{props.children}</CardsRoot>

Cards.isCards = true

export const Card = styled.div`
  flex: 1;
  flex-shrink: 0;
  min-height: 0;
  
  border-radius: 5px;
  box-shadow: 0 0 5px 0 rgba(0,0,0,.5);

  & h1 {
     font-weight: ${p => themeGet('fontWeights.normal', '300')(p)};
     line-height: normal;
  }

  ${space} ${width} ${color} ${css} ${borderRadius}
 ` as StyledComponent<
  SpaceProps & WidthProps & ColorProps & BorderRadiusProps & CssProps,
  any
>

Card.defaultProps = {
  mx: [0, 100, 160, 270],
  my: 20,
  px: 20,
  bg: 'white',
  borderRadius: [0, 2]
}

export const TitleLink = styled(Link)`
  ${space} ${color} ${css}
` as StyledComponent<SpaceProps & ColorProps & CssProps, any>

TitleLink.defaultProps = {
  color: 'inherit'
}

export const FooterLink = styled(Link)`
  ${space} ${color} ${css}
` as StyledComponent<SpaceProps & ColorProps & CssProps, any>

FooterLink.defaultProps = {}

export const Post = props =>
  props.items ? (
    <>
      {props.items.map(item => (
        <Card key={item.id}>
          <h1>
            <TitleLink href={`/blog/post/${item.id}`}>{item.title}</TitleLink>
          </h1>
          <h3>{item.user.name}</h3>
          <p>
            {item.body}
            ....
          </p>
          <p>
            <FooterLink href={`/blog/post/${item.id}`}>
              Read More &rarr;
            </FooterLink>
          </p>
        </Card>
      ))}
    </>
  ) : (
    <Card>
      <h1>{props.title}</h1>
      <h3>{props.user.name}</h3>
      <p>{props.body}</p>
    </Card>
  )

Post.isPost = true
