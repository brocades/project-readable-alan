export const SEND_POST = 'SEND_POST'
export const EDIT_POST = 'EDIT_POST'
export const DELETE_POST = 'DELETE_POST'
export const VOTE_POST = 'VOTE_POST'
export const UPDATE_COMMENT_COUNT = 'UPDATE_COMMENT_COUNT'
export const INITIALIZE_CONTENT = 'INITIALIZE_CONTENT'

export const SEND_COMMENT = 'SEND_COMMENT'
export const EDIT_COMMENT = 'EDIT_COMMENT'
export const DELETE_COMMENT = 'DELETE_COMMENT'
export const VOTE_COMMENT = 'VOTE_COMMENT'

export function initializeApp (posts, comments) {
	return {
		type: INITIALIZE_CONTENT,
		posts,
		comments,
	}
}

export function sendPost (post) {
	return {
		type: SEND_POST,
		post,
	}
}

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

export function deletePost ( id ) {
	return {
		type: DELETE_POST,
		id,
	}
}

export function votePost ({ id, option }) {
	return {
		type: VOTE_POST,
		id,
		option,
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

export function editComment ({ id, author, body }) {
	return {
		type: EDIT_COMMENT,
		id,
		author,
		body,
	}
}

export function deleteComment (id) {
	return {
		type: DELETE_COMMENT,
		id,
	}
}

export function voteComment ({ id, option }) {
	return {
		type: VOTE_COMMENT,
		id,
		option,
	}
}
