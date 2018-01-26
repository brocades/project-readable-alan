import { combineReducers } from 'redux'

import {
	SEND_POST,
	EDIT_POST,
	DELETE_POST,
	VOTE_POST,
	UPDATE_COMMENT_COUNT,
	SEND_COMMENT,
	EDIT_COMMENT,
	DELETE_COMMENT,
	VOTE_COMMENT
} from '../actions'

const initialPostsState = {
	posts: {},
	categories: [
    {
      name: 'all',
      path: 'all'
    },
    {
      name: 'react',
      path: 'react'
    },
    {
      name: 'redux',
      path: 'redux'
    },
    {
      name: 'udacity',
      path: 'udacity'
    }
  ]
}

const initialCommentsState = {
	comments: {}
}

function post (state = initialPostsState, action) {
	switch (action.type) {
		case SEND_POST:
			const { post } = action
			return {
				...state,
				posts: {
					...state.posts,
					[post.id]: post
				}
			}
		case EDIT_POST:
			const { id, title, author, body, category } = action
			return {
				...state,
				posts: {
					...state.posts,
					[id]: {
						...state.posts[id],
						title: title,
						author: author,
						body: body,
						category: category,
					}
				}
			}
		case DELETE_POST:
			return {
				...state,
				posts: {
					...state.posts,
					[action.id]: {
						...state.posts[action.id],
						deleted: true,
					}
				}
			}
		case VOTE_POST:
			let newVoteScore = state.posts[action.id].voteScore
			newVoteScore = action.option === "upVote" ?  ++newVoteScore : --newVoteScore
			return {
				...state,
				posts: {
					...state.posts,
					[action.id]: {
						...state.posts[action.id],
						voteScore: newVoteScore,
					}
				}
			}
		case UPDATE_COMMENT_COUNT:
			let newCommentCount = state.posts[action.id].commentCount
			newCommentCount = action.option === "increase" ?  ++newCommentCount : --newCommentCount
			return {
				...state,
				posts: {
					...state.posts,
					[action.id]: {
						...state.posts[action.id],
						commentCount: newCommentCount,
					}
				}
			}
		default:
			return state
	}
}

function comment (state = initialCommentsState, action) {
	switch (action.type) {
		case SEND_COMMENT:
			const { comment } = action
			return {
				...state,
				comments: {
					...state.comments,
					[comment.id]: comment
				}
			}
		case EDIT_COMMENT:
			const { id, author, body } = action
			return {
				...state,
				comments: {
					...state.comments,
					[id]: {
						...state.comments[id],
						author: author,
						body: body,
					}
				}
			}
		case DELETE_COMMENT:
			return {
				...state,
				comments: {
					...state.comments,
					[action.id]: {
						...state.comments[action.id],
						deleted: true,
					}
				}
			}
		case VOTE_COMMENT:
			let newVoteScore = state.comments[action.id].voteScore
			newVoteScore = action.option === "upVote" ?  ++newVoteScore : --newVoteScore
			return {
				...state,
				comments: {
					...state.comments,
					[action.id]: {
						...state.comments[action.id],
						voteScore: newVoteScore,
					}
				}
			}
		default:
			return state
	}
}

export default combineReducers({
	post,
	comment
})