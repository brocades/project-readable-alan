import * as ReadableAPI from '../ReadableAPI'

export const SEND_POST = 'SEND_POST'
export const EDIT_POST = 'EDIT_POST'
export const DELETE_POST = 'DELETE_POST'
export const VOTE_POST = 'VOTE_POST'
export const UPDATE_COMMENT_COUNT = 'UPDATE_COMMENT_COUNT'
export const INITIALIZE_POSTS = 'INITIALIZE_POSTS'
export const INITIALIZE_COMMENTS = 'INITIALIZE_COMMENTS'
export const INITIALIZE_CATEGORIES = 'INITIALIZE_CATEGORIES'
export const OPEN_SUBMIT_MODAL = 'OPEN_SUBMIT_MODAL'
export const CLOSE_SUBMIT_MODAL = 'CLOSE_SUBMIT_MODAL'

export const ORDER_BY = 'ORDER_BY'

export const SEND_COMMENT = 'SEND_COMMENT'
export const EDIT_COMMENT = 'EDIT_COMMENT'
export const DELETE_COMMENT = 'DELETE_COMMENT'
export const VOTE_COMMENT = 'VOTE_COMMENT'

export function initializePosts (posts) {
	return {
		type: INITIALIZE_POSTS,
		posts,
	}
}

export const initializeAppPosts = () => dispatch => (
	ReadableAPI
		.getAllPosts()
		.then(posts => dispatch(initializePosts(posts)))
)

export function orderBy( compareFunction ) {
	return {
		type: ORDER_BY,
		compareFunction,
	}
}

export function initializeComments (comments) {
	return {
		type: INITIALIZE_COMMENTS,
		comments,
	}
}

export const initializeAppComments = () => dispatch => (
	ReadableAPI
		.getAllComments()
		.then(comments => dispatch(initializeComments(comments)))
)

export function initializeCategories (categories) {
	return {
		type: INITIALIZE_CATEGORIES,
		categories,
	}
}

export const initializeAppCategories = () => dispatch => (
	ReadableAPI
		.getCategories()
		.then(categories => dispatch(initializeCategories(categories)))
)

export function sendPost (post) {
	return {
		type: SEND_POST,
		post,
	}
}

export const uploadPost = (post) => dispatch => (
	ReadableAPI
		.uploadPost(post)
		.then(post => dispatch(sendPost(post)))
)

export function editPost ({ id, title, author, body, category }) {
	return {
		type: EDIT_POST,
		id,
		title,
		author,
		body,
		category,
	}
}

export const updatePost = (post) =>  dispatch => (
	ReadableAPI
		.updatePost(post)
		.then(() => dispatch(editPost(post)))
)

export function deletePost ( id ) {
	return {
		type: DELETE_POST,
		id,
	}
}

export const removePost = (id) => dispatch => (
	ReadableAPI
		.deletePost(id)
		.then(() => dispatch(deletePost(id)))
)

export function votePost ({ id, option }) {
	return {
		type: VOTE_POST,
		id,
		option,
	}
}

export const voteOnPost = ({ id, option }) => dispatch => (
	ReadableAPI
		.votePost( id, option )
		.then(() => dispatch(votePost({ id, option })))
)

export function openSubmitModal () {
	return {
		type: OPEN_SUBMIT_MODAL,
		open: true,
	}
}

export function closeSubmitModal () {
	return {
		type: CLOSE_SUBMIT_MODAL,
		close: false,
	}
}

export function updateCommentCount ({ id, option }) {
	return {
		type: UPDATE_COMMENT_COUNT,
		id,
		option,
	}
}

export function sendComment (comment) {
	return {
		type: SEND_COMMENT,
		comment,
	}
}

export const uploadComment = (comment) => dispatch => (
	ReadableAPI
		.uploadComment(comment)
		.then(() => {
			dispatch(sendComment(comment))
			dispatch(updateCommentCount({ id: comment.parentId, option: "increase"}))
		})
)

export function editComment ({ id, author, body }) {
	return {
		type: EDIT_COMMENT,
		id,
		author,
		body,
	}
}

export const updateComment = (comment) => dispatch => (
	ReadableAPI
		.updateComment(comment)
		.then(() => dispatch(editComment(comment)))
)

export function deleteComment (id) {
	return {
		type: DELETE_COMMENT,
		id,
	}
}

export const removeComment = (comment) =>  dispatch => (
	ReadableAPI
		.deleteComment(comment.id)
		.then(() => {
				dispatch(deleteComment(comment.id))
				dispatch(updateCommentCount({ id: comment.parentId, option: "decrease" }))
			})
)

export function voteComment ({ id, option }) {
	return {
		type: VOTE_COMMENT,
		id,
		option,
	}
}

export const voteOnComment = ({ id, option }) => dispatch => (
	ReadableAPI
		.voteComment(id, option)
		.then(() => dispatch(voteComment({ id, option })))
)