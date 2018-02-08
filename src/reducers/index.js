import { combineReducers } from 'redux'

import {
	INITIALIZE_POSTS,
	INITIALIZE_COMMENTS,
	INITIALIZE_CATEGORIES,
	SEND_POST,
	EDIT_POST,
	DELETE_POST,
	VOTE_POST,
	UPDATE_COMMENT_COUNT,
	OPEN_SUBMIT_MODAL,
	CLOSE_SUBMIT_MODAL,
	ORDER_BY,
	SEND_COMMENT,
	EDIT_COMMENT,
	DELETE_COMMENT,
	VOTE_COMMENT
} from '../actions'

const initialPostsState = {
	posts: {},
	categories: [],
  submitModal: false,
}

const initialCommentsState = {
	comments: {}
}

function post (state = initialPostsState, action) {
	switch (action.type) {
		case INITIALIZE_POSTS:
			const { posts } = action
			const allposts = posts.reduce((postsObject, singlePost) => {
				return {
					...postsObject,
					[singlePost.id]: singlePost,
				}
			}, {})
			return {
				...state,
				posts: {
					...allposts,
				}
			}
		case INITIALIZE_CATEGORIES:
			const { categories } = action
			return {
				...state,
				categories: categories,
			}
		case ORDER_BY:
			const { compareFunction } = action
			let postsList = Object.keys(state.posts).map(key => state.posts[key])
			postsList.sort(compareFunction)
			const sortedPosts = postsList.reduce((postsObject, singlePost) => {
				return {
					...postsObject,
					[singlePost.id]: singlePost,
				}
			}, {})
			return {
				...state,
				posts: {
					...sortedPosts,
				}
			}
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
		case OPEN_SUBMIT_MODAL:
			return {
				...state,
				submitModal: action.open,
			}
		case CLOSE_SUBMIT_MODAL:
			return {
				...state,
				submitModal: action.close,
			}
		default:
			return state
	}
}

function comment (state = initialCommentsState, action) {
	switch (action.type) {
		case INITIALIZE_COMMENTS:
			const { comments } = action
			const allcomments = comments.reduce((commentsObject, singleComment) => {
				return {
					...commentsObject,
					[singleComment.id]: singleComment,
				}
			}, {})
			return {
				...state,
				comments: {
					...allcomments
				}
			}
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