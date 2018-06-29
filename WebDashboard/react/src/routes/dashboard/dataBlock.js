// stable
import React from 'react'
import { Block } from './block'
import _ from 'lodash'

export const DataBlock = props => {
  return (
    <div className="acb-details-wrapper">
      {_.get(props, 'countData.UsersCount._allUsersMeta') ? (
        <Block
          title="total_users"
          stats={props.countData.UsersCount._allUsersMeta.count}
          imgSrc="users"
          color="#855EF5"
        />
      ) : null}
      {_.get(props, 'countData.SwipesCount._allVotesMeta') ? (
        <Block
          title="total_swipes"
          stats={props.countData.SwipesCount._allVotesMeta.count}
          imgSrc="file"
          color="#43C4F3"
        />
      ) : null}
      {_.get(props, 'countData.MatchesCount.matchCount') ? (
        <Block
          title="total_matches"
          stats={props.countData.MatchesCount.matchCount.count}
          imgSrc="heart"
          color="#FF4DA8"
        />
      ) : null}
      {props.cityCount ? (
        <Block
          title="total_cities"
          stats={props.cityCount}
          imgSrc="building"
          color="#46D03E"
        />
      ) : null}
    </div>
  )
}
