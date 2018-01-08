import {
	SEND_POST,
	EDIT_POST,
	DELETE_POST,
	VOTE_POST,
	SEND_COMMENT,
	EDIT_COMMENT,
	DELETE_COMMENT,
	VOTE_COMMENT
} from '../actions'

const initialAppState = {
	posts: [{
		id: null,
		timestamp: null,
		title: null,
		body: null,
		author: null,
		category: null,
		voteScore: null,
		deleted: null,
	}],
	comments: [{
		id: null,
		parentId: null,
		timestamp: null,
		body: null,
		author: null,
		voteScore: null,
		deleted: null,
		parentDeleted: null,
	}]
}

