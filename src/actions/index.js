export const SEND_POST = 'SEND_POST'
export const EDIT_POST = 'EDIT_POST'
export const DELETE_POST = 'DELETE_POST'
export const VOTE_POST = 'VOTE_POST'

export const SEND_COMMENT = 'SEND_COMMENT'
export const EDIT_COMMENT = 'EDIT_COMMENT'
export const DELETE_COMMENT = 'DELETE_COMMENT'
export const VOTE_COMMENT = 'VOTE_COMMENT'

export function sendPost (post) {
	return {
		type: SEND_POST,
		post,
	}
}

export function editPost ({ id, timestamp, title, body }) {
	return {
		type: EDIT_POST,
		id,
		timestamp,
		title,
		body,
	}
}

export function deletePost ({ id }) {
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

export function sendComment (comment) {
	return {
		type: SEND_COMMENT,
		comment,
	}
}

export function editComment ({ id, timestamp, body }) {
	return {
		type: EDIT_COMMENT,
		id,
		timestamp,
		body,
	}
}

export function deleteComment ({ id }) {
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

